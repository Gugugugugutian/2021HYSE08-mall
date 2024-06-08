import { httpGet } from './public.js';

export function getGoods(){
    return httpGet({
        url: '/api/goods/all',
        params: {},
    })
}