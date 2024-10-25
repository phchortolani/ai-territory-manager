import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import 'moment/locale/pt-br';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import moment from "moment";
import { useState } from "react";
import { usePDF } from 'react-to-pdf';
import React from "react";

export function TplModal({ btn }: { btn: { name: string } }) {
    const [open, setOpen] = useState(false);
    const { toPDF, targetRef } = usePDF({ filename: moment().format('MMMM_YYYY') + '_TPL.pdf' });

    // Dados da tabela
    const data = [
        {
            date: "segunda-feira, 7 de outubro de 2024",
            periods: [
                {
                    time: "8:00-10:00",
                    pair_1: { brother: "Gerônimo dos Santos", support: "Valdir M. da Silva" },
                    pair_2: { brother: "Claudia C. S. Alvares", support: "Jacira de L. C. da Silva" }
                },
                {
                    time: "10:00-12:00",
                    pair_1: { brother: "Karin Hortel Lecoufle", support: "Elizabete C. Nasc. Militão" },
                    pair_2: { brother: "Paulo R. Lima Jr", support: "Valdir M. da Silva" }
                },
            ],
        },
        {
            date: "quarta-feira, 9 de outubro de 2024",
            periods: [
                {
                    time: "8:00-10:00",
                    pair_1: { brother: "Paulo R. Lima Jr", support: "Valdir M. da Silva" },
                    pair_2: { brother: "Elizabete C. Nasc. Militão", support: "Eliane Ferreira de Lima" }
                },
                {
                    time: "19:00-21:00",
                    pair_1: { brother: "Claudia C. S. Alvares", support: "Jacira de L. C. da Silva" },
                    pair_2: { brother: "Marlene Marques dos Santos", support: "Elenilda Alvares de Oliveira" }
                },
            ],
        },
        {
            date: "sexta-feira, 11 de outubro de 2024",
            periods: [
                {
                    time: "8:00-10:00",
                    pair_1: { brother: "André A. Bispo", support: "Karin Hortel Lecoufle" },
                    pair_2: { brother: "Paulo R. Lima Jr", support: "Valdir M. da Silva" }
                },
                {
                    time: "19:00-21:00",
                    pair_1: { brother: "Gerônimo dos Santos", support: "Valdir M. da Silva" },
                    pair_2: { brother: "Elizabete C. Nasc. Militão", support: "Elenilda Alvares de Oliveira" }
                },
            ],
        },
    ];

    async function OnOpenModal() {
        setOpen(true);
    }

    async function OnCloseModal() {
        setOpen(false);
    }

    return (
        <Dialog open={open} onOpenChange={(c) => { !c ? OnCloseModal() : OnOpenModal() }}>
            <DialogTrigger asChild>
                <Button className="mb-4 bg-green-500 hover:bg-green-700">
                    {btn.name}
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[90vw]">
                <form className="grid gap-4 py-4">
                    <DialogHeader>
                        <DialogTitle>Agenda TPL</DialogTitle>
                        <DialogDescription>
                            Abaixo é possível consultar e gerar o TPL
                        </DialogDescription>
                    </DialogHeader>
                    <div className="flex flex-col gap-4">
                        {/* Tabela com dados */}
                        <div className="overflow-y-auto max-h-[calc(100vh-300px)]">
                            <Table ref={targetRef} className="border">
                                <TableHeader className="bg-slate-200 font-bold">
                                    <TableRow>
                                        <TableHead align="center" className="text-center">Data</TableHead>
                                        <TableHead align="right" className="text-center">Horário</TableHead>
                                        <TableHead>Dupla 1</TableHead>
                                        <TableHead>Dupla 2</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {data.map((row, rowIndex) => (
                                        // Renderizar a data uma vez
                                        <React.Fragment key={rowIndex}>
                                            {row.periods.map((period, periodIndex) => (
                                                <TableRow key={`${rowIndex}-${periodIndex}`}>
                                                    {periodIndex === 0 && ( // Renderiza a data apenas para o primeiro período
                                                        <TableCell rowSpan={row.periods.length} align="center" className="border">
                                                            {row.date}
                                                        </TableCell>
                                                    )}
                                                    <TableCell align="center" className="border">{period.time}</TableCell>
                                                    <TableCell className="border">
                                                        <div className="flex flex-col">
                                                            <span className="p-0">{period.pair_1.brother}</span>
                                                            <span className="p-0">{period.pair_1.support}</span>
                                                        </div>
                                                    </TableCell>
                                                    <TableCell className="border">
                                                        <div className="flex flex-col">
                                                            <span className="p-0">{period.pair_2.brother}</span>
                                                            <span className="p-0">{period.pair_2.support}</span>
                                                        </div>
                                                    </TableCell>
                                                </TableRow>
                                            ))}
                                        </React.Fragment>
                                    ))}
                                </TableBody>
                            </Table>
                        </div>
                    </div>
                    <DialogFooter className="flex items-center justify-center">
                        <Button type="button" onClick={() => toPDF()} className="bg-green-500 hover:bg-green-700">Gerar PDF</Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}
