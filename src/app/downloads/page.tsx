import { getS13 } from "@/services/roundsService";
import React, { Suspense } from "react";
import { S13TableComponent } from "./s13_table";

export default async function DownloadPage() {
    const s13_list = await getS13()

    return (
        <Suspense fallback={"Carregando..."}>
            <S13TableComponent s13_list={s13_list} />
        </Suspense>

    )
}