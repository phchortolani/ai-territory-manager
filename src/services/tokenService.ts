import { User } from "@/models/user";
import jwt from "jsonwebtoken";
export const validateToken = (token: string): boolean => {
    try {
        // Decodifica o token sem validar a assinatura
        const decoded = jwt.decode(token) as { exp: number } | null;

        if (!decoded || !decoded.exp) {
            return false;
        }

        // Verifica se o token expirou
        const now = Math.floor(Date.now() / 1000); // Tempo atual em segundos
        return decoded.exp > now;
    } catch (error) {
        console.error("Token inválido:", error);
        return false;
    }
};

export const getInfoOfToken = (token: string) => jwt.decode(token) as User;