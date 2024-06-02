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
        'completionTime varchar(20)' + // 付款时间
        ')',
    // 创建订单明细表
    createOrderItemTable:
        'create table if not exists order_item_table(' +
        'orderId int not null, ' +      // 订单id
        'name varchar(20),' +           // 商品名称
        'quantity int,' +               // 商品数量
        'price varchar(20)'+           // 商品最终价格
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
    const completionTime = req.body.completionTime;
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

function getOrderItem(orderId) {
    console.log(orderId);
    return new Promise((resolve, reject) => {
        pool.getConnection(function (err, connection) {
            connection.query(sql.queryOrderItem, [orderId], function (err, result) {
                if (err) {
                    console.log(err.message);
                    reject(err);
                } else {
                    resolve(result);
                }
            });
        });
    });
}
// 根据用户名查询订单
// url: /orders/query
// params: username
router.get('/query', function (req, res, next) {
    let order = [];
    return new Promise((resolve, reject) => {
        // 根据用户名获得所有订单
        const username = req.query.username;
        pool.getConnection(function (err, connection) {
            connection.query(sql.queryOrder, [username], function (err, result) {
                if (err) {
                    console.log(err.message);
                    reject(err);
                } else {
                    resolve(result);
                }
            });
        });
    }).then(result => {
        res.status(200).send({
            msg: '查询订单成功',
            order: result,
        });
    });
});

// 根据订单id查询订单明细
// url: /orders/queryitem
// params: orderId
router.get('/queryitem', function (req, res, next) {
    const orderId = req.query.orderId;
    getOrderItem(orderId).then((result) => {
        res.status(200).send({
            msg: '查询订单明细成功',
            orderItem: result,
        });
    });
});

module.exports = router;