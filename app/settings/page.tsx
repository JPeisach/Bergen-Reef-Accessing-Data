"use client";

import { useUser } from "@auth0/nextjs-auth0/client";
import NavigationBar from "../components/NavigationBar";
import { useState, useEffect } from "react";
import { useTheme } from "next-themes";

export default function SettingsPage() {
  const { user, isLoading } = useUser();
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  // useEffect only runs on the client, so now we can safely show the UI
  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return null;
  }

  if (isLoading) return <div>Loading...</div>;

  return (
    <div>
      <NavigationBar defaultIndex={-1} username={user ? user.name : "Guest"} />

      <div className="p-8 bg-light-orange/30 min-h-screen dark:bg-gray-900 transition-colors duration-300">
        <h1 className="text-3xl font-bold text-dark-orange mb-6 text-center drop-shadow-sm dark:text-orange">
          Settings
        </h1>

        <div className="mx-auto max-w-md rounded-2xl bg-light-orange/40 p-10 shadow-lg backdrop-blur-sm flex flex-col items-center justify-center gap-6 dark:bg-gray-800/50 transition-colors duration-300">
          <div
            className={`w-full p-8 rounded-xl transition-all duration-300 flex flex-col items-center justify-center gap-4 ${theme === "dark" ? "bg-dark-orange/20" : "bg-white/60"
              }`}
          >
            <h2 className="text-xl font-bold text-dark-orange dark:text-orange">
              Theme Preferences
            </h2>

            <button
              onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
              className="rounded-xl bg-dark-orange px-8 py-3 text-sm font-bold text-white transition-all hover:scale-105 hover:shadow-lg hover:bg-orange shadow-md dark:bg-orange dark:hover:bg-light-orange dark:text-gray-900"
            >
              {theme === "dark" ? "Switch to Light Mode" : "Switch to Dark Mode"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
