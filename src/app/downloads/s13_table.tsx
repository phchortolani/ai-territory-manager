'use client'
import { SimpleButton } from "@/components/buttons/simple_button";
import { S13 } from "@/dtos/s13";
import moment from "moment";
import React, { useEffect, useState } from "react";
import { useRef } from "react";
import { DownloadTableExcel } from 'react-export-table-to-excel';

export function S13TableComponent({ s13_list }: { s13_list: S13[] }) {
    const [downloadAvaliable, setAvaliable] = useState<boolean>(false)
    const tableRef = useRef(null);

    useEffect(() => {
        if (tableRef.current) {
            setAvaliable(true)
        }
    }, [tableRef.current])
    return (<>
        <div className="relative overflow-x-auto  sm:rounded-lg">
            {downloadAvaliable &&
                <div className="pb-2 text-sm  justify-between items-center font-semibold text-left flex rtl:text-right  bg-white  text-gray-900">
                    <DownloadTableExcel filename={`s13_${moment().format("DDMMYYYY_HHmm")}`} sheet={`s13_${moment().format("DDMMYYYY_HHmm")}`} currentTableRef={tableRef.current}>
                        <SimpleButton typeBtn="primary">Download S13</SimpleButton>
                    </DownloadTableExcel >
                    <div className="text-sm text-gray-400">
                        Atualizado em: {moment().format("DD/MM/YYYY HH:mm")}
                    </div>

                </div>
            }

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


    </>)
}