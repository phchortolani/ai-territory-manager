'use client'
import { getS13 } from "@/services/roundsService";
import React from "react";
import { S13TableComponent } from "./s13_table";
import { useQuery } from "@tanstack/react-query";
import { ThreeDot } from "react-loading-indicators";

export default function DownloadPage() {
    const { data: s13_list, isLoading } = useQuery({ queryFn: async () => await getS13(), queryKey: ["getS13"], refetchOnWindowFocus: false });

    if (isLoading) return <div>
        <div className="w-full h-full flex justify-center items-center  flex-col gap-2 animate-pulse">
            <ThreeDot color="#2563eb " size="medium" text="" textColor="" /> <div className="text-sm text-blue-500">Carregando</div>
        </div>
    </div>
    return <S13TableComponent s13_list={s13_list ?? []} />
}