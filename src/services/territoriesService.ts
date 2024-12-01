'use client'
import { TupleTerritoryAndress } from "@/dtos/tupleTerritoryAndress";
import { ApiClient } from "./api_client";
import { AxiosError } from "axios";

const controller = 'territory'

export async function getTerritories(): Promise<TupleTerritoryAndress> {
   try {
      const response = (await ApiClient().get(controller + `/getFullTerritoriesList`))

      if (response.status === 200 && response.data) return response.data
      else {
         throw { error: response.data?.error || 'Erro desconhecido' };
      }
   } catch (error) {
      const err = error as AxiosError<{ error: string }>;
      throw { error: err.response?.data?.error || 'Erro de conexão ou outro erro inesperado' };
   }
}