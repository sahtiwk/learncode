"use client";

import React, { useEffect, useRef } from "react";
import { ThemeProvider as NextThemesProvider } from "next-themes";
import { useUser } from "@clerk/nextjs";

type ProviderProps = React.ComponentProps<typeof NextThemesProvider>;

function Provider({ children, ...props }: ProviderProps) {
    const { user } = useUser();
    const isSaved = useRef(false);

    useEffect(() => {
        const saveUser = async () => {
            if (user && !isSaved.current) {
                isSaved.current = true;
                try {
                    await fetch('/api/user', {
                        method: 'POST',
                    });
                } catch (error) {
                    console.error("Failed to save user", error);
                }
            }
        };

        saveUser();
    }, [user]);
    console.log(user);

    return <NextThemesProvider {...props}>{children}</NextThemesProvider>;
}

export default Provider;