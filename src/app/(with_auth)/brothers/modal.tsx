'use client'
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectLabel,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { toast } from "@/hooks/use-toast";
import { Brother, BrotherSchema } from "@/models/brother";
import { saveBrother } from "@/services/brothersService";
import { zodResolver } from "@hookform/resolvers/zod";

import { useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { useForm } from "react-hook-form";

export function BrotherModal({ btn }: { btn: { name: string } }) {
    const [open, setOpen] = useState(false)
    const queryClient = useQueryClient()
    const { register, handleSubmit, formState: { errors }, setValue, clearErrors, reset, watch } = useForm<Brother>({
        resolver: zodResolver(BrotherSchema),
        defaultValues: {
            sex: 'M',
            active: false,
            active_tpl: false,
        }
    });

    async function submit(data: Brother) {
        await saveBrother(data).then(res => {
            if (res) {
                setOpen(false)
                toast({
                    title: "Salvo com sucesso!",
                    description: "O registro foi salvo com sucesso!",
                    className: 'bg-green-500 text-white',
                })
                queryClient.invalidateQueries({ queryKey: ["brothers"] })
                reset()

            } else {
                toast({
                    title: "Ocorreu um erro!",
                    className: 'bg-red-500 text-white',
                })
            }
        }).catch(x => {
            toast({
                title: "Ocorreu um erro!",
                description: x.message,
                className: 'bg-red-500 text-white',
            })
        })

    }

    async function OnOpenModal() {
        setOpen(true)
    }
    async function OnCloseModal() {
        setOpen(false)
        clearErrors()
        reset()
    }

    return <Dialog open={open} onOpenChange={(c) => { !c ? OnCloseModal() : OnOpenModal() }}>
        <DialogTrigger asChild>
            <Button variant="default">{btn.name}</Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[425px]">
            <form onSubmit={handleSubmit(submit)} className="grid gap-4 py-4">
                <DialogHeader>
                    <DialogTitle>Adicionar Irmão</DialogTitle>
                    <DialogDescription>
                        Adicione abaixo as informações do(a) publicador(a)
                    </DialogDescription>
                </DialogHeader>
                <div className="flex flex-col gap-4">
                    <div className="flex flex-col gap-1">
                        <Label htmlFor="brother_name">Nome</Label>
                        <Input maxLength={60} {...register("brother_name")} className={errors.brother_name ? "border-red-500" : ""} />
                        {errors.brother_name && <p className="text-red-500 text-xs">{errors.brother_name.message}</p>}
                    </div>
                    <div>
                        <Label htmlFor="sex">Sexo</Label>
                        <Select   {...register("sex")}>
                            <SelectTrigger className="w-full" >
                                <SelectValue placeholder="Selecione..." />
                            </SelectTrigger>
                            <SelectContent  >
                                <SelectItem value="M">Homem</SelectItem>
                                <SelectItem value="F">Mulher</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                    <div className="flex flex-col gap-4">
                        <div className="flex flex-col gap-2">
                            <Label htmlFor="brother_name">Situação
                                <DialogDescription className="font-light text-xs pt-1">
                                    Defina as informações do(a) publicador(a)
                                </DialogDescription>
                            </Label>
                            <div className="flex justify-start items-start gap-2">
                                <Checkbox  {...register("active")} onCheckedChange={(value: boolean) => {
                                    setValue("active", value)
                                    if (!value) setValue("active_tpl", false)
                                }} />
                                <Label htmlFor="active">Ativo(a)</Label>
                            </div>
                            <div className="flex justify-start items-start gap-2">
                                <Checkbox disabled={!watch('active')} checked={watch('active_tpl') && watch('active')}  {...register("active_tpl")} onCheckedChange={(value: boolean) => setValue("active_tpl", value)} />
                                <Label htmlFor="active_tpl">Trabalha no TPL</Label>
                            </div>
                        </div>
                    </div>
                </div>
                <DialogFooter>
                    <Button type="submit">Adicionar</Button>
                </DialogFooter>
            </form>
        </DialogContent>
    </Dialog>
}