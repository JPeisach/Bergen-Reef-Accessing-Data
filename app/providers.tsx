"use strict";

import { ThemeProvider } from "next-themes";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    // TODO: Don't hardcode this - properly use theme provider or whatever we should be using!
    <div data-theme="brad">
      <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
        {children}
      </ThemeProvider>
    </div>
  );
}
