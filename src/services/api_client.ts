
'use client'
import axios from "axios";

export function ApiClient() {
    const axiosInstance = axios.create({
        baseURL: process.env.NEXT_PUBLIC_API_URL
    })
    return axiosInstance
}