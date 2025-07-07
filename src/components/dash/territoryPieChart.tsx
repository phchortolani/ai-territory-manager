"use client";

import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { WeekAndTerritoryDTO } from "@/dtos/weekAndTerritoryDto";
import { useIsMobile } from "@/utils/useMobile";

import {
    PieChart,
    Pie,
    Cell,
    Tooltip,
    ResponsiveContainer,
    Legend,
} from "recharts";

const _take_value = 10

interface props {
    type: "more_work" | "less_work"
    pieces?: number
    data: WeekAndTerritoryDTO[] | undefined
}

export default function PieChartTerritorios({ type, pieces = _take_value, data }: props) {
    const isMobile = useIsMobile();
    const pizzaData = data
        ?.map((t) => {
            const total = Number(t.segunda) + Number(t.terca) + Number(t.quarta) + Number(t.quinta) + Number(t.sexta) + Number(t.sabado) + Number(t.domingo);
            const obj = {
                name: `T${t.territorio}`,
                value: Number(total),
            };
            return obj
        })
        .sort((a, b) => type === "more_work" ? b.value - a.value : a.value - b.value)
        .slice(0, pieces);


    return (
        <Card className="w-full overflow-auto">
            <CardHeader>
                <CardTitle>{pieces} Territórios {type === "more_work" ? "mais" : "menos"} trabalhados</CardTitle>
            </CardHeader>
            <CardContent>
                <div>
                    <div className="w-full h-[300px]">
                        {pizzaData && pizzaData.length > 0 ? (
                            <ResponsiveContainer width="100%" height={250}>
                                <PieChart>
                                    <Pie
                                        data={pizzaData}
                                        dataKey="value"
                                        nameKey="name"
                                        cx="50%"
                                        className="cursor-pointer outline-none"
                                        cy="50%"
                                        innerRadius={40}
                                        outerRadius={80}
                                        label={({ name, percent, value }) => `${name} (${value}x)`}
                                    >
                                        {pizzaData.map((entry, index) => (
                                            <Cell key={`cell-${index}`} fill={`hsl(${(index * 45) % 360}, 70%, 60%)`} />
                                        ))}
                                    </Pie>
                                    <Tooltip />
                                    {!isMobile && <Legend layout={"radial"} verticalAlign="bottom" align="right" />}
                                </PieChart>
                            </ResponsiveContainer>
                        ) : (
                            <div className="text-sm text-gray-500">Nenhum dado para exibir no gráfico.</div>
                        )}

                    </div>
                </div>

            </CardContent>
        </Card>
    );
}
