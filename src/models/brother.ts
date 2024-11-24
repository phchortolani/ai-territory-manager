import { z } from 'zod';

export const BrotherSchema = z.object({
    id: z.number().nullable().optional().nullish().optional(),
    active: z.boolean().default(false).optional(),
    brother_name: z.string({ required_error: "Nome obrigatório" }).min(1, { message: "Nome obrigatório" }).max(50, { message: "Nome muito longo" }),
    active_tpl: z.boolean().default(false).optional(),
    families: z.array(z.any()).optional().nullish().nullable(),
    sex: z.enum(['M', 'F']).default('M').optional(),
    tpl_times: z.string().nullish().optional().nullable(),
}).required();


export type Brother = z.infer<typeof BrotherSchema>;