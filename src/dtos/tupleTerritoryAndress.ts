import { Territory } from "@/models/territory";
import { TerritoryAndressDto } from "./territoryAndressDto";

export interface TupleTerritoryAndress {
    territories: Territory[],
    andressList: TerritoryAndressDto[]
}