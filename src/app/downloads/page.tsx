import { SimpleButton } from "@/components/buttons/simple_button";
import { getS13 } from "@/services/roundsService";
import moment from "moment";

export default async function DownloadPage() {
    const s13_list = await getS13()

    return (<>


        <div className="relative overflow-x-auto shadow-md sm:rounded-lg">
            <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
                <caption className="p-5 text-lg font-semibold text-left rtl:text-right text-gray-900 bg-white dark:text-white dark:bg-gray-800">

                    <SimpleButton typeBtn="primary">Download S13</SimpleButton>
                </caption>
                <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                    <tr>
                        <th scope="col" className="px-6 py-3">
                            Nº T.
                        </th>
                        <th scope="col" className="px-6 py-3">
                            Última data concluída
                        </th>
                        <th scope="col" className="px-6 py-3">
                            Data da designação
                        </th>
                        <th scope="col" className="px-6 py-3">
                            Data da conclusão
                        </th>
                        <th scope="col" className="px-6 py-3">
                            Data da designação
                        </th>
                        <th scope="col" className="px-6 py-3">
                            Data da conclusão
                        </th>
                        <th scope="col" className="px-6 py-3">
                            Data da designação
                        </th>
                        <th scope="col" className="px-6 py-3">
                            Data da conclusão
                        </th>
                        <th scope="col" className="px-6 py-3">
                            Data da designação
                        </th>
                        <th scope="col" className="px-6 py-3">
                            Data da conclusão
                        </th>
                    </tr>
                </thead>
                <tbody>




                    {s13_list.map(x => {
                        return <>
                            <tr key={x.id + "designado"} className="bg-white border-b dark:bg-gray-800 dark:border-gray-700">
                                <th rowSpan={2} scope="row" className="px-6 py-4 border text-center font-medium text-gray-900 whitespace-nowrap dark:text-white">
                                    {x.id}
                                </th>

                                <td rowSpan={2} colSpan={1} className="px-6 py-4 border text-center">
                                    {moment(x.ultima_concluida).utc().format('DD/MM/YYYY')}
                                </td>
                                <td colSpan={2} className="px-6 py-4 border text-center ">
                                    {x.designado_1}
                                </td>
                                <td colSpan={2} className="px-6 py-4 border text-center">
                                    {x.designado_2}
                                </td>
                                <td colSpan={2} className="px-6 py-4 border text-center">
                                    {x.designado_3}
                                </td>

                                <td colSpan={2} className="px-6 py-4 border text-center">
                                    {x.designado_4} 
                                </td>


                            </tr>
                            <tr key={x.id} className="bg-white border-b dark:bg-gray-800 dark:border-gray-700">


                                <td className="px-6 py-4 border text-center">
                                    {x.first_day_designado_em_1 && moment(x.first_day_designado_em_1).utc().format('DD/MM/YYYY')}
                                </td>
                                <td className="px-6 py-4 border text-center">
                                    {x.last_day_designado_em_1 && moment(x.last_day_designado_em_1).utc().format('DD/MM/YYYY')}
                                </td>
                                <td className="px-6 py-4 border text-center">
                                    {x.first_day_designado_em_2 && moment(x.first_day_designado_em_2).utc().format('DD/MM/YYYY')}
                                </td>
                                <td className="px-6 py-4 border text-center">
                                    {x.last_day_designado_em_2 && moment(x.last_day_designado_em_2).utc().format('DD/MM/YYYY')}
                                </td>
                                <td className="px-6 py-4 border text-center">
                                    {x.first_day_designado_em_3 && moment(x.first_day_designado_em_3).utc().format('DD/MM/YYYY')}
                                </td>
                                <td className="px-6 py-4 border text-center">
                                    {x.last_day_designado_em_3 && moment(x.last_day_designado_em_3).utc().format('DD/MM/YYYY')}
                                </td>
                                <td className="px-6 py-4 border text-center">
                                    {x.first_day_designado_em_4 && moment(x.first_day_designado_em_4).utc().format('DD/MM/YYYY')}
                                </td>
                                <td className="px-6 py-4 border text-center">
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