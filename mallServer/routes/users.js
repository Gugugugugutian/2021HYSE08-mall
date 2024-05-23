var express = require('express');
var router = express.Router();
// database connection
var mysql = require('mysql2');
var dbConfig = require('../database/db');
var pool = mysql.createPool(dbConfig.mysql);

// SQL语句
var sql = {
    createTable: 'CREATE TABLE IF NOT EXISTS users(id INT NOT NULL AUTO_INCREMENT,username VARCHAR(20) NOT NULL, password VARCHAR(20) NOT NULL, isAdmin BOOLEAN NOT NULL, PRIMARY KEY (id));',
    createUser: 'INSERT INTO users(username, password, isAdmin) VALUES (?, ?, ?);',
    getUser: 'SELECT * FROM users WHERE username = ? AND password = ?;',
    getUserByName: 'SELECT * FROM users WHERE username = ?;'
}

// @URL /users/
// @FUNCTION 测试数据库链接
// @Code  0   成功连接数据库
//        -1  失败
router.get('/', function (req, res, next) {
    if (pool) {
        pool.query(sql.createTable, function (err, result) {
            if (err) {
                console.log('[DB INITIALIZE ERROR] - ', err.message);
            } else {
                res.json({
                    status: '0',
                    msg: 'Succees to connect database on server.'
                });
            }
        });
    } else {
        res.json({
            status: '-1',
            msg: 'Failed to connect database on server. '
        });
    }
});

// @URL /users/register/
// @FUNCTION 创建用户
// @Code  0     成功创建用户
//        -1    用户名已存在，无法创建
//        -2    数据库连接失败
router.post('/register/', (req, res, next) => {
    let userName = req.body.username;
    let password = req.body.password;
    // 如果用户名已存在，则返回错误信息
    pool.query(sql.getUserByName, [userName], function (err, result) {
        if (err) {
            console.log('[SELECT ERROR] - ', err.message);
            res.send({
                status: '-1',
                msg: 'Failed to connect database on server.'
            });
        } else {
            if (result.length > 0) {
                res.send({
                    status: '-1',
                    msg: 'User name already exists.'
                });
            } else {
                pool.query(sql.createUser, [userName, password, false], function (err, result) {
                    if (err) {
                        console.log('[INSERT ERROR] - ', err.message);
                        res.send({
                            status: '-2',
                            msg: 'Failed to connect database on server.'
                        });
                    } else {
                        res.send({
                            status: '0',
                            msg: 'Succees to create user.'
                        });
                    }
                });
            }
        }
    });
});

// @URL /users/login/
// @FUNCTION 用户登录
// @Code  0   成功登录
//        -1  用户名或密码错误
//        -2  数据库连接失败
// @Cookie user   用户信息
router.get('/login/:username/:password/', (req, res, next) => {
    let userName = req.params.username;
    let password = req.params.password;
    pool.query(sql.getUser, [userName, password], function (err, result) {
        if (err) {
            console.log('[SELECT ERROR] - ', err.message);
            res.json({
                status: '-2',
                msg: 'Failed to connect database on server.'
            });
        } else {
            if (result.length > 0) {
                res.cookie('user', result[0]);
                res.json({
                    status: '0',
                    msg: 'Succees to login.',
                    data: result[0]
                });
            } else {
                res.json({
                    status: '-1',
                    msg: 'Failed to login. Check your username and password.'
                });
            }
        }
    });
});

// @URL /users/logout/
// @FUNCTION 用户登出
// @Code  0   成功登出
//        -1  用户未登录
router.get('/logout', (req, res, next) => {
    if (req.cookies.user) {
        res.clearCookie('user');
        res.json({
            status: '0',
            msg: 'Succees to logout.'
        });
    } else {
        res.json({
            status: '-1',
            msg: 'Failed to logout. You are not logged in.'
        });
    }
});

module.exports = router;
