import { httpGet } from './public.js';

export function getGoods(){
    return httpGet({
        url: '/api/goods/all',
        params: {},
    })
}

export function searchGoods(keyword){
    return httpGet({
        url: '/api/goods/search',
        params: {
            keyword: keyword,
        },
    })
}