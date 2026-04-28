"use client";

import { useEffect, useState } from "react";
import { useUser } from "@auth0/nextjs-auth0/client";
import "../globals.css";
import NavigationBar from "../components/NavigationBar";
import ObservationNotepad from "app/components/observations/ObservationNotepad";
import ObservationList from "app/components/observations/ObservationList";

export default function Page() {
  const { user } = useUser();

  const [tankNumber, setTankNumber] = useState("");
  const [coralType, setCoralType] = useState("");
  const [observationTime, setObservationTime] = useState("");
  const [isNotepadVisible, setIsNotepadVisible] = useState(false);

  const coralTypes = [
    "Mushroom Coral",
    "Brain Coral",
    "Jolene Coral",
    "Sarah Coral",
    "Josh Coral",
  ];

  const tankNames = [
    "Tank CoralLab60_1",
    "Tank CoralLab60_2",
    "Tank CoralLab60_3",
    "Tank CoralLab60_4",
    "Tank CoralLab60_5",
    "Tank CoralLab60_6",
    "Tank ESCReef",
    "Tank CoralLab380",
  ];

  return (
    <div className="bg-base-200">
      <NavigationBar defaultIndex={3} username={user ? user.name : "Guest"} />

      <div className="relative flex">
        <div className="p-8 bg-base-200 min-h-screen min-w-full">
          <h1 className="text-3xl font-bold text-primary mb-6 text-center drop-shadow-sm">
            Observations
          </h1>

          {/* TODO: Determine what this will be - a panel to filter observations? */}
          <div className="mb-8 flex flex-wrap items-end gap-4 rounded-2xl bg-base-100 border border-base-300 p-5 shadow-lg backdrop-blur-sm">
            {/* Tank numnber dropdown menu */}
            <div className="min-w-[160px]">
              <label className="block text-primary font-bold mb-2 text-sm">
                Tank
              </label>
              <select
                value={tankNumber}
                onChange={(e) => setTankNumber(e.target.value)}
                className="w-full rounded-xl bg-base-100 p-2.5 text-sm font-medium text-base-content focus:outline-none focus:ring-2 focus:ring-primary shadow-sm transition-all border border-base-300"
              >
                <option value="">Select tank...</option>
                {tankNames.map((type, index) => (
                  <option key={`${type}-${index}`} value={type}>
                    {type}
                  </option>
                ))}
              </select>
            </div>

            {/* coral dropdown */}
            <div className="min-w-[180px]">
              <label className="block text-primary font-bold mb-2 text-sm">
                Coral Type
              </label>
              <select
                value={coralType}
                onChange={(e) => setCoralType(e.target.value)}
                className="w-full rounded-xl bg-base-100 p-2.5 text-sm font-medium text-base-content focus:outline-none focus:ring-2 focus:ring-primary shadow-sm transition-all border border-base-300"
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
              <label className="block text-primary font-bold mb-2 text-sm">
                Time
              </label>
              <input
                type="time"
                value={observationTime}
                onChange={(e) => setObservationTime(e.target.value)}
                className="w-full rounded-xl bg-base-100 p-2.5 text-sm font-medium text-base-content focus:outline-none focus:ring-2 focus:ring-primary shadow-sm transition-all border border-base-300"
              />
            </div>

            {/* button to open notepad */}
            <button
              type="button"
              onClick={() => setIsNotepadVisible((prev) => !prev)}
              className="ml-auto flex h-12 w-12 items-center justify-center rounded-full bg-primary text-2xl font-bold text-primary-content shadow-lg transition-all hover:scale-110 hover:shadow-xl hover:bg-primary/90"
            >
              {isNotepadVisible ? "−" : "+"}
            </button>
          </div>

          {/* layout of page*/}
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
            <ObservationList />

            {/* notepad */}
            {isNotepadVisible && <ObservationNotepad />}
          </div>
        </div>
      </div>
    </div>
  );
}
