"use client";

import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    Legend,
} from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ThreeDot } from "react-loading-indicators";
import { useRankRoundCompleted } from "@/services/roundsService";


export default function RankRoundBarChart({ top }: { top: number }) {

    const { query: { data, isLoading, isError } } = useRankRoundCompleted();

    if (isLoading) {
        return (
            <div className="w-full h-full flex justify-center items-center flex-col gap-2 animate-pulse">
                <ThreeDot color="#2563eb" size="medium" text="" textColor="" />
                <div className="text-sm text-blue-500">Carregando dados...</div>
            </div>
        );
    }

    if (isError || !data) {
        return (
            <Card>
                <CardHeader>
                    <CardTitle>Ranking de Rounds</CardTitle>
                </CardHeader>
                <CardContent className="text-sm text-red-500">
                    Erro ao carregar dados.
                </CardContent>
            </Card>
        );
    }


    const chartData = [...data]
        .sort((a, b) => b.round_completed - a.round_completed)
        .slice(0, top)
        .map((item) => ({
            name: item.name,
            Completados: item.round_completed,
        }));
    return (
        <Card>
            <CardHeader>
                <CardTitle>Top {top} completados por Dirigente</CardTitle>
            </CardHeader>
            <CardContent>
                <div className="w-full h-[400px]">
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart
                            data={chartData}
                            margin={{ top: 20, right: 30, left: 30, bottom: 80 }}
                            barSize={10}
                        >
                            <CartesianGrid strokeDasharray="1 1" />
                            <XAxis
                                dataKey="name"
                                angle={-45}
                                textAnchor="end"
                                interval={0}
                                height={80}
                                tick={{ fontStyle: "italic", fontSize: 12 }}
                            />
                            <Tooltip />
                            <Bar dataKey="Completados" fill="#3b82f6" />
                        </BarChart>
                    </ResponsiveContainer>

                </div>
            </CardContent>
        </Card>
    );
}
