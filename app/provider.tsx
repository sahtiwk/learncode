// app/provider.tsx
"use client";

import React from "react";
import { ThemeProvider as NextThemesProvider } from "next-themes";

type ProviderProps = React.ComponentProps<typeof NextThemesProvider>;

function Provider({ children, ...props }: ProviderProps) {

    return <NextThemesProvider {...props}>{children}</NextThemesProvider>;
}

export default Provider;