"use client";

import { useUser } from "@auth0/nextjs-auth0/client";
import NavigationBar from "../components/NavigationBar";
import { useState, useEffect } from "react";

const themeOptions = [
  {
    id: "brad",
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
  const [mounted, setMounted] = useState(false);
  const [currentTheme, setCurrentTheme] = useState<string | null>(null);

  // useEffect only runs on the client, so now we can safely show the UI
  useEffect(() => {
    const theme = localStorage.getItem("data-theme");
    if (theme) {
      setCurrentTheme(theme);
    }

    setMounted(true);
  }, []);

  if (!mounted) {
    return null;
  }

  if (isLoading) return <div>Loading...</div>;
  const setTheme = (theme) => {
    document.documentElement.setAttribute("data-theme", theme);
    localStorage.setItem("data-theme", theme);
    setCurrentTheme(theme);
  };

  return (
    <div>
      <NavigationBar defaultIndex={-1} username={user ? user.name : "Guest"} />

      <div className="min-h-screen bg-base-200 p-6 transition-colors duration-300 sm:p-8 md:p-10">
        <div className="card mx-auto max-w-4xl border border-base-300 bg-base-100 shadow-xl">
          <div className="card-body">
            <h1 className="text-3xl font-bold text-primary drop-shadow-sm">
              Settings
            </h1>
            <p className="mt-2 text-center text-base text-base-content/80">
              Choose a DaisyUI theme. It is saved in your browser and applies on
              every page after refresh.
            </p>

            <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2">
              {themeOptions.map((option) => {
                const isActive = currentTheme === option.id;

                return (
                  <button
                    key={option.id}
                    type="button"
                    onClick={() => setTheme(option.id)}
                    className={`card card-body border-2 bg-base-100 p-5 text-left shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md ${
                      isActive
                        ? "border-primary ring-2 ring-primary ring-offset-2 ring-offset-base-200"
                        : "border-base-300"
                    }`}
                  >
                    <div className="mb-3 flex items-center justify-between gap-2">
                      <h2 className="card-title text-lg">{option.name}</h2>
                      {isActive && (
                        <span className="badge badge-primary badge-sm">
                          Active
                        </span>
                      )}
                    </div>

                    <p className="text-sm text-base-content/80">
                      {option.description}
                    </p>

                    <div className="mt-4 flex gap-2">
                      {option.swatches.map((swatch) => (
                        <span
                          key={swatch}
                          className="h-6 w-6 rounded-full border border-base-300"
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
    </div>
  );
}
