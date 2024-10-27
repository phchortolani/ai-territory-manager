'use client'

import { TplDayTime } from "@/models/tpl_day_time";
import { ApiClient } from "./api_client";


const controller = 'TplDayTime'

export async function getTimes() {
    const times = await ApiClient().get<TplDayTime[]>(controller).then(result => {
        return result.data
    })
    return times
}

export async function updateTplDayTime(TplDayTime: TplDayTime) {
    return await ApiClient()
        .put<TplDayTime>(`${controller}/${TplDayTime.id}`, TplDayTime).then(result => {
            return result.data
        })
}

export async function saveTplDayTime(TplDayTime: TplDayTime) {
    const response = await ApiClient()
        .post<TplDayTime>(controller, TplDayTime).then(result => {
            return result.data
        })

    return response;
}


export async function deleteTplDayTime(id: number) {
    await ApiClient()
        .delete<TplDayTime>(`${controller}/${id}`).then(result => {
            return result.data
        })

    return true
}

