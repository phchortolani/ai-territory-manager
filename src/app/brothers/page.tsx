'use client'
import { Brother, BrotherSchema } from "@/models/brother"
import { columns } from "./columns"
import { DataTable } from "./datatable"
import { Button } from "@/components/ui/button"
import { getBrothers } from "@/services/brothersService"
import { useEffect, useState } from "react"
import { BrotherModal } from "./modal"
import { useQuery } from "@tanstack/react-query"


export default function BrothersPage() {
    const { data, isLoading, isError, isRefetching } = useQuery({ queryFn: async () => await getBrothers(), queryKey: ["brothers"] });

    if (isLoading) return <div>Carregando...</div>
    if (isError) return <div>Falha ao carregar</div>

    return (
        <div className="container mx-auto px-1 md:p-0">
            <div className="flex flex-row gap-2">
                <BrotherModal btn={{ name: "Adicionar" }} />
                <Button className="mb-4 bg-green-500 hover:bg-green-700" >
                    Gerar TPL
                </Button>
            </div>
            <DataTable columns={columns} data={data} />
        </div>
    )
}
