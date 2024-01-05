'use client'
import { TupleTerritoryAndress } from "@/dtos/tupleTerritoryAndress";
import { removeSC } from "@/utils/stringExtends";
import { MagnifyingGlassIcon, HomeIcon } from "@heroicons/react/24/outline";
import { useState } from "react";

export function SearchTerritories({ territories, andressList }: TupleTerritoryAndress) {
    const [searchStg, Search] = useState<string>();

    const idsSearch = andressList.filter(x => removeSC(x.andress.toLowerCase().trim()).includes(removeSC(searchStg?.toLowerCase().trim() ?? "") ?? "")).map(x => x.territory_id);
    territories = territories.filter(x => idsSearch.includes(x.id))

    const totalHouseNumbers = territories.reduce((acc, current) => {
        return acc + (current?.house_numbers ?? 0)
    }, 0)

    return <>

        <div className="flex border rounded-md shadow p-2 items-center mb-4 text-gray-600">
            <MagnifyingGlassIcon className="h-4 w-4 " />
            <input type="text" onChange={(x) => { Search(x.target.value) }} className="w-full px-2 outline-none placeholder:text-gray-400" maxLength={120} placeholder="Pesquisar" />
        </div>
        <div className="mb-2 truncate text-xs leading-5 text-gray-500 flex items-center justify-end gap-2">
            <div className="flex flow-row gap-2 items-center justify-center"><div>Total de Casas: </div> <div><b>{totalHouseNumbers}</b></div></div>
        </div>
        <ul role="list" >
            {
                territories?.map((territory) => (
                    <li key={territory.id} className="flex justify-between gap-x-6 gap-2 py-5 px-2 border rounded-md shadow mb-2">
                        <div className="flex min-w-0 gap-x-4">
                            <img className="w-60 items-center flex-none rounded-sm bg-gray-50" src={`${territory.id}.png`} alt="" />
                            <div className="min-w-0 flex-auto">
                                <div className="mb-2 truncate text-xs leading-5 text-gray-500 flex items-center  justify-start gap-2">
                                    <p className="text-lg font-bold leading-6">{territory.id}</p>  |
                                    <HomeIcon className="h-3 w-3" />
                                    <div className="flex flow-row gap-2 items-center justify-center"><div>Casas: </div> <div>{territory.house_numbers}</div></div>
                                </div>
                                {andressList?.filter(x => x.territory_id == territory.id)?.map((x, i) => <div key={`${territory.id}_${i}`} className="text-xs py-1 line-clamp-1 font-semibold text-gray-500">
                                    {x.andress}
                                </div>)}
                            </div>
                        </div>
                        <div className=" hidden shrink-0 sm:flex sm:flex-col sm:items-end">
                            <div className="mt-1 flex items-center gap-x-1.5">
                                <div className={`flex-none rounded-full ${territory.status ? 'bg-emerald-500/20' : 'bg-red-500/20'}  p-1`}>
                                    <div className={`h-1.5 w-1.5 rounded-full ${territory.status ? 'bg-emerald-500' : 'bg-red-500'}`} />
                                </div>
                                <p className="text-xs leading-5 text-gray-500">{territory.status ? 'Ativo' : 'Inativo'}</p>
                            </div>
                        </div>
                    </li>
                ))
            }
        </ul >
    </>
}