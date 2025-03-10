
'use client'
import axios from "axios";
import { parseCookies } from "nookies";

export function ApiClient() {
    const { 'ai-tab-token': token } = parseCookies()

    const axiosInstance = axios.create({
        baseURL: process.env.NEXT_PUBLIC_API_URL,
        headers: {
            Authorization: token ? `Bearer ${token}` : undefined
        },
    })
    return axiosInstance
}