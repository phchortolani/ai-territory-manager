import { RoundsDto } from "@/dtos/roundsDto";
import { ApiServerFetch } from "./api";;
import { EStatus_territory } from "@/enums/status_territory";
import { ApiClient } from "./api_client";

const controller = 'rounds'

export async function getRoundsByStatus(status?: EStatus_territory | null | undefined) {
    return await ApiServerFetch<RoundsDto[]>(controller + `/schedule/${status ?? ''}`, {
        cache: 'no-cache'
    })
}

export async function MarkRoundAsDone(round: RoundsDto, status: number) {
    'use client'
    return await ApiClient().post<boolean>(controller + `/markRoundAsDone/${round.id}`, { status: status }).then(result => {
        return result
    }).catch(x => console.log(x))
}