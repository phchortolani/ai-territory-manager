import { Territory } from "@/models/territory";
import { ApiServerFetch } from "./api";
import { TerritoryAndressDto } from "@/dtos/territoryAndressDto";
import { TupleTerritoryAndress } from "@/dtos/tupleTerritoryAndress";

const controller = 'territory'

export async function getTerritories() {
   return await ApiServerFetch<TupleTerritoryAndress>(controller + '/getFullTerritoriesList', { next: { revalidate: 10 } })
}