'use client'
import { Brother } from "@/models/brother";
import { ApiClient } from "./api_client";

const controller = 'brothers'

export async function getBrothers() {
    const brothers = await ApiClient().get<Brother[]>(controller).then(result => {
        return result.data.sort((a, b) => a.brother_name.localeCompare(b.brother_name))
    }).catch(x => [])

    return brothers
}

export async function updateBrother(brother: Brother) {

    const response = await ApiClient()
        .put<Brother>(`${controller}/${brother.id}`, brother).then(result => {
            return result.data
        }).catch(x => { })

    return response

}

