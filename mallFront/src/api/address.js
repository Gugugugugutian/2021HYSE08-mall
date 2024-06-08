import { httpPost, httpGet, httpDelete } from './public.js';

// 创建地址表（执行建表语句）
export function createAddressTable() {
    return httpGet({
        url: '/address',
        params: {},
    });
}

// 添加新地址
export function addAddress(username, name, phone, city, street) {
    return httpPost({
        url: '/address/add',
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
    return httpDelete({
        url: '/address/delete',
        data: {
            id: id,
        },
    });
}

// 获取地址
export function getAddress(username) {
    return httpGet({
        url: '/address/get',
        params: {
            username: username,
        },
    });
}
