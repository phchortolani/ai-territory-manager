"use client";

import {
    Radar, RadarChart, PolarGrid, PolarAngleAxis, ResponsiveContainer, Tooltip
} from "recharts";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { WeekAndTerritoryDTO } from "@/dtos/weekAndTerritoryDto";
import { useState } from "react";
import { Select } from "@/components/ui/select";
import {
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";

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
    const [territorioSelecionado, setTerritorioSelecionado] = useState<string>("todos");

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

    // Prepara opções únicas de territórios para o select
    const territoriosUnicos = Array.from(new Set(data.map((d) => d.territorio))).sort((a, b) => a - b);

    const totalPorDia: Record<DiaSemana, number> = {
        segunda: 0,
        terca: 0,
        quarta: 0,
        quinta: 0,
        sexta: 0,
        sabado: 0,
        domingo: 0,
    };

    const dadosFiltrados = territorioSelecionado === "todos"
        ? data
        : data.filter(d => `T${d.territorio}` === territorioSelecionado);

    dadosFiltrados.forEach((territorio) => {
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
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2">
                    <CardTitle>Distribuição por dia da semana</CardTitle>

                    <Select value={territorioSelecionado} onValueChange={(value) => setTerritorioSelecionado(value)}>
                        <SelectTrigger className="w-48 outline-none focus-within:outline-none focus-within:ring-1 focus-within:ring-ring">
                            <SelectValue placeholder="Selecione o território" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="todos">Todos</SelectItem>
                            {territoriosUnicos.map((t) => (
                                <SelectItem key={t} value={`T${t}`}>T{t}</SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>
            </CardHeader>
            <CardContent>
                <div className="w-full h-[300px]">
                    <ResponsiveContainer width="100%" height="100%">
                        <RadarChart cx="50%" cy="50%" outerRadius="80%" data={radarData}>
                            <PolarGrid />
                            <PolarAngleAxis dataKey="dia" />
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
