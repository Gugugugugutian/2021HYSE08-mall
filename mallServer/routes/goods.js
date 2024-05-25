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
        'id INT NOT NULL AUTO_INCREMENT,' +
        'name VARCHAR(255) NOT NULL,' +
        'price INT NOT NULL,' +
        'sales INT NOT NULL,' +
        'stock INT NOT NULL,' +
        'img VARCHAR(255) NOT NULL,' +
        'PRIMARY KEY (id))',
    // 插入商品
    insertGoods: 'INSERT INTO goods(name,price,sales,stock,img) VALUES(?,?,?,?,?)',
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
}

// 创建商品表
router.get('/createGoodsTable', function (req, res, next) {
    pool.getConnection(function (err, connection) {
        connection.query(sql.createGoodsTable, function (err, result) {
            if (err) {
                console.log(err.message);
                res.send({
                    code: 1,
                    msg: '创建商品表失败'
                })
            } else {
                res.send({
                    code: 0,
                    msg: '创建商品表成功'
                });
            }
        });
    });
});



module.exports = router;