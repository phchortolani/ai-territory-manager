'use client'
import { ApiClient } from "./api_client";
import { Leaders } from "@/models/leaders";

const controller = 'leaders'

export async function getLeaders() {
    return await ApiClient().get<Leaders[]>(controller).then(result => {
        return result.data.sort((a, b) => a.id - b.id)
    }).catch(x => console.log(x))
}

