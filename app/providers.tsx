"use strict";

import { ThemeProvider } from "next-themes";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider
      attribute="data-theme"
      defaultTheme="light"
      enableSystem={false}
      storageKey="bergen-reef-theme"
      themes={["light", "dark", "coral-pink", "sea-green", "light-blue"]}
    >
      {children}
    </ThemeProvider>
  );
}
