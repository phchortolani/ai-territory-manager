'use client'
import { createContext, ReactNode, useContext, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { parseCookies, destroyCookie } from 'nookies'
import { getInfoOfToken, validateToken } from "@/services/tokenService";
import { User } from "@/models/user";
import { SignIn } from "@/services/authService";
interface AuthContextData {
    isAuthenticated: boolean | undefined;
    signIn: (user: User) => Promise<{ status: boolean, message?: string }>;
    signOut: () => void;
    home: string;
    user?: User;
}

interface AuthProviderProps {
    children: ReactNode;
}

const AuthContext = createContext<AuthContextData>({} as AuthContextData);

export const AuthProvider = ({ children }: AuthProviderProps) => {
    const [isAuthenticated, setIsAuthenticated] = useState<boolean | undefined>();
    const [user, setUser] = useState<User | undefined>();
    const router = useRouter();

    const signIn = async (user: User) => {
        const login = await SignIn(user.email, user.password);
        if (login.token) {
            setIsAuthenticated(true);
            const user = getInfoOfToken(login.token)
            setUser(user)
            return { status: true }
        } else {
            return { status: false, message: login.error }
        }

    };
    const signOut = () => {
        destroyCookie(null, 'ai-tab-token', { path: '/' });
        setIsAuthenticated(false);
        setUser(undefined)
        router.push('/');
    }


    useEffect(() => {
        const { 'ai-tab-token': token } = parseCookies()

        if (token) {
            // Valide o token conforme necessário
            const isTokenValid = validateToken(token);
            setIsAuthenticated(isTokenValid);

            if (!isTokenValid) {
                destroyCookie(null, 'ai-tab-token', { path: '/' });
                router.push("/");
                return;
            }

            const user = getInfoOfToken(token)
            setUser(user)
        } else {
            setIsAuthenticated(false);
            router.push("/");
        }



    }, [router]);


    return (
        <AuthContext.Provider value={{ isAuthenticated, signIn, signOut, home: '/schedule', user }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    return useContext(AuthContext);
};
