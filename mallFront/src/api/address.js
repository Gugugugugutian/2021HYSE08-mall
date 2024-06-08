import { httpPost, httpGet } from './public.js';

// 创建地址表（执行建表语句）
export function createAddressTable() {
    return httpGet({
        url: '/api/address',
        params: {},
    });
}

// 添加新地址
export function addAddress(username, name, phone, city, street) {
    return httpPost({
        url: '/api/address/add',
        data: {
            username: username,
            name: name,
            phone: phone,
            city: city,
            street: street,
        },
    });
}

// 删除地址
export function deleteAddress(id) {
    return httpPost({
        url: '/api/address/delete',
        data: {
            id: id,
        }
    });
}

// 获取地址
export function getAddressByUsername(username) {
    return httpGet({
        url: '/api/address/get',
        params: {
            username: username,
        },
    });
}
