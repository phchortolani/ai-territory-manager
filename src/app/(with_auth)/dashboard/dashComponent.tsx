'use client'
import TerritoryBarChart from "@/components/dash/territoryBarChart";
import TabelaHeatmapTerritorios from "@/components/dash/territoryHeatMap";
import PieChartTerritorios from "@/components/dash/territoryPieChart";
import WeekRadarChart from "@/components/dash/weekRadarChart";
import { useHeatMapWeekAndTerritory } from "@/services/roundsService";
import { ThreeDot } from "react-loading-indicators";

export function DashComponent() {
    const { query: { data, isLoading } } = useHeatMapWeekAndTerritory();

    if (isLoading)
        return (
            <div className="w-full h-full flex justify-center items-center flex-col gap-2 animate-pulse">
                <ThreeDot color="#2563eb" size="medium" text="" textColor="" />
                <div className="text-sm text-blue-500">Carregando</div>
            </div>
        );

    return <div className="grid gap-2">
        <div className="md:grid md:grid-cols-2 gap-2">
            <PieChartTerritorios data={data} type="more_work" />
            <PieChartTerritorios data={data} type="less_work" pieces={5} />
            <WeekRadarChart data={data} />

        </div>
        {/* <>
            <TerritoryBarChart data={data} />
        </> */}
        <TabelaHeatmapTerritorios data={data} />
    </div>
}