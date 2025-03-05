'use client'

import { getRoundsByUID } from "@/services/roundsService";
import { useQuery } from "@tanstack/react-query";
import { useParams, usePathname, useSearchParams } from "next/navigation";
import { ThreeDot } from "react-loading-indicators";
import Image from "next/image";

export default function ScheduleListPage() {
    const path = usePathname();
    const uid = path.split('/').reverse()[0];

    const { data: rounds, isLoading } = useQuery({
        queryFn: async () => await getRoundsByUID(uid), queryKey: ["getRoundsByUID"],
        refetchOnWindowFocus: false,
        enabled: !!uid
    });

    if (isLoading) return <div className="w-full h-full flex justify-center items-center  flex-col gap-2 animate-pulse"><ThreeDot color="#2563eb " size="medium" text="" textColor="" /> <div className="text-sm text-blue-500">Carregando</div></div>
    
    if (rounds?.length === 0) return <div className="w-full h-full flex justify-center items-center text-black">Nenhum agendamento encontrado</div>

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-2">
            {rounds?.map((round) =>
                <div key={round.id} className="flex flex-col  md:max-w-md  ">
                    {/*  <div>
                        Território: {round?.territory_id}
                    </div> */}
                    <div className="shadow-md rounded-md ">
                        <Image src={`https://aitab.lanisystems.com.br/${round.territory_id}.png`} className="w-full" width={600} height={600} alt="" />
                    </div>
                </div>)
            }
        </div>
    );
}