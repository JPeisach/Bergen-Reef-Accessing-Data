"use client";

import { useUser } from "@auth0/nextjs-auth0/client";
import NavigationBar from "../components/NavigationBar";
import { useState } from "react";

export default function SettingsPage() {
  const { user, isLoading } = useUser();
  const [isDark, setIsDark] = useState(false);

  if (isLoading) return <div>Loading...</div>;

  return (
    <div>
      <NavigationBar defaultIndex={-1} username={user ? user.name : "Guest"} />

      <div className="p-8 bg-light-orange/30 min-h-screen">
        <h1 className="text-3xl font-bold text-dark-orange mb-6 text-center drop-shadow-sm">
          Settings
        </h1>

        <div className="mx-auto max-w-md rounded-2xl bg-light-orange/40 p-10 shadow-lg backdrop-blur-sm flex flex-col items-center justify-center gap-6">
          <div
            className={`w-full p-8 rounded-xl transition-all duration-300 flex flex-col items-center justify-center gap-4 ${
              isDark ? "bg-dark-orange/20" : "bg-white/60"
            }`}
          >
            <h2 className="text-xl font-bold text-dark-orange">
              Theme Preferences
            </h2>

            <button
              onClick={() => setIsDark(!isDark)}
              className="rounded-xl bg-dark-orange px-8 py-3 text-sm font-bold text-white transition-all hover:scale-105 hover:shadow-lg hover:bg-orange shadow-md"
            >
              {isDark ? "Switch to Light Mode" : "Switch to Dark Mode"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
