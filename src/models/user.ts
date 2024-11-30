import { z } from "zod";

// Define o esquema Zod
export const UserSchema = z.object({
    id: z.number().nullable().optional().nullish(),
    name: z.string().nullable().optional().nullish(),
    email: z.string().email(),
    password: z.string(),
    created_at: z.date().nullable().optional().nullish(),
    updated_at: z.date().nullable().optional().nullish(),
    created_by: z.number().nullable().optional().nullish(),
    updated_by: z.number().nullable().optional().nullish(),
});

// Exporta o tipo baseado no esquema
export type User = z.infer<typeof UserSchema>;
