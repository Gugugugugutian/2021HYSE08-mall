var express = require('express');
var router = express.Router();
// database connection
var mysql = require('mysql2');
var dbConfig = require('../database/db');
var pool = mysql.createPool(dbConfig.mysql);

var sql = {
    // 创建订单表
    createOrderTable:
        'create table if not exists order_table(' +
        'id int primary key auto_increment,' + // id
        'username varchar(20),' +       // 下单用户
        'total varchar(20),' +          // 订单总价
        'address varchar(100),' +       // 地址
        'orderTime varchar(30),' +      // 下单时间
        'completionTime varchar(30)' +  // 付款时间
        ')charset=utf8mb4',
    // 创建订单明细表
    createOrderItemTable:
        'create table if not exists order_item_table(' +
        'orderId int not null, ' +      // 订单id
        'name varchar(20),' +           // 商品名称
        'quantity int,' +               // 商品数量
        'price varchar(20)'+            // 商品最终价格
        ')charset=utf8mb4',
    // 创建订单
    createOrder:
        'insert into order_table(username,address,orderTime) values(?,?,?)',
    // 创建订单明细
    createOrderItem:
        'insert into order_item_table(orderId,name,quantity,price) values(?,?,?,?)',
    // 查询订单
    queryOrder:
        'select * from order_table where username=?',
    // 查询订单明细
    queryOrderItem:
        'select name,quantity,price from order_item_table where orderId=?',
}

// 创建订单和订单明细表（建表语句）
// url: /orders/
router.get('/', function (req, res, next) {
    pool.getConnection(function (err, connection) {
        connection.query(sql.createOrderTable, function (err, result) {
            if (err) {
                console.log(err.message);
            }
        });
        connection.query(sql.createOrderItemTable, function (err, result) {
            if (err) {
                console.log(err.message);
            }
        });
        res.status(200).send('创建完成');
        connection.release();
    });
});

// 解析提交商品的字符串
function parseCart(str) {
    let result = [];
    str.split(',').map((item) => {
        const temp = item.split(':');
        result.push({
            id: temp[0],
            quantity: temp[1],
        })
    });
    return result;
}

// 创建订单
// url: /orders/create
// params: cart, address, username
// return: orderId, total
router.post('/create', function (req, res, next) {
    const username = req.body.username;
    const address = req.body.address;
    const cart = parseCart(req.body.cart);
    // 获取当前时间
    const date = new Date();
    const orderTime = date.getFullYear() + '-' + (date.getMonth() + 1) + '-' + date.getDate() + ' ' + date.getHours() + ':' + date.getMinutes() + ':' + date.getSeconds();
    let total = 0;
    let orderId = -1;

    new Promise((resolve, reject) => {
        // 创建订单，返回订单id
        pool.query(sql.createOrder, [username, address, orderTime], function (err, result) {
            if (err) {
                reject(err);
            } else {
                orderId = result.insertId;
                resolve(orderId);
            }
        })
    }).then(function (orderId) {
        return new Promise(function (resolve, reject){
            // 获取每个商品的单价, 计算总价
            pool.query('select id,price,name from goods where id in (?)', [cart.map(item => item.id)], function (err, result) {
                if (err) {
                    reject(err);
                } else {
                    let price = 0;
                    let priceMap = {};
                    let nameMap = {};
                    result.forEach(item => {
                        priceMap[item.id] = item.price;
                        nameMap[item.id] = item.name;
                    });
                    cart.forEach(item => {
                        const id = parseInt(item.id);
                        const quantity = parseInt(item.quantity);
                        if (priceMap[id] !== undefined) {
                            price += quantity * priceMap[id];
                        }
                    });
                    total = price;
                    resolve({priceMap, nameMap});
                }
            })
        }).then((Maps) => {
            return new Promise(function (resolve, reject) {
                // 创建订单明细
                cart.forEach(item => {
                    pool.query(sql.createOrderItem, [orderId, Maps.nameMap[item.id], item.quantity, Maps.priceMap[item.id]], function (err, result) {
                        if (err) {
                            reject(err);
                        }
                    })
                })
                // 更新商品库存
                cart.forEach(item => {
                    pool.query('update goods set stock=stock-? where id=?', [item.quantity, item.id], function (err, result) {
                        if (err) {
                            reject(err);
                        }
                    })
                })
                // 更新订单信息
                pool.query('update order_table set total=? where id=?', [total, orderId], function (err, result) {
                    if (err) {
                        reject(err);
                    }
                })
                resolve();
            }).then(() => {
                // 返回订单id和总价
                res.status(200).json({
                    msg: '创建订单成功',
                    orderId: orderId,
                    total: total,
                })
            }).catch(err => {
                res.status(500).json({
                    msg: '创建订单失败',
                    err: err.message,
                })
            })
        }).catch(err => {
            res.status(500).json({
                msg: '创建订单失败',
                err: err.message,
            })
        })
    }).catch(err => {
        res.status(500).json({
            msg: '创建订单失败',
            err: err.message,
        })
    })
});

// 根据用户名查询订单id和基本信息
// url: /orders/query
// params: username
// response: orderid, date, total, address, orderTime, completionTime
router.get('/query', function (req, res, next) {
    pool.query(sql.queryOrder, [req.query.username], function (err, result) {
        if(err) {
            res.status(500).json({
                msg: '查询订单失败',
                err: err.message,
            })
        } else {
            res.status(200).json({
                msg: '查询订单成功',
                order: result,
            })
        }
    })
});

// 根据订单id查询订单明细
// url: /orders/queryitem
// params: orderId
router.get('/queryitem', function (req, res, next) {
    const orderId = req.query.orderId;
    pool.query(sql.queryOrderItem, [orderId], function (err, result) {
        if(err) {
            res.status(500).json({
                msg: '查询订单失败',
                err: err.message,
            })
        } else {
            res.status(200).json({
                msg: '查询订单成功',
                order: result,
            })
        }
    })
});

// 订单支付
// url: /orders/pay
// params: orderId
router.post('/pay', function (req, res, next) {
    const orderId = req.body.orderId;
    const date = new Date();
    const completionTime = date.getFullYear() + '-' + (date.getMonth() + 1) + '-' + date.getDate() + ' ' + date.getHours() + ':' + date.getMinutes() + ':' + date.getSeconds();
    pool.getConnection(function (err, connection) {
        connection.query('update order_table set completionTime=? where id=?', [completionTime, orderId], function (err, result) {
            if (err) {
                console.log(err.message);
            } else {
                res.status(200).send({
                    msg: '支付成功',
                });
            }
        })
    })
})

module.exports = router;