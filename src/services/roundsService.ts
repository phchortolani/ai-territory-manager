import { RoundsDto } from "@/dtos/roundsDto";
import { ApiServerFetch } from "./api";
import { TupleTerritoryAndress } from "@/dtos/tupleTerritoryAndress";
import { EStatus_territory } from "@/enums/status_territory";

const controller = 'rounds'

export async function getRoundsByStatus(status?: EStatus_territory | null | undefined) {
    return await ApiServerFetch<RoundsDto[]>(controller + `/schedule/${status ?? ''}`, {
        next: { revalidate: 2 }
    })
}