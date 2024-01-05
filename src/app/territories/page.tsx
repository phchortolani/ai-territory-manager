import { TerritoryAndressDto } from "@/dtos/territoryAndressDto"
import { TupleTerritoryAndress } from "@/dtos/tupleTerritoryAndress"
import { Territory } from "@/models/territory"
import { getTerritories } from "@/services/territoriesService"
import { HomeIcon, MagnifyingGlassIcon } from '@heroicons/react/24/outline'
import { SearchTerritories } from "./search-territories"

export default async function Terrritories() {
    const { territories, andressList }: TupleTerritoryAndress = await getTerritories()

    return <SearchTerritories territories={territories} andressList={andressList} />

}