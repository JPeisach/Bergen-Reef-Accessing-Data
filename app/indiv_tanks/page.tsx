"use client";
import React, { useState } from "react";
import { useUser } from "@auth0/nextjs-auth0/client";
import "../globals.css";
import NavigationBar from "../components/NavigationBar";

interface OptionType {
  label: string;
  value: string;
}


export default function Page() {
  const { user } = useUser();
  const [notes, setNotes] = useState("");
  const [tank, setTank] = useState("");
  const [time, setTime] = useState("");
  const [graph, setGraph] = useState("");
  const [parameters, setParameters] = useState("");


  const tanks = [
    "Tank 1",
    "Tank 2",
    "Tank 3",
    "Tank 4",
    "Tank 5",
    "Tank 6",
    "Tank 7",
    "Tank 8",
    "Tank 9",
  ];

  const times = [
    "Last Week",
    "Last Two Weeks",
    "Last Month",
    "Last Six Months",
    "Custom"
  ];

  const graphs = [
    "Line Graph",
    "Sankey Chart",
    "Bar Graph",
    "Other"
  ];

  const parametersList = ["pH", "Salinity", "Temperature", "Orp", "Alkalinity", "Nitrate", "Nitrite", "Phosphate"];

  return (
    <div>
      <NavigationBar defaultIndex={3} username={user ? user.name : "Guest"} />

      {/* Content */}
      <div className="p-8">
        <h1 className="text-2xl font-bold text-dark-orange mb-4">Individual Tank View</h1>

        {/* Filters Section */}
        <div className="mb-6 space-y-4">
          {/* Tank Dropdown */}
          <div>
            <label className="block text-gray font-semibold mb-2">
              Tank
            </label>
            <select
              value={tank}
              onChange={(e) => setTank(e.target.value)}
              className="w-full p-3 border-2 border-medium-gray rounded-xl focus:outline-none focus:border-dark-orange text-gray font-medium bg-white"
            > 
              <option value="">Select Tank...</option>
              {tanks.map((type) => (
                <option key={type} value={type}>
                  {type}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Time Dropdown */}
          <div>
            <label className="block text-gray font-semibold mb-2">
              Time Range
            </label>
            <select
              value={time}
              onChange={(e) => setTime(e.target.value)}
              className="w-full p-3 border-2 border-medium-gray rounded-xl focus:outline-none focus:border-dark-orange text-gray font-medium bg-white"
            > 
              <option value="">Select Time Range...</option>
              {times.map((type) => (
                <option key={type} value={type}>
                  {type}
                </option>
              ))}
            </select>
          </div>

    {/* Time Dropdown */}
          <div>
            <label className="block text-gray font-semibold mb-2">
              Parameters
            </label>
            <select
              value={parameters}
              onChange={(e) => setParameters(e.target.value)}
              className="w-full p-3 border-2 border-medium-gray rounded-xl focus:outline-none focus:border-dark-orange text-gray font-medium bg-white"
            > 
              <option value="">Select Parameters...</option>
              {parametersList.map((type) => (
                <option key={type} value={type}>
                  {type}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-gray font-semibold mb-2">
              Graph Type
            </label>
            <select
              value={graph}
              onChange={(e) => setGraph(e.target.value)}
              className="w-full p-3 border-2 border-medium-gray rounded-xl focus:outline-none focus:border-dark-orange text-gray font-medium bg-white"
            > 
              <option value="">Select Graph Type...</option>
              {graphs.map((type) => (
                <option key={type} value={type}>
                  {type}
                </option>
              ))}
            </select>
          </div>



      {/* Notes Textarea */}
        <textarea
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          ></textarea>

        {/* Save Button */}
        <div className="mt-4 flex justify-end">
          <button
            className="px-6 py-2 bg-dark-orange text-white font-semibold rounded-xl hover:bg-medium-orange transition disabled:bg-medium-gray disabled:cursor-not-allowed"
            
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
}
