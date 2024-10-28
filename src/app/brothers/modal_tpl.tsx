import { Button } from "@/components/ui/button";
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
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import moment from "moment";
import { useState } from "react";
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import React from "react";
import { generateTplEvents, getTplEvents } from "@/services/tplEventsService";
import { useQuery } from "@tanstack/react-query";

export interface EventData {
    date: string;
    periods: {
        time: string;
        pairs: {
            brother: string;
            support: string;
        }[];
    }[];
}


const getEvents = async () => {
    const events: EventData[] = await getTplEvents({ initial_date: moment('2024-10-01').toDate(), final_date: moment('2024-10-31').toDate() })
    return events
}

const generateEvents = async () => {
    const events: EventData[] = await generateTplEvents({ initial_date: moment('2024-10-01').toDate(), final_date: moment('2024-10-31').toDate() })
    return events
}

export function TplModal({ btn }: { btn: { name: string } }) {
    const [open, setOpen] = useState(false);
    const [loadingPdf, setLoadingPdf] = useState(false);

    const { data, refetch, isRefetching } = useQuery({ queryFn: getEvents, queryKey: ["tpl_events"], refetchOnWindowFocus: false });


    function generateNewList() {
        generateEvents()
        refetch()
    }

    async function generatePDF() {
        if (loadingPdf) return;
        setLoadingPdf(true);
        const content = document.getElementById('pdf-content');
        if (!content) return;

        content.classList.add('desktop-mode');

        try {
            const canvas = await html2canvas(content, { scale: 2 });
            const imgData = canvas.toDataURL('image/png');
            const pdf = new jsPDF({
                orientation: 'portrait',
                unit: 'px',
                format: 'a4',
            });
            const pdfWidth = pdf.internal.pageSize.getWidth();
            const pdfHeight = (canvas.height * pdfWidth) / canvas.width;
            pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
            pdf.save(moment().format('MMMM_YYYY') + '_TPL.pdf');
        } catch (error) {
            console.error("Erro ao gerar o PDF", error);
        } finally {
            content.classList.remove('desktop-mode');
            setLoadingPdf(false);
        }
    }

    return (
        <Dialog open={open} onOpenChange={(c) => setOpen(c)}>
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
                            {isRefetching ? <p>Gerando nova lista...</p> : loadingPdf ? <p>Gerando PDF...</p> : <Table id="pdf-content" className="border">
                                <TableHeader className="bg-slate-200 font-bold">
                                    <TableRow>
                                        <TableHead align="center" className="text-center">Data</TableHead>
                                        <TableHead align="right" className="text-center">Horário</TableHead>
                                        <TableHead>Dupla 1</TableHead>
                                        <TableHead>Dupla 2</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {data?.map((row, rowIndex) => (
                                        <React.Fragment key={rowIndex}>
                                            {row?.periods.map((period, periodIndex) => (
                                                <TableRow key={`${rowIndex}-${periodIndex}`}>
                                                    {periodIndex === 0 && (
                                                        <TableCell rowSpan={row?.periods.length} align="center" className="border">
                                                            {row.date}
                                                        </TableCell>
                                                    )}
                                                    <TableCell align="center" className="border">{period.time}</TableCell>

                                                    {period.pairs.map((pair, pairIndex) => (
                                                        <TableCell key={`${rowIndex}-${periodIndex}-${pairIndex}`} className="border">
                                                            <div className="flex flex-col">
                                                                <span>{pair.brother}</span>
                                                                <span>{pair.support}</span>
                                                            </div>
                                                        </TableCell>
                                                    ))}

                                                </TableRow>
                                            ))}
                                        </React.Fragment>
                                    ))}
                                </TableBody>
                            </Table>}

                        </div>
                    </div>
                    <DialogFooter className="flex items-center justify-center flex-col gap-2 md:flex-row">
                        <Button type="button" onClick={generateNewList} className="bg-blue-500 hover:bg-blue-700">Gerar nova lista</Button>
                        <Button type="button" onClick={generatePDF} className="bg-green-500 hover:bg-green-700">Download PDF</Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}
