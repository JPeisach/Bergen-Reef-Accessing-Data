"use client";
import "../globals.css";
import React, { useState } from "react";
import { useUser } from "@auth0/nextjs-auth0/client";
import NavigationBar from "../components/NavigationBar";
import TankBox from "app/components/TankBox";

export default function Page() {
  const { user } = useUser();
  const [notes, setNotes] = useState("");

  const [parameter, setParameter] = useState("");
  const [timeRange, setTimeRange] = useState("");

  const panelClass = "bg-light-orange/40 p-5 shadow-lg";

  return (
    <div className="min-h-screen bg-light-orange/30">
      <NavigationBar defaultIndex={3} username={user ? user.name : "Guest"} />

      <div className="p-8 max-w-7xl mx-auto">
        
        <div className={`mb-6 flex flex-wrap items-end gap-4 ${panelClass}`}>
          {[ 
            { label: "Tank", options: ["Tank 1","Tank 2","Tank 3","Tank 4","Tank 5","Tank 6","Tank 7","Tank 8","Tank 9"] },
            { label: "Parameters", options: ["pH","Salinity","Temperature","ORP","Alkalinity","Calcium","Nitrate","Nitrite","Phosphate"] },
            { label: "Time Range", options: ["Yesterday","Last Week","Last Month","Custom"] },
            { label: "Graph Type", options: ["Line","Bar","Sankey","Other"] },
          ].map((item) => (
            <div key={item.label} className="min-w-[160px]">
              <label className="block text-dark-orange font-bold mb-1 text-sm">
                {item.label}
              </label>
                      <select
          value={parameter}
          onChange={(e) => setParameter(e.target.value)}
          className="w-left bg-white px-2 py-2 text-sm font-medium text-dark-orange focus:outline-none focus:ring-2 focus:ring-light-orange shadow-inner"
        >
          <option value="">Select…</option>
          {item.options.map((opt) => (
            <option key={opt} value={opt}>
              {opt}
            </option>
          ))}
        </select>

            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-[280px_1fr] gap-6">
          <div className={panelClass}>
            <h2 className="text-lg font-bold text-dark-orange mb-3">Tank 1</h2>
            <ul className="space-y-1.5 text-sm text-dark-orange/80 font-medium">
              <li>pH: 8.08</li>
              <li>Salinity: 27.7 ppt</li>
              <li>Temperature: 76.9°F</li>
              <li>ORP: 308 mV</li>
              <li>Alkalinity: 9.4 dKH</li>
              <li>Calcium: 306 ppm</li>
              <li>Nitrate: 0 ppm</li>
              <li>Nitrite: 0 ppm</li>
              <li>Phosphate: 6.5 ppb</li>
            </ul>
            <div className="mt-4 bg-white p-3 shadow-inner">
              <h3 className="font-bold text-dark-orange text-sm mb-1">Pinned Notes</h3>
              <h4 className="font-bold text-dark-orange text-xs mb-1">🙍 Mr. Ramirez</h4>
              <p className="text-xs text-dark-orange/70 leading-relaxed">
                Tank 1 has been struggling lately. We suspect that the addition of the new supplement, "GroCoral", has negatively impacted the tank's vitality. Increased algae bloom observed.
              </p>
              <p className="font-bold text-dark-orange text-xs mt-2 underline">
                <a href="/notes">Open in Observations</a>
              </p>
            </div>
          </div>
        <div className="bg-light-orange/40 p-5 shadow-lg">
          <div className="mb-3 bg-white px-4 py-2 text-sm font-semibold text-dark-orange shadow-inner flex justify-between">
            <div className="mb-3 bg-white px-4 py-2 text-sm font-semibold text-dark-orange shadow-inner flex justify-between">
              <span className="text-dark-orange/60">{parameter||"Parameter"}</span>
              {/*
              <span className="text-dark-orange/60">{timeRange||"Time Range"}</span>
              */}
            </div>
          </div> 
          


          <div className="h-[500px] bg-white shadow-inner p-5">
            <TankBox tankNumber={1}/>
          </div>

          <div className="mt-6 text-sm text-dark-orange/70 text-center italic">
            Tank 1 houses numerous types of corals, including mushroom corals,
            button polyps, leather corals, and bubble corals.
          </div>
        </div>
          </div>
        </div>

        <div className={`p-8 max-w-7xl mx-auto ${panelClass}`}>
        <div className={`p-8 max-w-7xl mx-auto`}>
          <label className="block mb-2 text-sm font-bold text-dark-orange">
            Open Notes & Observations
          </label>
          <textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="Write observations here…"
            className="w-full h-32 resize-none bg-white p-4 text-sm font-medium text-dark-orange focus:outline-none focus:ring-2 focus:ring-light-orange shadow-inner"
          />
        </div>
        </div>

        <div className="mt-1 flex justify-end">
          <button className="bg-orange px-8 py-3 text-sm font-bold text-white transition-all hover:shadow-lg hover:bg-orange">
            Save
          </button>
        </div>
      </div>
  );
}
