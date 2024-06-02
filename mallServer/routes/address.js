var express = require('express');
var router = express.Router();
// database connection
var mysql = require('mysql2');
var dbConfig = require('../database/db');
var pool = mysql.createPool(dbConfig.mysql);

var sql = {
    // 创建地址表
    createAddressTable:
        'CREATE TABLE IF NOT EXISTS address (' +
        'id INT NOT NULL AUTO_INCREMENT, ' + // id
        'username VARCHAR(20) NOT NULL, ' + // 地址对应的用户名
        'name VARCHAR(20) NOT NULL, ' +     // 姓名
        'phone VARCHAR(20) NOT NULL, ' +    // 电话
        'city VARCHAR(20) NOT NULL,' +      // 城市
        'street VARCHAR(100) NOT NULL, ' + // 街道
        'PRIMARY KEY (id))',
    // 添加地址
    addAddress: 'INSERT INTO address (username, name, phone, city, street) VALUES (?, ?, ?, ?, ?)',
    // 根据用户username获取地址
    getAddressByUsername: 'SELECT * FROM address WHERE username = ?',
    // 根据id删除地址
    deleteAddress: 'DELETE FROM address WHERE id = ?',
}

// 创建地址表
// url: /address
// params: none.
router.get('/', function (req, res, next) {
    pool.getConnection(function (err, connection) {
        connection.query(sql.createAddressTable, function (err, result) {
            if (err) {
                console.log(err.message);
                res.status(500).send({
                    code: 1,
                    msg: '创建地址表失败'
                })
            } else {
                res.status(200).send({
                    code: 0,
                    msg: '创建地址表成功'
                });
            }
        });
    });
});

// 添加地址
// url: /address/add
// params: username, name, phone, city, street.
router.post('/add', function (req, res, next) {
    pool.getConnection(function (err, connection) {
        connection.query(sql.addAddress, [req.body.username, req.body.name, req.body.phone, req.body.city, req.body.street], function (err, result) {
            if (err) {
                console.log(err.message);
                res.status(500).send({
                    code: 1,
                    msg: '添加地址失败' + err.message,
                })
            } else {
                res.status(200).send({
                    code: 0,
                    id: result.insertId,
                    msg: '添加地址成功'
               });
           }
       });
   });
});


// 根据用户username获取地址
// url: /address/get
// params: username
router.get('/get', function (req, res, next) {
    pool.getConnection(function (err, connection) {
        connection.query(sql.getAddressByUsername, req.query.username, function (err, result) {
            if (err) {
                console.log(err.message);
                res.status(500).send({
                    code: 1,
                    msg: '获取地址失败'
                })
            } else if (result.length === 0) {
                res.status(200).send({
                    code: 0,
                    data: [],
                    msg: '该用户没有地址'
                });
            } else {
                res.status(200).send({
                    code: 0,
                    data: result,
                    msg: '获取地址成功'
                });
            }
        })
    });
});

// 用户删除地址
// 每个地址有一个独立的id，通过ID进行删除
// url: /address/delete
// params: id
router.delete('/delete', function (req, res, next) {
    pool.getConnection(function (err, connection) {
        // if(!req.session.username) {
        //     res.status(401).send({
        //         code: 1,
        //         msg: '请先登录'
        //     });
        //     return;
        // }
        connection.query(sql.deleteAddress, req.query.id, function (err, result) {
            if (err) {
                console.log(err.message);
                res.status(500).send({
                    code: 1,
                    msg: '删除地址失败'
                })
            } else if (result.affectedRows === 0) {
                res.status(404).send({
                    code: 0,
                    msg: '该地址不存在'
                })
            } else {
                res.status(200).send({
                    code: 0,
                    msg: '删除地址成功'
                });
            }
        });
    });
});

module.exports = router;