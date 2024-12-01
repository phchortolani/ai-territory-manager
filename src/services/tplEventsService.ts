'use client'

import { TplEvent } from "@/models/tpl_event";
import { ApiClient } from "./api_client";
import { EventData } from "@/app/(with_auth)/brothers/modal_tpl";


const controller = 'TplEvents'

export async function generateTplEvents({ initial_date, final_date, event_id }: { initial_date: Date, final_date: Date, event_id?: number }) {
    const Events = await ApiClient().post<EventData[]>(controller + '/generate', { initial_date, final_date, event_id }).then(result => {
        return result.data
    })
    return Events
}

export async function getTplEvents({ initial_date, final_date }: { initial_date: Date, final_date: Date }) {
    const Events = await ApiClient().post<EventData[]>(controller + '/getByDate', { initial_date, final_date }).then(result => {
        return result.data
    })
    return Events
}



export async function updateTplEvent(TplEvent: TplEvent) {
    return await ApiClient()
        .put<TplEvent>(`${controller}/${TplEvent.id}`, TplEvent).then(result => {
            return result.data
        })
}

export async function saveTplEvent(TplEvent: TplEvent) {
    const response = await ApiClient()
        .post<TplEvent>(controller, TplEvent).then(result => {
            return result.data
        })

    return response;
}


export async function deleteTplEvent(id: number) {
    await ApiClient()
        .delete<TplEvent>(`${controller}/${id}`).then(result => {
            return result.data
        })

    return true
}

