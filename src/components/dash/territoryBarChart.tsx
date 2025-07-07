"use client";

import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    Legend
} from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { WeekAndTerritoryDTO } from "@/dtos/weekAndTerritoryDto";

type DiaSemana = "segunda" | "terca" | "quarta" | "quinta" | "sexta" | "sabado" | "domingo";

const dias: DiaSemana[] = [
    "segunda", "terca", "quarta", "quinta", "sexta", "sabado", "domingo"
];

const cores: Record<DiaSemana, string> = {
    segunda: "#2563eb",
    terca: "#10b981",
    quarta: "#f59e0b",
    quinta: "#ef4444",
    sexta: "#8b5cf6",
    sabado: "#0ea5e9",
    domingo: "#14b8a6",
};

interface Props {
    data: WeekAndTerritoryDTO[] | undefined;
}

export default function TerritoryBarChart({ data }: Props) {
    if (!data || data.length === 0) {
        return (
            <Card>
                <CardHeader>
                    <CardTitle>Trabalhos por Território e Dia</CardTitle>
                </CardHeader>
                <CardContent className="text-sm text-gray-500">
                    Nenhum dado disponível.
                </CardContent>
            </Card>
        );
    }

    const chartData = data.map((t) => ({
        name: `T${t.territorio}`,
        segunda: Number(t.segunda) || 0,
        terca: Number(t.terca) || 0,
        quarta: Number(t.quarta) || 0,
        quinta: Number(t.quinta) || 0,
        sexta: Number(t.sexta) || 0,
        sabado: Number(t.sabado) || 0,
        domingo: Number(t.domingo) || 0,
    }));

    return (
        <Card className="w-full overflow-auto">
            <CardHeader>
                <CardTitle>Trabalhos por Território e Dia</CardTitle>
            </CardHeader>
            <CardContent>
                <div className="w-full h-[400px]">
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart
                            data={chartData}
                            margin={{ top: 20, right: 30, left: 0, bottom: 5 }}
                        >
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="name" />
                            <YAxis allowDecimals={false} />
                            <Tooltip />
                            <Legend />
                            {dias.map((dia) => (
                                <Bar
                                    key={dia}
                                    dataKey={dia}
                                    stackId="a"
                                    fill={cores[dia]}
                                />
                            ))}
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            </CardContent>
        </Card>
    );
}
