'use client';

import { useAuth } from "@/contexts/AuthContext";
import { useRouter } from "next/navigation";
import React, { useEffect, ReactNode, ComponentType } from "react";

type WithAuthProps = {
    children?: ReactNode;
};

export const WithAuth = <P extends WithAuthProps>(
    Component: ComponentType<P>
): React.FC<P> => {
    const WrappedComponent: React.FC<P> = (props: P) => {
        const { isAuthenticated } = useAuth();
        const router = useRouter();

        useEffect(() => {
            if (isAuthenticated === false) {
                router.push("/");
            }
        }, [isAuthenticated, router]);

        if (!isAuthenticated) {
            return null;
        }

        return <Component {...props} />;
    };

    // Define um displayName para o componente
    WrappedComponent.displayName = `WithAuth(${Component.displayName || Component.name || "Component"})`;

    return WrappedComponent;
};
