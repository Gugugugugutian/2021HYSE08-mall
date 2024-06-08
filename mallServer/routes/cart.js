const express = require('express');
const router = express.Router();

// 模拟数据库中的购物车数据
let cartItems = [];

// 获取购物车中的所有商品
router.get('/items', (req, res) => {
  console.log('GET /api/cart/items called');
  res.json(cartItems);
});

// 添加商品到购物车
router.post('/add', (req, res) => {
  const newItem = req.body;
  console.log('Adding item to cart:', newItem);
  cartItems.push(newItem);
  res.status(201).json(newItem);
});


// 删除购物车中的商品
router.delete('/remove/:id', (req, res) => {
  const { id } = req.params;
  console.log('Removing item from cart with id:', id);
  const initialLength = cartItems.length;
  cartItems = cartItems.filter(item => item.id !== parseInt(id));
  const finalLength = cartItems.length;
  console.log(`Items before deletion: ${initialLength}, Items after deletion: ${finalLength}`);
  res.status(204).end();
});

// 更新购物车中的商品
router.post('/update', (req, res) => {
  const updatedItem = req.body;
  console.log('Updating item in cart:', updatedItem);
  cartItems = cartItems.map(item => item.id === updatedItem.id ? updatedItem : item);
  res.status(200).json(updatedItem);
});

module.exports = router;

