// app/provider.tsx
"use client";

import React, { useEffect } from "react";
import { useUser } from "@clerk/nextjs";
import { ThemeProvider as NextThemesProvider } from "next-themes";

type ProviderProps = React.ComponentProps<typeof NextThemesProvider>;

function Provider({ children, ...props }: ProviderProps) {
    const { user, isLoaded } = useUser();

    const createNewUser = async () => {
        try {
            if (!isLoaded || !user) return;

            const result = await fetch("/api/user", {
                method: "POST"
            });
            const data = await result.json();
            console.log(data);
        } catch (error) {
            console.error("Error creating user:", error);
        }
    };

    useEffect(() => {
        createNewUser();
    }, [user, isLoaded]);

    return <NextThemesProvider {...props}>{children}</NextThemesProvider>;
}

export default Provider;