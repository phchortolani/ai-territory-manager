import { getRoundsByStatus } from "@/services/roundsService";
import Calendar from "./calendar";
import { Suspense } from "react";

export default async function Schedule() {
    const schedule = await getRoundsByStatus()
    return <Suspense fallback={'Carregando...'}>
        <Calendar schedule={schedule} />
    </Suspense>
}