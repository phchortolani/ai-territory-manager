import { z } from 'zod';

export const BrotherSchema = z.object({
    id: z.number().nullable().optional().nullish().optional(),
    active: z.boolean().default(false).optional(),
    brother_name: z.string({ required_error: "Nome obrigatório" }).min(1, { message: "Nome obrigatório" }).max(50, { message: "Nome muito longo" }),
    active_tpl: z.boolean().default(false).optional(),
}).required();

export type Brother = z.infer<typeof BrotherSchema>;