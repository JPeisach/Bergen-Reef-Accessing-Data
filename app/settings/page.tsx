"use client";

import { useUser } from "@auth0/nextjs-auth0/client";
import NavigationBar from "../components/NavigationBar";
import { useState, useEffect } from "react";
import { useTheme } from "next-themes";

const themeOptions = [
  {
    id: "light",
    name: "Light",
    description: "Clean neutral default style",
    swatches: ["#ffffff", "#FCD98C", "#FFA900"],
  },
  {
    id: "dark",
    name: "Dark",
    description: "Lower brightness for night usage",
    swatches: ["#111827", "#1f2937", "#f59e0b"],
  },
  {
    id: "coral-pink",
    name: "Coral Pink",
    description: "Warm coral accents and soft pink tones",
    swatches: ["#fff4f6", "#ffc1cc", "#eb718d"],
  },
  {
    id: "sea-green",
    name: "Seagreen",
    description: "Calm marine greens with clear contrast",
    swatches: ["#f0fbf8", "#a5dccc", "#2f9e83"],
  },
  {
    id: "light-blue",
    name: "Light Blue",
    description: "Cool ocean blues with airy backgrounds",
    swatches: ["#eef7ff", "#a7cfff", "#3b82f6"],
  },
];

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

      <div className="settings-page-bg min-h-screen p-6 sm:p-8 md:p-10 transition-colors duration-300">
        <div className="mx-auto max-w-4xl rounded-3xl border settings-panel-bg p-8 shadow-xl transition-colors duration-300">
          <h1 className="settings-title text-3xl font-bold drop-shadow-sm">
            Settings
          </h1>
          <p className="settings-subtext mt-3 text-center text-base">
            Pick a theme for the dashboard. Your choice updates the whole site
            instantly.
          </p>

          <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2">
            {themeOptions.map((option) => {
              const isActive = theme === option.id;

              return (
                <button
                  key={option.id}
                  onClick={() => setTheme(option.id)}
                  className={`theme-chip rounded-2xl border p-5 text-left transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md ${
                    isActive ? "theme-chip-active shadow-md" : ""
                  }`}
                >
                  <div className="mb-3 flex items-center justify-between">
                    <h2 className="text-lg font-semibold">{option.name}</h2>
                    {isActive && (
                      <span className="rounded-full bg-white/30 px-2.5 py-1 text-xs font-semibold">
                        Active
                      </span>
                    )}
                  </div>

                  <p className="text-sm opacity-90">{option.description}</p>

                  <div className="mt-4 flex gap-2">
                    {option.swatches.map((swatch) => (
                      <span
                        key={swatch}
                        className="h-6 w-6 rounded-full border border-black/10"
                        style={{ backgroundColor: swatch }}
                      />
                    ))}
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
