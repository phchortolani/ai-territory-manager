"use client"

import { ColumnDef } from "@tanstack/react-table"
import { Checkbox } from "@/components/ui/checkbox"
import { Brother } from "@/models/brother"
import { updateBrother } from "@/services/brothersService"
import { toast } from "@/hooks/use-toast"

// This type is used to define the shape of our data.
// You can use a Zod schema here if you want.

type UpdateBrotherType = "active" | 'active_tpl'
async function UpdateBrother(brother: Brother, type: UpdateBrotherType) {
    switch (type) {
        case "active":
            brother.active = !brother.active
            break
        case "active_tpl":
            brother.active_tpl = !brother.active_tpl
            break
    }

    await updateBrother(brother).then(result => {
        toast({
            title: "Alterado com sucesso!",
            description: "O registro foi alterado com sucesso!",
            className: 'bg-green-500 text-white',
        })
    }).catch(x => {
        toast({
            title: "Ocorreu um erro!",
            description: x.message,
            className: 'bg-red-500 text-white',
        })
    })
}

export const columns: ColumnDef<Brother>[] = [
    {
        accessorKey: "brother_name",
        header: () => <div>Nome</div>,
        cell: ({ row }) => {
            const name = row.getValue<string>("brother_name")
            return <div>{name}</div>
        },
    },
    {
        accessorKey: "active",
        header: () => <div>Ativo</div>,
        cell: ({ row }) => {
            const active = row.getValue<boolean>("active")

            return <div><Checkbox defaultChecked={active} onCheckedChange={(checked) => UpdateBrother(row.original, "active")} /></div>
        },
    },
    {
        accessorKey: "active_tpl",
        header: () => <div>TPL Ativo</div>,
        cell: ({ row }) => {
            const active = row.getValue<boolean>("active_tpl")

            return <div><Checkbox defaultChecked={active} onCheckedChange={(checked) => UpdateBrother(row.original, "active_tpl")} /></div>
        },
    }
]
