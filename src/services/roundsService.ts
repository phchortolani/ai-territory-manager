'use client'
import { RoundsDto } from "@/dtos/roundsDto";
import { ApiServerFetch } from "./api";;
import { EStatus_territory } from "@/enums/status_territory";
import { ApiClient } from "./api_client";
import { S13 } from "@/dtos/s13";
import { ISchedule } from "@/dtos/schedule";
import { AxiosError } from "axios";

const controller = 'rounds'


export async function getRoundsByStatus(status?: EStatus_territory | null | undefined): Promise<RoundsDto[]> {
    try {
        const response = (await ApiClient().get(controller + `/schedule/${status ?? ''}`))

        if (response.status === 200 && response.data) return response.data
        else {
            throw { error: response.data?.error || 'Erro desconhecido' };
        }
    } catch (error) {
        const err = error as AxiosError<{ error: string }>;
        throw { error: err.response?.data?.error || 'Erro de conexão ou outro erro inesperado' };
    }
}

export async function DeleteRound(uid: string) {
    return await ApiClient().delete<boolean>(controller + `/schedule/${uid}`).then(result => {
        return result
    }).catch(x => console.log(x))
}

export async function getRoundsByUID(uid: string): Promise<RoundsDto[]> {
    try {
        const response = (await ApiClient().get(controller + `/schedule/roundsByUID/${uid}`))

        if (response.status === 200 && response.data) return response.data
        else {
            throw { error: response.data?.error || 'Erro desconhecido' };
        }
    } catch (error) {
        const err = error as AxiosError<{ error: string }>;
        throw { error: err.response?.data?.error || 'Erro de conexão ou outro erro inesperado' };
    }
}


export async function MarkRoundAsDone(round: RoundsDto, status: number) {
    'use client'
    return await ApiClient().post<boolean>(controller + `/markRoundAsDone/${round.id}`, { status: status }).then(result => {
        return result
    }).catch(x => console.log(x))
}

export async function getS13(): Promise<S13[]> {
    try {
        const response = (await ApiClient().get(controller + `/getS13`))

        if (response.status === 200 && response.data) return response.data
        else {
            throw { error: response.data?.error || 'Erro desconhecido' };
        }
    } catch (error) {
        const err = error as AxiosError<{ error: string }>;
        throw { error: err.response?.data?.error || 'Erro de conexão ou outro erro inesperado' };
    }
}




export async function Schedule(schedule: ISchedule) {
    return await ApiClient().post<string>(`${controller}/schedule/${schedule.leader_id}`, schedule).then(result => {
        return result.data
    }).catch(x => console.log(x))
}