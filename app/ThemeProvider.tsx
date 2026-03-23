"use client";

import { useEffect, useState } from "react";

export default function ThemeProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [theme] = useState(
    localStorage.getItem("data-theme")
      ? localStorage.getItem("data-theme")
      : "brad", // default
  );

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
    localStorage.setItem("data-theme", theme);
  }, [theme]);

  return <body data-theme={theme}>{children}</body>;
}
