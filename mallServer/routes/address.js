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
        'id INT NOT NULL AUTO_INCREMENT, ' +
        'userId INT NOT NULL, ' +
        'name VARCHAR(20) NOT NULL, ' +
        'phone VARCHAR(20) NOT NULL, ' +
        'address VARCHAR(100) NOT NULL, ' +
        'PRIMARY KEY (id))',
    // 添加地址
    addAddress: 'INSERT INTO address (userId, name, phone, address) VALUES (?, ?, ?, ?)',
    // 根据用户username获取地址
    getAddressByUsername: 'SELECT * FROM address WHERE username = ?',
    // 根据id删除地址
    deleteAddress: 'DELETE FROM address WHERE id = ?',
}

module.exports = router;