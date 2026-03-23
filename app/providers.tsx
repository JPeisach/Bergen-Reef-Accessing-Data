"use strict";

import { ThemeProvider } from "next-themes";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="light"
      enableSystem={false}
      themes={["light", "dark", "coral-pink", "sea-green", "light-blue"]}
    >
      {children}
    </ThemeProvider>
  );
}
