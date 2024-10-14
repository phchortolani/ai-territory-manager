'use client'
import { Brother } from "@/models/brother"
import { columns } from "./columns"
import { DataTable } from "./datatable"
import { Button } from "@/components/ui/button"
import { getBrothers } from "@/services/brothersService"
import { useEffect, useState } from "react"


export default function BrothersPage() {
    const [data, setData] = useState<Brother[]>([])

    useEffect(() => {
        getBrothers().then(x => setData(x))
    }, [])


    if (data.length == 0) return <div>Carregando...</div>
    return (
        <div className="container mx-auto px-1 md:p-0">
            <div className="flex flex-row gap-2">
                <Button className="mb-4" >
                    Adicionar
                </Button>
                <Button className="mb-4 bg-green-500 hover:bg-green-700" >
                    Gerar TPL
                </Button>
            </div>
            <DataTable columns={columns} data={data} />
        </div>
    )
}
