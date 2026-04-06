"use client";

import dynamic from "next/dynamic";

const ThemeProvider = dynamic(() => import("./ThemeProvider"), { ssr: false });

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <body>
      <ThemeProvider>{children}</ThemeProvider>
    </body>
  );
}
