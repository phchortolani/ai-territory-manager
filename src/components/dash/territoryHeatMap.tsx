"use client";

import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { useHeatMapWeekAndTerritory } from "@/services/roundsService";
import { ThreeDot } from "react-loading-indicators";

type DiaSemana = "segunda" | "terca" | "quarta" | "quinta" | "sexta" | "sabado" | "domingo";

const dias: DiaSemana[] = [
    "segunda",
    "terca",
    "quarta",
    "quinta",
    "sexta",
    "sabado",
    "domingo",
];

const formatDia = (dia: DiaSemana) =>
    dia.charAt(0).toUpperCase() + dia.slice(1);

const getColor = (valor: number) => {
    if (valor >= 15) return "#216e39";  // muito intenso
    if (valor >= 10) return "#30a14e";  // intenso
    if (valor >= 6) return "#40c463";   // médio
    if (valor >= 2) return "#9be9a8";   // baixo
    if (valor >= 1) return "#ebedf0";
    return "#ffffff";                   // nenhum
};

export default function TabelaHeatmapTerritorios() {
    const { query: { data, isLoading } } = useHeatMapWeekAndTerritory();

    if (isLoading)
        return (
            <div className="w-full h-full flex justify-center items-center flex-col gap-2 animate-pulse">
                <ThreeDot color="#2563eb" size="medium" text="" textColor="" />
                <div className="text-sm text-blue-500">Carregando</div>
            </div>
        );

    return (
        <Card className="w-full overflow-auto">
            <CardHeader>
                <CardTitle>Frequência de Trabalho por Território</CardTitle>
            </CardHeader>
            <CardContent>
                {/* Tabela tradicional - visível em telas médias e maiores */}
                <div className="overflow-x-auto hidden sm:block">
                    <table className="table-auto border-collapse text-[10px] min-w-fit">
                        <thead>
                            <tr className="bg-gray-100">
                                <th className="border p-[2px] text-left w-20">Dia</th>
                                {data?.map((t) => (
                                    <th
                                        key={t.territorio}
                                        className="border p-[2px] w-6 h-6 text-[10px] whitespace-nowrap"
                                    >
                                        T{t.territorio}
                                    </th>
                                ))}
                            </tr>
                        </thead>
                        <tbody>
                            {dias.map((dia) => (
                                <tr key={dia}>
                                    <td className="border p-[2px] font-medium text-left w-20">
                                        {formatDia(dia)}
                                    </td>
                                    {data?.map((t) => (
                                        <td
                                            key={`${t.territorio}-${dia}`}
                                            className="border text-center align-middle w-6 h-6"
                                            style={{
                                                backgroundColor: getColor(t[dia]),
                                                fontSize: "10px",
                                            }}
                                        >
                                            {t[dia] > 0 ? t[dia] : ""}
                                        </td>
                                    ))}
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {/* Versão mobile (cards por dia) */}
                <div className="flex flex-col gap-4 sm:hidden">
                    {dias.map((dia) => (
                        <div key={dia}>
                            <div className="text-sm font-semibold mb-1">
                                {formatDia(dia)}
                            </div>
                            <div className="grid grid-cols-8 gap-1">
                                {data?.map((t) => (
                                    <div className="flex flex-col items-center" key={t.territorio}>
                                        <div className="text-[10px] font-semibold mb-1">T{t.territorio}</div>

                                        <div
                                            key={`mobile-${t.territorio}-${dia}`}
                                            title={`T${t.territorio}: ${t[dia] ?? 0}`}
                                            className="w-6 h-6 rounded-sm text-[9px] flex items-center justify-center"
                                            style={{
                                                backgroundColor: getColor(t[dia]),
                                                color: t[dia] >= 7 ? "white" : "black",
                                            }}
                                        >
                                            {t[dia] > 0 ? t[dia] : ""}
                                        </div>
                                    </div>

                                ))}
                            </div>
                        </div>
                    ))}
                </div>
            </CardContent>
        </Card>
    );
}
