var express = require('express');
var router = express.Router();
// database connection
var mysql = require('mysql2');
var dbConfig = require('../database/db');
var pool = mysql.createPool(dbConfig.mysql);

// SQL语句
var sql = {
    // 创建用户表
    createTable:
        'CREATE TABLE IF NOT EXISTS users(' +
        'id INT NOT NULL AUTO_INCREMENT,' +
        'username VARCHAR(20) NOT NULL, ' +
        'password VARCHAR(20) NOT NULL, ' +
        'isAdmin BOOLEAN NOT NULL, ' +
        'PRIMARY KEY (id));',
    // 创建用户
    createUser: 'INSERT INTO users(username, password, isAdmin) VALUES (?, ?, ?);',
    // 获取用户（根据用户名和密码）
    getUser: 'SELECT * FROM users WHERE username = ? AND password = ?;',
    // 获取用户（根据用户名）
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
                res.status(200).json({
                    msg: 'Succees to connect database on server.'
                });
            }
        });
    } else {
        res.status(500).json({
            msg: 'Failed to connect database on server. '
        });
    }
});

// @URL /users/register/
// @FUNCTION 创建用户
// @RETURN { status, msg }
// @Status      0       成功创建用户
//              1       用户名已存在，无法创建
//              -1      数据库连接失败
router.post('/register/', (req, res, next) => {
    let userName = req.body.username;
    let password = req.body.password;
    // 如果用户名已存在，则返回错误信息
    pool.query(sql.getUserByName, [userName], function (err, result) {
        if (err) {
            console.log('[SELECT ERROR] - ', err.message);
            res.status(500).json({
                code: '-1',
                msg: 'Failed to connect database on server.'
            });
        } else {
            if (result.length > 0) {
                res.status(406).json({
                    code: '1',
                    msg: 'User name already exists.'
                });
            } else {
                pool.query(sql.createUser, [userName, password, false], function (err, result) {
                    if (err) {
                        console.log('[INSERT ERROR] - ', err.message);
                        res.status(500).json({
                            code: '-1',
                            msg: 'Failed to connect database on server.'
                        });
                    } else {
                        res.status(200).json({
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
//        1  用户名或密码错误
//        -1  数据库连接失败
router.post('/login/', (req, res, next) => {
        let userName = req.body.username;
        let password = req.body.password;
        // 验证用户名密码
        pool.query(sql.getUser, [userName, password], function (err, result) {
            if (err) {
                console.log('[SELECT ERROR] - ', err.message);
                res.status(500).json({
                    status: '-1',
                    msg: 'Failed to connect database on server.'
                });
            } else {
                if (result.length > 0) {
                    console.log(req.session.id);
                    if(req.session.username === userName) {
                        res.status(200).json({
                            code: '0',
                            msg: '无需重复登录'
                        });
                    } else {
                        // Session 记录/更新登录状态
                        req.session.username = userName;
                        // 登录成功
                        res.status(200).json({
                            code: '0',
                            msg: 'Succees to login.',
                            // sid: req.session.id,
                        });
                    }
                } else {
                    res.status(403).json({
                        code: '1',
                        msg: 'User name or password error.'
                    });
                }
            }
        })
});

// 检查登录状态
// @Code  0   已登录 同时返回用户名
//        1   未登录
router.get('/checkLogin/', (req, res, next) => {
    if(req.session.username) {
        res.status(200).send({
            code: '0',
            msg: '已登录',
            username: req.session.username
        });
    } else {
        res.status(401).json({
            code: '1',
            msg: '未登录'
        });
    }
});

// 用户退出
// @Code  0   成功退出
router.get('/logout/', (req, res, next) => {
    req.session.destroy();
    res.send({
        code: '0',
        msg: '退出成功'
    });
});

module.exports = router;
