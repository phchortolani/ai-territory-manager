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
import { forwardRef, useEffect, useState } from "react";
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import React from "react";
import { generateTplEvents, getTplEvents } from "@/services/tplEventsService";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { DatePickerWithRange } from "@/components/ui/datapickerrange";
import { DateRange } from "react-day-picker"
import * as XLSX from "xlsx-js-style";
import { DownloadIcon, UpdateIcon } from "@radix-ui/react-icons";
import { ThreeDot } from 'react-loading-indicators'
import { toast } from "@/hooks/use-toast";



export interface EventData {
    date: string;
    periods: {
        time: string;
        pairs: {
            id: number;
            brother: string;
            support: string;
        }[];
    }[];
}
interface TableTPLProps {
    data?: EventData[];
    id?: string;
}


const getEvents = async ({ initial_date, final_date }: { initial_date: Date, final_date: Date }) => {
    const events: EventData[] = await getTplEvents({ initial_date, final_date })
    return events
}

const generateEvents = async ({ initial_date, final_date, event_id }: { initial_date: Date, final_date: Date, event_id?: number }) => {
    const events: EventData[] = await generateTplEvents({ initial_date, final_date, event_id })
    return events
}

export function TplModal({ btn }: { btn: { name: string } }) {
    const [open, setOpen] = useState(false);
    const [IsLoadingExportData, setIsLoadingExportData] = useState(false);
    const [isGenerating, setIsGenerating] = useState(false);
    const [generationPairId, setGenerationPairId] = useState<number | undefined>();
    const queryClient = useQueryClient();
    const [dates_state, setDates] = useState({
        initial_date: moment().startOf('month').toDate(),
        final_date: moment().endOf('month').toDate()
    });
    const tableRef = React.useRef<HTMLTableElement>(null);


    const { data, refetch, isRefetching } = useQuery({ queryFn: () => getEvents(dates_state), queryKey: ["tpl_events"], refetchOnWindowFocus: false });

    async function generateNewList() {
        if (isRefetching) return
        setIsGenerating(true)
        await generateEvents(dates_state)
        setIsGenerating(false)
        refetch()
    }
    async function generateNewPair(tpl_event_id: number) {
        setGenerationPairId(tpl_event_id)
        const new_event = await generateEvents({ event_id: tpl_event_id, initial_date: dates_state.initial_date, final_date: dates_state.final_date })


        if (!new_event || new_event?.length == 0) {
            toast({
                title: "Não foi possível gerar novas duplas para este dia!",
                description: "Filtre o dia desejado e gere a lista completa.",
                className: 'bg-slate-900 border-none text-white',
            })
            setGenerationPairId(undefined)
            return
        }

        const new_pair = new_event[0].periods[0].pairs[0]

        const event_selected_index = data?.findIndex(x =>
            x.periods.some(a => a.pairs.some(a => a.id == tpl_event_id))
        );

        if (event_selected_index === undefined || event_selected_index < 0 || !data) return;

        const periods = data[event_selected_index]?.periods;

        const old_pair_index = periods?.findIndex(x =>
            x.pairs.some(a => a.id == tpl_event_id)
        );

        if (old_pair_index === undefined || old_pair_index < 0) return;

        const updatedData = [...data];
        updatedData[event_selected_index] = {
            ...updatedData[event_selected_index],
            periods: updatedData[event_selected_index].periods.map((period, index) =>
                index === old_pair_index
                    ? {
                        ...period,
                        pairs: [
                            ...periods[old_pair_index].pairs.filter(x => x.id != tpl_event_id),
                            { ...new_pair, id: tpl_event_id }
                        ].sort((a, b) => a.id - b.id)
                    }
                    : period
            )
        };
        toast({
            title: "Dupla gerada com sucesso!",
            className: 'bg-green-500 border-none text-white',
        })
        queryClient.setQueriesData(['tpl_events'], updatedData);
        setGenerationPairId(undefined)
    }




    async function generatePDF() {
        if (IsLoadingExportData) return;
        setIsLoadingExportData(true);

        const refresh_itens_to_hidden = document.getElementsByClassName('refresh_pair');
        const content = document.getElementById('export-content');
        if (!content) return;


        const sizewidth = window.innerWidth;
        if (sizewidth > 1280) {
            content.classList.add(`w-[${1024}px]`);

        } else {
            content.classList.add('desktop-mode');

        }
        for (let i = 0; i < refresh_itens_to_hidden.length; i++) {
            refresh_itens_to_hidden[i].classList.add('hidden');
        }
        content.style.fontSize = '16px';
        try {

            const canvas = await html2canvas(content, { scale: 2, useCORS: true, allowTaint: true });
            const imgData = canvas.toDataURL('image/png');
            const pdfWidth = 595;
            const pdfHeight = ((canvas.height * pdfWidth) / canvas.width) + 20;
            const pdf = new jsPDF({
                orientation: 'portrait',
                unit: 'px',
                format: [pdfWidth, pdfHeight],
            });
            const imgWidth = pdfWidth - 40;
            const imgHeight = (canvas.height * imgWidth) / canvas.width;
            await pdf.addImage(imgData, 'PNG', 20, 50, imgWidth, imgHeight);
            await pdf.save(moment().format('MMMM_YYYY') + '_TPL.pdf');
            content.classList.remove('desktop-mode');
            for (let i = 0; i < refresh_itens_to_hidden.length; i++) {
                refresh_itens_to_hidden[i].classList.remove('hidden');
            }
            setIsLoadingExportData(false);
        } catch (error) {
            console.error("Erro ao gerar o PDF", error);
            for (let i = 0; i < refresh_itens_to_hidden.length; i++) {
                refresh_itens_to_hidden[i].classList.remove('hidden');
            }
            setIsLoadingExportData(false);
        }
    }

    async function onChangeDate(data_range: DateRange) {
        const initial_date = data_range.from
        const final_date = data_range.to
        if (initial_date && final_date) {
            setDates({ initial_date, final_date })
        }

    }

    async function exportToExcel() {
        if (!tableRef.current) return;

        // Obtenha os dados da tabela como HTML
        const table = tableRef.current;
        const worksheet = XLSX.utils.table_to_sheet(table);

        // Centralizar o conteúdo em todas as células
        Object.keys(worksheet).forEach((key) => {
            if (key.startsWith('!')) return; // Ignorar metadados do XLSX
            worksheet[key].s = {
                alignment: {
                    horizontal: "center",
                    vertical: "center",
                },
            };
        });

        // Estilizar cabeçalho (primeira linha)
        const headerRange = XLSX.utils.decode_range(worksheet['!ref']!);
        for (let col = headerRange.s.c; col <= headerRange.e.c; col++) {
            const cellAddress = XLSX.utils.encode_cell({ r: 0, c: col }); // Primeira linha (0)
            if (worksheet[cellAddress]) {
                worksheet[cellAddress].s = {
                    font: { bold: true }, // Título em negrito
                    alignment: { horizontal: "center", vertical: "center" },
                };
            }
        }

        // Ajustar largura das colunas
        const colWidths = [];
        for (let col = headerRange.s.c; col <= headerRange.e.c; col++) {
            let maxWidth = 10; // Largura padrão mínima
            for (let row = headerRange.s.r; row <= headerRange.e.r; row++) {
                const cellAddress = XLSX.utils.encode_cell({ r: row, c: col });
                const cellValue = worksheet[cellAddress]?.v ?? "";
                maxWidth = Math.max(maxWidth, String(cellValue).length);
            }
            colWidths.push({ wch: maxWidth + 2 }); // Ajuste adicional para espaçamento
        }
        worksheet["!cols"] = colWidths;

        // Crie a pasta de trabalho e adicione a planilha
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, "TPL");

        // Gere e faça o download do arquivo
        XLSX.writeFile(workbook, `tpl_${moment().format("DDMMYYYY_HHmm")}.xlsx`);
    }


    useEffect(() => {
        if (refetch) refetch()
    }, [dates_state.initial_date, dates_state.final_date])


    const TableTPL = React.forwardRef<HTMLTableElement, TableTPLProps>(({ data, id }: TableTPLProps, ref) => {

        return <Table ref={ref} id={id} className="border" >
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
                            <TableRow key={`${rowIndex}-${periodIndex}`} className={'border-none'}>
                                {periodIndex === 0 && (
                                    <TableCell rowSpan={row?.periods.length} align="center" className="border">
                                        {row.date}
                                    </TableCell>
                                )}
                                <TableCell align="center" className="border">{period.time}</TableCell>
                                {period.pairs.map((pair, pairIndex) => (
                                    <TableCell key={`${rowIndex}-${periodIndex}-${pairIndex}`} className="border  ">
                                        <div className="flex flex-row flex-1 items-center justify-between   gap-4">

                                            <div className="flex flex-col">
                                                <span>{pair.brother}&nbsp;</span>
                                                <span>{pair.support} </span>
                                            </div>

                                            <Button type="button" variant={'ghost'} disabled={!!generationPairId || !pair?.id} onClick={() => { generateNewPair(pair?.id) }} title="Atualizar Dupla" className={`group ${!!generationPairId && generationPairId === pair.id && 'animate-spin font-semibold'} px-2 refresh_pair disabled:opacity-60 disabled:cursor-none`}>
                                                <UpdateIcon className={` cursor-pointer group-hover:rotate-90 duration-150 text-blue-500 w-4 h-4`} />
                                            </Button>

                                        </div>

                                    </TableCell>
                                ))}

                            </TableRow>
                        ))}
                    </React.Fragment>
                ))}
            </TableBody>
        </Table>
    });

    TableTPL.displayName = "TableTPL"

    return (
        <Dialog open={open} onOpenChange={(c) => setOpen(c)}>
            <DialogTrigger asChild>
                <Button className="mb-4 bg-green-500 hover:bg-green-700">
                    {btn.name}
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[90vw] ">
                <form className="grid gap-4 py-4">
                    <DialogHeader>
                        <DialogTitle>Agenda TPL</DialogTitle>
                        <DialogDescription>
                            Abaixo é possível consultar e gerar o TPL
                        </DialogDescription>
                    </DialogHeader>
                    <div className="flex flex-col gap-4 relative max-w-[85vw] md:max-w-full">
                        {/* Tabela com dados */}
                        <div hidden={!IsLoadingExportData} className="absolute  top-0 right-0 bg-white  z-10 h-full w-full">
                            <div className="w-full h-full flex justify-center items-center  flex-col gap-2 animate-pulse"><ThreeDot color="#2563eb " size="medium" text="" textColor="" /> <div className="text-sm text-blue-500">Exportando</div></div>
                        </div>
                        <div className="overflow-y-auto max-h-[calc(100vh-300px)]">
                            {
                                isGenerating || isRefetching ?
                                    <div className="w-full h-full flex justify-center items-center  flex-col gap-2 animate-pulse"><ThreeDot color="#2563eb " size="medium" text="" textColor="" /> <div className="text-sm text-blue-500">{isGenerating ? "Gerando" : "Carregando"} lista</div></div> :
                                    <TableTPL ref={tableRef} id="export-content" data={data} />
                            }

                        </div>
                    </div>
                    <DialogFooter className="flex md:items-center md:justify-center flex-col gap-2 md:flex-row">
                        <div className="flex flex-col gap-2">
                            <div className=" flex flex-1">
                                <DatePickerWithRange disabled={isGenerating || isRefetching || IsLoadingExportData} initial_date={dates_state.initial_date} final_date={dates_state.final_date} onChange={onChangeDate} />
                            </div>

                            <div className="flex flex-col w-full md:flex-row gap-2">
                                <Button type="button" disabled={IsLoadingExportData || isGenerating || isRefetching} onClick={generateNewList} className="bg-blue-500 hover:bg-blue-700 disabled:opacity-20">
                                    Gerar nova lista
                                </Button>
                                <Button type="button" disabled={IsLoadingExportData || isGenerating || isRefetching} onClick={generatePDF} className="bg-red-500 hover:bg-red-700 disabled:opacity-20">
                                    Download PDF
                                    <DownloadIcon />
                                </Button>
                                <Button type="button" disabled={IsLoadingExportData || isGenerating || isRefetching} onClick={exportToExcel} className="bg-green-500 hover:bg-green-700 disabled:opacity-20">
                                    Download XLSX
                                    <DownloadIcon />
                                </Button>
                            </div>
                        </div>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}
