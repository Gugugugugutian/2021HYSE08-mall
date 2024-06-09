import { httpPost, httpGet } from './public.js';

// 创建订单表（执行建表语句）
export function createOrderTable() {
    return httpGet({
        url: '/api/orders',
        params: {},
    });
}

// 创建新订单
export function createOrder(username, address, cartString) {
    return httpPost({
        url: '/api/orders/create',
        data: {
            username: username,
            address: address,
            cart: cartString,
        },
    });
}

// 根据用户名查询订单
export function queryOrdersByUsername(username) {
    return httpGet({
        url: '/api/orders/query',
        params: {
            username: username,
        },
    });
}

// 根据订单ID查询订单详情
export function queryOrderById(orderId) {
    return httpGet({
        url: '/api/orders/queryitem',
        params: {
            orderId: orderId,
        },
    });
}

// 根据订单id支付订单
export function payOrder(orderId) {
    return httpPost({
        url: '/api/orders/pay',
        params: {
            orderId: orderId,
        },
    });
}