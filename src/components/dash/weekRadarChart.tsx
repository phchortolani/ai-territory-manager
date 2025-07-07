"use client";

import {
    Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer, Tooltip
} from "recharts";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { WeekAndTerritoryDTO } from "@/dtos/weekAndTerritoryDto";

type DiaSemana = "segunda" | "terca" | "quarta" | "quinta" | "sexta" | "sabado" | "domingo";

const dias: DiaSemana[] = [
    "segunda", "terca", "quarta", "quinta", "sexta", "sabado", "domingo",
];

const formatDia = (dia: DiaSemana) =>
    dia.charAt(0).toUpperCase() + dia.slice(1);

interface Props {
    data: WeekAndTerritoryDTO[] | undefined;
}

export default function WeekRadarChart({ data }: Props) {
    if (!data || data.length === 0) {
        return (
            <Card>
                <CardHeader>
                    <CardTitle>Dia mais trabalhado</CardTitle>
                </CardHeader>
                <CardContent className="text-sm text-gray-500">Nenhum dado disponível.</CardContent>
            </Card>
        );
    }

    const totalPorDia: Record<DiaSemana, number> = {
        segunda: 0,
        terca: 0,
        quarta: 0,
        quinta: 0,
        sexta: 0,
        sabado: 0,
        domingo: 0,
    };

    data.forEach((territorio) => {
        dias.forEach((dia) => {
            totalPorDia[dia] += Number(territorio[dia]) || 0;
        });
    });

    const radarData = dias.map((dia) => ({
        dia: formatDia(dia),
        total: totalPorDia[dia],
    }));

    return (
        <Card>
            <CardHeader>
                <CardTitle>Distribuição por dia da semana</CardTitle>
            </CardHeader>
            <CardContent>
                <div className="w-full h-[300px]">
                    <ResponsiveContainer width="100%" height="100%">
                        <RadarChart cx="50%" cy="50%" outerRadius="80%" data={radarData}>
                            <PolarGrid />
                            <PolarAngleAxis dataKey="dia" />
                            {/*  <PolarRadiusAxis /> */}
                            <Radar
                                name="Total nesse dia da semana"
                                dataKey="total"
                                stroke="#3b82f6"
                                fill="#3b82f6"
                                fillOpacity={0.6}
                            />
                            <Tooltip />
                        </RadarChart>
                    </ResponsiveContainer>
                </div>
            </CardContent>
        </Card>
    );
}
