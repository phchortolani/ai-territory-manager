'use client'
import EffectivenessBarChart from "@/components/dash/effectivenessBarChart";
import RankRoundBarChart from "@/components/dash/rankRoundBarChart";
import TabelaHeatmapTerritorios from "@/components/dash/territoryHeatMap";
import PieChartTerritorios from "@/components/dash/territoryPieChart";
import WeekRadarChart from "@/components/dash/weekRadarChart";
import { useHeatMapWeekAndTerritory } from "@/services/roundsService";
import { useIsMobile } from "@/utils/useMobile";
import { ThreeDot } from "react-loading-indicators";

export function DashComponent() {
    const { query: { data, isLoading } } = useHeatMapWeekAndTerritory();
    const isMobile = useIsMobile()
    if (isLoading)
        return (
            <div className="w-full h-full flex justify-center items-center flex-col gap-2 animate-pulse">
                <ThreeDot color="#2563eb" size="medium" text="" textColor="" />
                <div className="text-sm text-blue-500">Carregando</div>
            </div>
        );

    return <div className="grid gap-2 pb-10">
        <div className="md:grid md:grid-cols-2 gap-2">
            <PieChartTerritorios data={data} type="more_work" />
            <PieChartTerritorios data={data} type="less_work" pieces={5} />
            <WeekRadarChart data={data} />
            <RankRoundBarChart top={isMobile ? 10 : 25} />

        </div>
        {/* <>
            <TerritoryBarChart data={data} />
        </> */}
                    <EffectivenessBarChart />
        <TabelaHeatmapTerritorios data={data} />
    </div>
}