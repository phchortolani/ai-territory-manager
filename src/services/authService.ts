'use client';

import { setCookie } from 'nookies';
import { ApiClient } from './api_client';
import { AxiosError } from 'axios';

const controller = 'auth';

// Tipos mais explícitos para os resultados
export interface SignInResponse {
    token?: string;
    error?: string;
}

// Função que configura o cookie
const setAuthCookie = (token: string) => {
    setCookie(null, 'ai-tab-token', token, {
        maxAge: 60 * 60 * 24, // 1 dia
        path: '/',
    });
};

export async function SignIn(email: string, password: string): Promise<SignInResponse> {
    try {
        const login = await ApiClient().post(controller + '/signin', { email, password });

        if (login.status === 200 && login.data) {
            const { token } = login.data
            setAuthCookie(token);
            return { token };
        }

        return { error: login.data?.error || 'Erro desconhecido' };
    } catch (error) {
        const err = error as AxiosError<{ error: string }>;
        return { error: err.response?.data?.error || 'Erro de conexão ou outro erro inesperado' };
    }
}
