"use client";
import React, { useState } from "react";
import { useUser } from "@auth0/nextjs-auth0/client";
import "../globals.css";
import NavigationBar from "../components/NavigationBar";

export default function Page() {
  const { user } = useUser();
  const [notes, setNotes] = useState("");
  const [tankNumber, setTankNumber] = useState("");
  const [coralType, setCoralType] = useState("");
  const [selectedVariables, setSelectedVariables] = useState<string[]>([]);
  const [observationTitle, setObservationTitle] = useState("");
  const [observationTime, setObservationTime] = useState("");
  const [isNotepadVisible, setIsNotepadVisible] = useState(false);

  const coralTypes = [
    "Mushroom Coral",
    "Brain Coral",
    "Jolene Coral",
    "Sarah Coral",
    "Josh Coral",
  ];

  const variables = [
    "pH",
    "Calcium",
    "Temperature",
    "Salinity",
    "None of the above",
  ];

  const handleVariableChange = (variable: string) => {
    setSelectedVariables((prev) =>
      prev.includes(variable)
        ? prev.filter((v) => v !== variable)
        : [...prev, variable],
    );
  };

  return (
    <div>
      <NavigationBar defaultIndex={3} username={user ? user.name : "Guest"} />

    
      <div className="p-8 bg-light-orange/30 min-h-screen">
        <h1 className="text-3xl font-bold text-dark-orange mb-6 text-center drop-shadow-sm">Observations</h1>

      
        <div className="mb-8 flex flex-wrap items-end gap-4 rounded-2xl bg-light-orange/40 p-5 shadow-lg backdrop-blur-sm">
          {/* Tank numnber dropdown menu */}
          <div className="min-w-[160px]">
            <label className="block text-dark-orange font-bold mb-2 text-sm">
              Tank
            </label>
            <select
              value={tankNumber}
              onChange={(e) => setTankNumber(e.target.value)}
              className="w-full rounded-xl bg-white p-2.5 text-sm font-medium text-gray focus:outline-none focus:ring-2 focus:ring-light-orange shadow-sm transition-all"
            >
              <option value="">Select tank...</option>
              {Array.from({ length: 9 }, (_, i) => i + 1).map((num) => (
                <option key={num} value={num}>
                  {num}
                </option>
              ))}
            </select>
          </div>

          {/* coral dropdown */}
          <div className="min-w-[180px]">
            <label className="block text-dark-orange font-bold mb-2 text-sm">
              Coral Type
            </label>
            <select
              value={coralType}
              onChange={(e) => setCoralType(e.target.value)}
              className="w-full rounded-xl bg-white p-2.5 text-sm font-medium text-gray focus:outline-none focus:ring-2 focus:ring-light-orange shadow-sm transition-all"
            >
              <option value="">Select coral type...</option>
              {coralTypes.map((type, index) => (
                <option key={`${type}-${index}`} value={type}>
                  {type}
                </option>
              ))}
            </select>
          </div>

          {/* time input*/}
          <div className="min-w-[160px]">
            <label className="block text-dark-orange font-bold mb-2 text-sm">
              Time
            </label>
            <input
              type="time"
              value={observationTime}
              onChange={(e) => setObservationTime(e.target.value)}
              className="w-full rounded-xl bg-white p-2.5 text-sm font-medium text-gray focus:outline-none focus:ring-2 focus:ring-light-orange shadow-sm transition-all"
            />
          </div>

          {/* var dropdown */}
          <div className="min-w-[200px]">
            <label className="block text-dark-orange font-bold mb-2 text-sm">
              Variables
            </label>
            <select
              value=""
              onChange={(e) => {
                const value = e.target.value;
                if (!value) return;
                handleVariableChange(value);
                // Reset select back to placeholder
                e.target.value = "";
              }}
              className="w-full rounded-xl bg-white p-2.5 text-sm font-medium text-gray focus:outline-none focus:ring-2 focus:ring-light-orange shadow-sm transition-all"
            >
              <option value="">Add variable...</option>
              {variables.map((variable) => (
                <option key={variable} value={variable}>
                  {variable}
                </option>
              ))}
            </select>
          </div>

          {/* button to open notepad */}
          <button
            type="button"
            onClick={() => setIsNotepadVisible((prev) => !prev)}
            className="ml-auto flex h-12 w-12 items-center justify-center rounded-full bg-dark-orange text-2xl font-bold text-white shadow-lg transition-all hover:scale-110 hover:shadow-xl hover:bg-orange"
            aria-label={isNotepadVisible ? "Hide notepad" : "Open notepad"}
          >
            {isNotepadVisible ? "−" : "+"}
          </button>
        </div>

        {/* layout of page*/}
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          {/* placeholder saved observations */}
          <div className="space-y-4">
            <h2 className="text-xl font-bold text-dark-orange mb-4">
              Recent Observations
            </h2>
            <div className="space-y-4 max-h-[600px] overflow-y-auto">
              {/* ex 1 */}
              <div className="rounded-lg bg-white/90 p-3.5 shadow-lg border border-light-orange/20">
                <div className="flex items-start justify-between mb-2.5">
                  <h3 className="text-base font-semibold text-dark-orange">
                    Coral Observation #1
                  </h3>
                  <span className="text-xs text-medium-gray/80">
                    12/15/2025 09:30 AM
                  </span>
                </div>
                <div className="flex flex-wrap gap-1.5 mb-2.5">
                  <span className="text-xs bg-light-orange/40 px-2 py-0.5 rounded-md text-dark-orange font-medium">
                    Tank 3
                  </span>
                  <span className="text-xs bg-light-orange/40 px-2 py-0.5 rounded-md text-dark-orange font-medium">
                    Mushroom Coral
                  </span>
                  <span className="text-xs bg-light-orange/40 px-2 py-0.5 rounded-md text-dark-orange font-medium">
                    Calcium
                  </span>
                  <span className="text-xs bg-light-orange/40 px-2 py-0.5 rounded-md text-dark-orange font-medium">
                    Alkalinity
                  </span>
                </div>
                <p className="text-sm text-gray/90 mt-2 line-clamp-3 leading-relaxed">
                  The calcium levels dropped by a suspicious amount, but the Mushroom coral looks surprisingly healthy!
                </p>
              </div>

              {/* ex 2 */}
              <div className="rounded-lg bg-white/85 p-3.5 shadow-lg border border-light-orange/15 ml-2">
                <div className="flex items-start justify-between mb-2.5">
                  <h3 className="text-base font-semibold text-dark-orange">
                    Coral Observation #2
                  </h3>
                  <span className="text-xs text-medium-gray/80">
                    12/15/2025 4:00 PM
                  </span>
                </div>
                <div className="flex flex-wrap gap-1.5 mb-2.5">
                  <span className="text-xs bg-light-orange/40 px-2 py-0.5 rounded-md text-dark-orange font-medium">
                    Tank 8
                  </span>
                  <span className="text-xs bg-light-orange/40 px-2 py-0.5 rounded-md text-dark-orange font-medium">
                    Jolene Coral
                  </span>
                  <span className="text-xs bg-light-orange/40 px-2 py-0.5 rounded-md text-dark-orange font-medium">
                    pH
                  </span>
                  <span className="text-xs bg-light-orange/40 px-2 py-0.5 rounded-md text-dark-orange font-medium">
                    Temperature
                  </span>
                </div>
                <p className="text-sm text-gray/90 mt-2 line-clamp-3 leading-relaxed">
                  The Jolene coral appears to be thriving despite fluctuations in pH and temperature.
                </p>
              </div>
            </div>
          </div>

          {/* notepad */}
          <div>
            {isNotepadVisible && (
              <div className="w-full space-y-5 rounded-2xl bg-white p-6 shadow-xl backdrop-blur-sm">
                {/* Observation Title */}
                <div>
                  <label className="mb-2 block text-sm font-bold text-dark-orange">
                    Observation Title
                  </label>
                  <input
                    type="Enter text here..."
                    value={observationTitle}
                    onChange={(e) => setObservationTitle(e.target.value)}
                    placeholder="Enter title here..."
                    className="w-full rounded-xl bg-white p-3 text-sm font-medium text-gray focus:outline-none focus:ring-2 focus:ring-light-orange shadow-sm transition-all"
                  />
                </div>

                {/* Variables Display */}
                <div>
                  <p className="mb-2 text-sm font-bold text-dark-orange">
                    Variables
                  </p>
                  {selectedVariables.length === 0 ? (
                    <p className="text-sm text-medium-gray italic">
                      Variables appear here...
                    </p>
                  ) : (
                    <div className="flex flex-wrap gap-2">
                      {selectedVariables.map((variable) => (
                        <span
                          key={variable}
                          className="inline-flex items-center gap-1.5 rounded-full bg-light-orange/50 px-4 py-1.5 text-xs font-bold text-dark-orange shadow-sm"
                        >
                          {variable}
                          <button
                            type="button"
                            onClick={() => handleVariableChange(variable)}
                            className="text-sm text-dark-orange hover:text-orange hover:scale-125 transition-transform font-bold"
                            aria-label={`Remove ${variable}`}
                          >
                            ×
                          </button>
                        </span>
                      ))}
                    </div>
                  )}
                </div>

                {/* Notes Textbox */}
                <div>
                  <label className="mb-2 block text-sm font-bold text-dark-orange">
                    Notes
                  </label>
                  <textarea
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    placeholder="observation here"
                    className="h-64 w-full resize-none rounded-xl bg-white p-4 text-sm font-medium text-gray focus:outline-none focus:ring-2 focus:ring-light-orange shadow-sm transition-all"
                  />
                </div>

                {/* Save Button */}
                <div className="flex justify-end pt-2">
                  <button
                    className="rounded-xl bg-dark-orange px-8 py-3 text-sm font-bold text-white transition-all hover:scale-105 hover:shadow-lg hover:bg-orange disabled:cursor-not-allowed disabled:bg-medium-gray disabled:hover:scale-100 disabled:hover:shadow-none shadow-md"
                    disabled={notes.trim() === ""}
                  >
                    Save
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
