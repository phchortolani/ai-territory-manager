;
import { ApiClient } from "./api_client";
import { Leaders } from "@/models/leaders";

const controller = 'leaders'

export async function getLeaders() {
    'use client'
    return await ApiClient().get<Leaders[]>(controller).then(result => {
        return result.data
    }).catch(x => console.log(x))
}

