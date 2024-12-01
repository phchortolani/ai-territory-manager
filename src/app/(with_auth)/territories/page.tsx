'use client'
import { getTerritories } from "@/services/territoriesService"
import { SearchTerritories } from "./search-territories"
import { useQuery } from "@tanstack/react-query";
import { ThreeDot } from "react-loading-indicators";

export default function Terrritories() {
    const { data, isLoading } = useQuery({ queryFn: async () => await getTerritories(), queryKey: ["getTerritories"], refetchOnWindowFocus: false });

    if (isLoading) return <div>
        <div className="w-full h-full flex justify-center items-center  flex-col gap-2 animate-pulse">
            <ThreeDot color="#2563eb " size="medium" text="" textColor="" /> <div className="text-sm text-blue-500">Carregando</div>
        </div>
    </div>

    return <SearchTerritories territories={data?.territories ?? []} andressList={data?.andressList ?? []} />

}