/* eslint-disable @typescript-eslint/no-explicit-any */
import { BACKEND_URL, CONTEXT_PATH } from '@/constants/app.environment';
import axios, { AxiosInstance } from 'axios';

const instance: AxiosInstance = axios.create({
    baseURL: BACKEND_URL + CONTEXT_PATH,
    timeout: 30000,
    timeoutErrorMessage: 'Time out!',
});

async function post(route: string, body = {}, headers = {}) {
    try {
        return await instance.post(route, body, { headers }).then((response) => {
            return response.data;
        });
    } catch (error: any) {
        if (error.response && error.response.data && error.response.data.message) {
            throw new Error(error.response.data.message);
        } else {
            throw new Error('An unknown error occurred');
        }
    }
}

async function get(route: string, header = {}) {
    try {
        return await instance.get(`${route}`, header).then((response) => {
            return response.data;
        });
    } catch (error: any) {
        throw new Error(error.response.data.message);
    }
}
export { instance, post, get };
