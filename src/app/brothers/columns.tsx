"use client"

import { ColumnDef } from "@tanstack/react-table"
import { Checkbox } from "@/components/ui/checkbox"
import { Brother } from "@/models/brother"
import { deleteBrother, updateBrother } from "@/services/brothersService"
import { toast } from "@/hooks/use-toast"
import { Button } from "@/components/ui/button"
import { useQueryClient } from "@tanstack/react-query"
import { TrashIcon } from "@heroicons/react/24/outline"

import { useState } from "react"


type UpdateBrotherType = "active" | 'active_tpl'


async function UpdateBrother(value: boolean, brother: Brother, type: UpdateBrotherType, effect?: { onUpdate?: () => void, onStart?: () => void, onEnd?: () => void }) {
    if (effect?.onStart) effect?.onStart()
    switch (type) {
        case "active":
            brother.active = value
            if (!value) {
                brother.active_tpl = false
            }
            break
        case "active_tpl":
            brother.active_tpl = (value && brother.active)
            break
    }

    await updateBrother(brother).then(result => {
        toast({
            title: "Alterado com sucesso!",
            description: "O registro foi alterado com sucesso!",
            className: 'bg-green-500 text-white',
        })
        if (effect?.onUpdate) effect?.onUpdate()
    }).catch(x => {
        toast({
            title: "Ocorreu um erro!",
            description: x.message,
            className: 'bg-red-500 text-white',
        })
    }).finally(() => {
        if (effect?.onEnd) effect?.onEnd()
    })
}

async function DeleteBrother(id: number, effect: { onDelete: () => void, onStart: () => void, onEnd: () => void }) {
    effect.onStart()
    await deleteBrother(id).then(result => {
        if (result) {
            toast({
                title: "Deletado com sucesso!",
                description: "O registro foi deletado com sucesso!",
                className: 'bg-green-500 text-white',
            })

            effect.onDelete()
        }
    }).catch(x => {
        toast({
            title: "Ocorreu um erro!",
            description: x.message,
            className: 'bg-red-500 text-white',
        })

    }).finally(() => {
        effect.onEnd()
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
        header: () => <div className="text-center">Ativo</div>,
        cell: function ActiveCell({ row }) {
            const queryClient = useQueryClient();
            const [isLoading, setIsLoading] = useState(false)
            const active = row.getValue<boolean>("active")
            async function invalidateQueries() {
                queryClient.invalidateQueries({ queryKey: ["brothers"] })
            }

            return <div className="text-center">
                <Checkbox
                    disabled={isLoading}
                    checked={row.original.active}
                    onCheckedChange={(checked: boolean) => UpdateBrother(checked, row.original, "active", {
                        onUpdate: invalidateQueries,
                        onStart: () => setIsLoading(true),
                        onEnd: () => setIsLoading(false)
                    })} />
            </div>
        },
    },
    {
        accessorKey: "active_tpl",
        header: () => <div className="text-center">TPL Ativo</div>,
        cell: function ActiveCell({ row }) {
            const queryClient = useQueryClient();
            const [isLoading, setIsLoading] = useState(false)
            const active = row.getValue<boolean>("active_tpl")
            async function invalidateQueries() {
                queryClient.invalidateQueries({ queryKey: ["brothers"] })
            }

            return <div className="text-center">
                <Checkbox
                    disabled={!row.original.active || isLoading}
                    checked={row.original.active_tpl && row.original.active}
                    onCheckedChange={(checked: boolean) => UpdateBrother(checked, row.original, "active_tpl", {
                        onUpdate: invalidateQueries,
                        onStart: () => setIsLoading(true),
                        onEnd: () => setIsLoading(false)
                    })} />
            </div>
        },
    },
    {
        accessorKey: "id",
        header: () => <div className="text-center">Excluir</div>,
        cell: function ActiveCell({ row }) {
            const queryClient = useQueryClient();
            const id = row.getValue<number>("id")
            const [isLoading, setIsLoading] = useState(false)

            async function invalidateQueries() {
                queryClient.invalidateQueries({ queryKey: ["brothers"] })
                setIsLoading(false)
            }

            return <div className="text-center">
                <Button
                    disabled={isLoading}
                    variant={'ghost'} onClick={() => DeleteBrother(id, {
                        onDelete: invalidateQueries,
                        onStart: () => setIsLoading(true),
                        onEnd: () => setIsLoading(false),
                    })}><TrashIcon className="h-4 w-4 text-red-500" />
                </Button>
            </div>
        },
    }
]
