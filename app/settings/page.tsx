"use client";

import { useUser } from "@auth0/nextjs-auth0/client";
import NavigationBar from "../components/NavigationBar";
import { useState, useEffect } from "react";

export default function SettingsPage() {
  const { user, isLoading } = useUser();
  const [mounted, setMounted] = useState(false);

  // useEffect only runs on the client, so now we can safely show the UI
  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return null;
  }

  if (isLoading) return <div>Loading...</div>;
  const setTheme = (theme) => {
    document.documentElement.setAttribute("data-theme", theme);
    console.log(theme);
    localStorage.setItem("data-theme", theme);
  };

  return (
    <div>
      <NavigationBar defaultIndex={-1} username={user ? user.name : "Guest"} />

      <div className="p-8 bg-base-100/30 min-h-screen dark:bg-gray-900 transition-colors duration-300">
        <h1 className="text-3xl font-bold text-primary-content mb-6 text-center drop-shadow-xs dark:text-primary-content">
          Settings
        </h1>

        <fieldset className="fieldset">
          <label className="flex gap-2 cursor-pointer items-center">
            <input
              type="radio"
              name="theme-radios"
              className="radio radio-sm theme-controller"
              value="brad"
              onClick={(e) => setTheme("brad")}
            />
            BRAD
          </label>
          <label className="flex gap-2 cursor-pointer items-center">
            <input
              type="radio"
              name="theme-radios"
              className="radio radio-sm theme-controller"
              value="sea-green"
              onClick={(e) => setTheme("sea-green")}
            />
            Seagreen
          </label>
        </fieldset>

        <div className="mx-auto max-w-md rounded-2xl bg-base-100/40 p-10 shadow-lg backdrop-blur-xs flex flex-col items-center justify-center gap-6 dark:bg-gray-800/50 transition-colors duration-300">
          <div
            className={`w-full p-8 rounded-xl transition-all duration-300 flex flex-col items-center justify-center gap-4 ${"bg-primary/20"}`}
          >
            <h2 className="text-xl font-bold text-primary-content dark:text-primary-content">
              Theme Preferences
            </h2>
          </div>
        </div>
      </div>
    </div>
  );
}
