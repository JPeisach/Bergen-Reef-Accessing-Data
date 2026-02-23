"use client";

import "./globals.css";

import { useState } from "react";
import { useUser } from "@auth0/nextjs-auth0/client";

import { ResponsiveContainer } from "recharts";

import HomePageGraph from "./components/HomePageGraph";
import HomePageElements from "./components/HomePageElements";
import NavigationBar from "./components/NavigationBar";

export default function Page() {
  const { user } = useUser();
  const [selectedType, setSelectedType] = useState("Salinity");

  return (
    <div className="bg-light-orange/30">
      <NavigationBar defaultIndex={0} username={user ? user.name : "Guest"} />

      {/* FIXME: Consider where we put the "open notes/observations" panel */}
      <main className="relative flex p-8 h-screen overflow-hidden">
        {/* CONTAINER HOLDING ELEMENTS AND GRAPH */}
        <div className="flex flex-col lg:flex-row gap-6 h-[calc(100vh-140px)]">
          {/* LEFT COLUMN: ELEMENTS SELECTION */}
          <div className="w-full lg:w-5/12 rounded-2xl bg-light-orange/40 p-6 shadow-lg backdrop-blur-sm overflow-hidden flex flex-col">
            <h2 className="text-xl font-bold text-dark-orange mb-4">
              Select Parameter
            </h2>
            <div className="relative z-10 flex-1">
              <HomePageElements
                selectedType={selectedType}
                onTypeSelectAction={setSelectedType}
              />
            </div>
          </div>

          {/* RIGHT COLUMN: CHART */}
          <div className="w-full lg:w-7/12 rounded-2xl bg-light-orange/40 p-6 shadow-lg backdrop-blur-sm flex flex-col relative z-0">
            <h2 className="text-xl font-bold text-dark-orange mb-4">
              {selectedType} Overview
            </h2>
            <div className="flex-1 w-full min-h-0 overflow-hidden">
              <HomePageGraph
                selectedType={selectedType}
                onTypeSelectAction={setSelectedType}
              />
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
