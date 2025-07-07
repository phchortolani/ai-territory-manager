import PieChartTerritorios from "@/components/dash/territoryPieChart";
import TabelaHeatmapTerritorios from "@/components/dash/territoryHeatMap";

export default function Dashboard() {
    return <div className="grid gap-2">
        <div className="md:grid md:grid-cols-2">
            <PieChartTerritorios />
        </div>
        <TabelaHeatmapTerritorios />
    </div>
}