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
        'date varchar(20),' +           // 下单日期
        'total varchar(20),' +          // 订单总价
        'address varchar(100),' +       // 地址
        'orderTime varchar(20),' +      // 下单时间
        'completionTime varchar(20)' +  // 付款时间
        ')',
    // 创建订单明细表
    createOrderItemTable:
        'create table if not exists order_item_table(' +
        'orderId int not null, ' +      // 订单id
        'name varchar(20),' +           // 商品名称
        'quantity int,' +               // 商品数量
        'price varchar(20)'+            // 商品最终价格
        ')',
    // 创建订单
    createOrder:
        'insert into order_table(username,date,total,address,orderTime,completionTime) values(?,?,?,?,?,?)',
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

// 创建订单和订单明细表
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

// 创建订单
// url: /orders/create
// params:  username, date, total, address, orderTime,
//          completionTime, goods(Array)
router.post('/create', function (req, res, next) {
    const username = req.body.username;
    const date = req.body.date;
    const total = req.body.total;
    const address = req.body.address;
    const orderTime = req.body.orderTime;
    const completionTime = 'unpaid';
    const goods = req.body.goods;
    console.log(req.body);
    pool.getConnection(function (err, connection) {
        connection.query(sql.createOrder, [username, date, total, address, orderTime, completionTime], function (err, result) {
            if (err) {
                console.log(err.message);
            } else {
                var orderId = result.insertId;
                for (var i = 0; i < goods.length; i+=3) {
                    var name = req.body.goods[i];
                    var quantity = req.body.goods[i+1];
                    var price = req.body.goods[i+2];
                    // 在商品表中查找商品，扣减余量 stock
                    connection.query('update goods set stock=stock-? where name=?', [quantity, name], function (err, result) {
                        if (err) {
                            console.log(err.message);
                        }
                    });
                    // 创建订单明细
                    connection.query(sql.createOrderItem, [orderId, name, quantity, price], function (err, result) {
                        if (err) {
                           console.log(err.message);
                        }
                    });
                }
                res.status(200).send({
                    msg: '创建订单成功',
                    orderId: orderId,
                });
           }
        });
    });
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
    pool.getConnection(function (err, connection) {
        connection.query('update order_table set completionTime=? where orderId=?', [new Date(), orderId], function (err, result) {
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