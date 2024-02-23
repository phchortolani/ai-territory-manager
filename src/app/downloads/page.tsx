import { SimpleButton } from "@/components/buttons/simple_button";
import { getS13 } from "@/services/roundsService";
import moment from "moment";

export default async function DownloadPage() {
    const s13_list = await getS13()

    return (<>


        <div className="relative overflow-x-auto  sm:rounded-lg">
            <table className="w-full text-sm text-left rtl:text-right  text-gray-500 dark:text-gray-400">
                <caption className="pb-2 text-lg font-semibold text-left rtl:text-right  bg-white  text-gray-900">

                    <SimpleButton typeBtn="primary">Download S13</SimpleButton>
                </caption>
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




                    {s13_list.sort().map(x => {
                        return <>
                            <tr key={x.id + "designado"} className="bg-white border-b text-gray-900 dark:border-gray-700">
                                <th rowSpan={2} scope="row" className="px-2 p-1 border  text-sm text-center font-medium text-gray-900 whitespace-nowrap ">
                                    {x.id}
                                </th>

                                <td rowSpan={2} colSpan={1} className="px-2 p-1 border font-bold text-sm text-center">
                                    {moment(x.ultima_concluida).utc().format('DD/MM/YYYY')}
                                </td>
                                <td colSpan={2} className="px-2 font-semibold p-1 border text-sm text-center ">
                                    {x.designado_1}
                                </td>
                                <td colSpan={2} className="px-2 p-1 font-semibold border text-sm text-center">
                                    {x.designado_2}
                                </td>
                                <td colSpan={2} className="px-2 p-1 font-semibold border text-sm text-center">
                                    {x.designado_3}
                                </td>

                                <td colSpan={2} className="px-2 p-1 font-semibold border text-sm text-center">
                                    {x.designado_4}
                                </td>


                            </tr>
                            <tr key={x.id} className="bg-white border-b text-gray-900  dark:border-gray-700">


                                <td className="px-2 p-1 border text-sm text-center">
                                    {x.first_day_designado_em_1 && moment(x.first_day_designado_em_1).utc().format('DD/MM/YYYY')}
                                </td>
                                <td className="px-2 p-1 border text-sm text-center">
                                    {x.last_day_designado_em_1 && moment(x.last_day_designado_em_1).utc().format('DD/MM/YYYY')}
                                </td>
                                <td className="px-2 p-1 border text-sm text-center">
                                    {x.first_day_designado_em_2 && moment(x.first_day_designado_em_2).utc().format('DD/MM/YYYY')}
                                </td>
                                <td className="px-2 p-1 border text-sm text-center">
                                    {x.last_day_designado_em_2 && moment(x.last_day_designado_em_2).utc().format('DD/MM/YYYY')}
                                </td>
                                <td className="px-2 p-1 border text-sm text-center">
                                    {x.first_day_designado_em_3 && moment(x.first_day_designado_em_3).utc().format('DD/MM/YYYY')}
                                </td>
                                <td className="px-2 p-1 border text-sm text-center">
                                    {x.last_day_designado_em_3 && moment(x.last_day_designado_em_3).utc().format('DD/MM/YYYY')}
                                </td>
                                <td className="px-2 p-1 border text-sm text-center">
                                    {x.first_day_designado_em_4 && moment(x.first_day_designado_em_4).utc().format('DD/MM/YYYY')}
                                </td>
                                <td className="px-2 p-1 border text-sm text-center">
                                    {x.last_day_designado_em_4 && moment(x.last_day_designado_em_4).utc().format('DD/MM/YYYY')}
                                </td>
                            </tr>
                        </>
                    })}


                </tbody>
            </table>
        </div>


    </>)
}