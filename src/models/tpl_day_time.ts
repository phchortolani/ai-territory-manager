import { z } from 'zod';

export const TplDayTimeSchema = z.object({
    id: z.number().nullish(),
    day_time: z.string({ required_error: "Descrição do horário obrigatória" }).min(1, { message: "Descrição do horário obrigatória" }).max(25, { message: "Descrição do horário muito longa" }),
}).required();


export type TplDayTime = z.infer<typeof TplDayTimeSchema>;