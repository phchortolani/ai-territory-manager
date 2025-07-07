'use client'
import { SimpleButton } from "@/components/buttons/simple_button";
import { S13 } from "@/dtos/s13";
import moment from "moment";
import React, { useEffect, useState } from "react";
import { useRef } from "react";
import { DownloadTableExcel } from 'react-export-table-to-excel';
import { exportToExcel } from "./export";
import { Button } from "@/components/ui/button";


export function S13TableComponent({ s13_list }: { s13_list: S13[] }) {
    const [downloadAvaliable, setAvaliable] = useState<boolean>(false)
    const tableRef = useRef(null);

    useEffect(() => {
        if (tableRef.current) {
            setAvaliable(true)
        }
    }, [tableRef.current])

    const handleExport = () => {
        if (!tableRef.current) return
        exportToExcel(tableRef)
    }

    return (<>
        <div className="relative overflow-x-auto  sm:rounded-lg px-2 lg:px-0">
            {
                <div className="pb-2 text-sm  justify-between items-center font-semibold text-left flex rtl:text-right  bg-white  text-gray-900">
                    <Button
                        disabled={!downloadAvaliable}
                        onClick={handleExport}
                        type="button"
                        variant="default">Download S13
                    </Button>
                    <div className="text-sm text-gray-400">
                        Atualizado em: {moment().format("DD/MM/YYYY HH:mm")}
                    </div>

                </div>
            }
            {/* MOBILE VIEW */}
            <div className="md:hidden mt-4 space-y-4">
                {s13_list.map((item) => (
                    <div key={item.id} className="border rounded-lg p-4 shadow-sm bg-white text-sm text-gray-800">
                        <div className="mb-2 font-semibold">Nº T.: <span className="font-normal">{item.id}</span></div>
                        {item.rounds.map((rodada, index) => (
                            <div key={rodada.id} className="mb-4 border-t pt-2">
                                {index === 0 && rodada.last_day && (
                                    <div className="mb-1">
                                        <strong>Última data concluída:</strong> {moment(rodada.last_day).utc().format("DD/MM/YYYY")}
                                    </div>
                                )}
                                {index > 0 && (
                                    <>
                                        <div><strong>Responsável:</strong> {rodada.leader_name}</div>
                                        <div><strong>Data da designação:</strong> {rodada.first_day && moment(rodada.first_day).utc().format("DD/MM/YYYY")}</div>
                                        <div><strong>Data da conclusão:</strong> {rodada.last_day && moment(rodada.last_day).utc().format("DD/MM/YYYY")}</div>
                                    </>
                                )}
                            </div>
                        ))}
                    </div>
                ))}
            </div>

            <div className="hidden md:block">
                <table ref={tableRef} className="w-full text-sm text-left rtl:text-right  text-gray-500 border dark:text-gray-400">
                    <thead className="text-xs border bg-gray-50  text-gray-900">
                        <tr>
                            <th scope="col" className="px-2 py-3 border">
                                Nº T.
                            </th>
                            <th scope="col" className="px-2 py-3 border">
                                Última data concluída
                            </th>
                            <th scope="col" className="px-2 py-3 border">
                                Data da designação
                            </th>
                            <th scope="col" className="px-2 py-3 border">
                                Data da conclusão
                            </th>
                            <th scope="col" className="px-2 py-3 border">
                                Data da designação
                            </th>
                            <th scope="col" className="px-2 py-3 border">
                                Data da conclusão
                            </th>
                            <th scope="col" className="px-2 py-3 border">
                                Data da designação
                            </th>
                            <th scope="col" className="px-2 py-3 border">
                                Data da conclusão
                            </th>
                            <th scope="col" className="px-2 py-3 border">
                                Data da designação
                            </th>
                            <th scope="col" className="px-2 py-3 border">
                                Data da conclusão
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        {
                            s13_list.map(x => {

                                return <React.Fragment key={x.id + "designado"} >
                                    <tr className="bg-white  text-gray-900 dark:border-gray-700">
                                        <th rowSpan={2} scope="row" className="px-2 p-1 border text-sm text-center font-semibold text-gray-900 whitespace-nowrap ">
                                            {x.id}
                                        </th>
                                        {
                                            x.rounds.map((rodada, index) => {
                                                if (index == 0) return <td key={x.id + rodada.id + index} rowSpan={2} colSpan={1} className="px-2 p-1 border  text-sm text-center">
                                                    {rodada.last_day && moment(rodada.last_day).utc().format('DD/MM/YYYY')}
                                                </td>

                                                return <td key={x.id + rodada.id + index} colSpan={2} className="px-2 font-semibold p-1 border text-sm text-center ">
                                                    {rodada.leader_name}
                                                </td>
                                            })
                                        }
                                    </tr>
                                    <tr className="bg-white  text-gray-900  dark:border-gray-700">
                                        {
                                            x.rounds.map((rodada, index) => {
                                                if (index == 0) return
                                                return <React.Fragment key={x.id + rodada.id}>
                                                    <td className="px-2 p-1 border text-sm text-center">
                                                        {rodada.first_day && moment(rodada.first_day).utc().format('DD/MM/YYYY')}
                                                    </td>
                                                    <td className="px-2 p-1 border text-sm text-center">
                                                        {rodada.last_day && moment(rodada.last_day).utc().format('DD/MM/YYYY')}
                                                    </td>
                                                </React.Fragment>
                                            })
                                        }
                                    </tr>
                                </React.Fragment>
                            })
                        }


                    </tbody>
                </table>
            </div>

        </div>


    </>)
}