"use client";

import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { useHeatMapWeekAndTerritory } from "@/services/roundsService";
import { ThreeDot } from "react-loading-indicators";

import {
    PieChart,
    Pie,
    Cell,
    Tooltip,
    ResponsiveContainer,
    Legend,
} from "recharts";

const _take_value = 10

export default function PieChartTerritorios() {
    const { query: { data, isLoading } } = useHeatMapWeekAndTerritory();
    const take_data = data?.slice(0, _take_value);
    if (isLoading)
        return (
            <></>
        );

    const pizzaData = take_data
        ?.map((t) => {
            const total = Number(t.segunda) + Number(t.terca) + Number(t.quarta) + Number(t.quinta) + Number(t.sexta) + Number(t.sabado) + Number(t.domingo);

            const obj = {
                name: `T${t.territorio}`,
                value: Number(total),
            };


            return obj
        })
        .sort((a, b) => b.value - a.value)
        .slice(0, _take_value);

    return (
        <Card className="w-full overflow-auto">
            <CardHeader>
                <CardTitle>{_take_value} Territórios mais trabalhados</CardTitle>
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
                                    <Legend layout="radial" verticalAlign="bottom" align="right" />
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
