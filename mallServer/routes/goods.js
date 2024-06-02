var express = require('express');
var router = express.Router();
// database connection
var mysql = require('mysql2');
var dbConfig = require('../database/db');
var pool = mysql.createPool(dbConfig.mysql);

var sql = {
    // 创建商品表
    createGoodsTable:
        'CREATE TABLE IF NOT EXISTS goods(' +
        'id INT NOT NULL AUTO_INCREMENT,' +     // id
        'name VARCHAR(255) NOT NULL,' +         // 商品名
        'price INT NOT NULL,' +                 // 价格
        'stock INT NOT NULL,' +                 // 库存
        'img VARCHAR(255) NOT NULL,' +          // 图片
        'PRIMARY KEY (id))',
    // 插入商品
    insertGoods: 'INSERT INTO goods(name,price,stock,img) VALUES(?,?,?,?)',
    // 展示所有
    selectGoods: 'SELECT * FROM goods',
    // 根据id查询商品
    selectGoodsById: 'SELECT * FROM goods WHERE id = ?',
    // 根据id删除商品
    deleteGoodsById: 'DELETE FROM goods WHERE id = ?',
    // 根据id更新商品
    updateGoodsById: {
        name: 'UPDATE goods SET name = ? WHERE id = ?',
        price: 'UPDATE goods SET price = ? WHERE id = ?',
        stock: 'UPDATE goods SET stock = ? WHERE id = ?',
        sales: 'UPDATE goods SET sales = ? WHERE id = ?',
        img: 'UPDATE goods SET img = ? WHERE id = ?',
        all: 'UPDATE goods SET name = ?, price = ?, stock = ?, sales = ?, img = ? WHERE id = ?'
    },
    // 根据关键字搜索商品
    searchGoods: 'SELECT * FROM goods WHERE name LIKE ?',
    // 分页获取商品
    getGoodsByPage: 'SELECT * FROM goods LIMIT ?, ?',
}

// 创建商品表
// url: /goods
router.get('/', function (req, res, next) {
    pool.getConnection(function (err, connection) {
        connection.query(sql.createGoodsTable, function (err, result) {
            if (err) {
                console.log(err.message);
                res.status(500).send({
                    code: 1,
                    msg: '创建商品表失败'
                })
            } else {
                res.status(200).send({
                    code: 0,
                    msg: '创建商品表成功'
                });
            }
        });
    });
});

// 获取所有商品
// url: /goods/all
router.get('/all', function (req, res, next) {
    pool.getConnection(function (err, connection) {
        connection.query(sql.selectGoods, function (err, result) {
            if (err) {
                console.log(err.message);
                res.status(500).send({
                    code: 1,
                    msg: '获取商品失败'
                })
            } else {
                res.status(200).send({
                    code: 0,
                    msg: '获取商品成功',
                    data: result
                });
            }
        });
    });
});

// 根据id获取商品
// url: /goods/id
// params: id
router.get('/id', function (req, res, next) {
    var id = req.query.id;
    pool.getConnection(function (err, connection) {
        connection.query(sql.selectGoodsById, id, function (err, result) {
            if (err) {
                console.log(err.message);
                res.status(500).send({
                    code: 1,
                    msg: '获取商品失败'
                })
            } else {
                res.status(200).send(
                    {
                        code: 0,
                        msg: '获取商品成功',
                        data: result
                    }
                )
            }
        });
    });
});

// 根据关键字搜索商品
// url: /goods/search
// params: keyword
router.get('/search', function (req, res, next) {
    var keyword = '%' + req.query.keyword + '%';
    pool.getConnection(function (err, connection) {
        connection.query(sql.searchGoods, keyword, function (err, result) {
            if (err) {
                console.log(err.message);
                res.status(500).send({
                    code: 1,
                    msg: '搜索商品失败'
                })
            } else {
                res.status(200).send(
                    {
                        code: 0,
                        msg: '搜索商品成功',
                       data: result
                   });
               }
           })
       });
});

// 分页获取商品
// url: /goods/page
// params: page, pageSize
router.get('/page', function (req, res, next) {
    var page = req.query.page;
    var pageSize = req.query.pageSize;
    pool.getConnection(function (err, connection) {
        connection.query(sql.getGoodsByPage, [page, pageSize], function (err, result) {
            if (err) {
                console.log(err.message);
                res.status(500).send({
                    code: 1,
                    msg: '获取商品失败'
                })
            } else {
                res.status(200).send(
                    {
                        code: 0,
                        msg: '获取商品成功',
                        data: result
                    }
                )
            }
        });
    });
});

module.exports = router;