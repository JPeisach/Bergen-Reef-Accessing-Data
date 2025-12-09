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

  const coralTypes = [
    "placeholder",
    "placeholder",
    "placeholder",
    "placeholder",
    "placeholder",
    "Other",
  ];

  const variables = ["pH", "Calcium", "Temperature", "None of the above"];

  const handleVariableChange = (variable: string) => {
    setSelectedVariables((prev) =>
      prev.includes(variable)
        ? prev.filter((v) => v !== variable)
        : [...prev, variable],
    );
  };

  const canWrite = tankNumber !== "" && coralType !== "" && selectedVariables.length > 0;

  return (
    <div>
      <NavigationBar defaultIndex={3} username={user ? user.name : "Guest"} />

      {/* Content */}
      <div className="p-8">
        <h1 className="text-2xl font-bold text-dark-orange mb-4">Notes</h1>

        {/* Filters Section */}
        <div className="mb-6 space-y-4">
          {/* Tank Number Dropdown */}
          <div>
            <label className="block text-gray font-semibold mb-2">
              Tank Number
            </label>
            <select
              value={tankNumber}
              onChange={(e) => setTankNumber(e.target.value)}
              className="w-full p-3 border-2 border-medium-gray rounded-xl focus:outline-none focus:border-dark-orange text-gray font-medium bg-white"
            >
              <option value="">Select tank number...</option>
              {Array.from({ length: 9 }, (_, i) => i + 1).map((num) => (
                <option key={num} value={num}>
                  {num}
                </option>
              ))}
            </select>
          </div>

          {/* Coral Type Dropdown */}
          <div>
            <label className="block text-gray font-semibold mb-2">
              Coral Type
            </label>
            <select
              value={coralType}
              onChange={(e) => setCoralType(e.target.value)}
              className="w-full p-3 border-2 border-medium-gray rounded-xl focus:outline-none focus:border-dark-orange text-gray font-medium bg-white"
            >
              <option value="">Select coral type...</option>
              {coralTypes.map((type, index) => (
                <option key={`${type}-${index}`} value={type}>
                  {type}
                </option>
              ))}
            </select>
          </div>

          {/* Variables Checkboxes */}
          <div>
            <label className="block text-gray font-semibold mb-2">
              Variables (select all that apply)
            </label>
            <div className="space-y-2">
              {variables.map((variable) => (
                <label
                  key={variable}
                  className="flex items-center space-x-2 cursor-pointer"
                >
                  <input
                    type="checkbox"
                    checked={selectedVariables.includes(variable)}
                    onChange={() => handleVariableChange(variable)}
                    className="w-5 h-5 border-2 border-medium-gray rounded focus:ring-2 focus:ring-dark-orange text-dark-orange"
                  />
                  <span className="text-gray font-medium">{variable}</span>
                </label>
              ))}
            </div>
          </div>
        </div>

        {/* Notes Textarea */}
        <textarea
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          placeholder={
            canWrite ? "Write note here" : "Please select stuff first"
          }
          disabled={!canWrite}
          className={`w-full h-96 p-4 border-2 rounded-xl resize-none focus:outline-none text-gray font-medium ${
            canWrite
              ? "border-medium-gray focus:border-dark-orange"
              : "border-medium-gray bg-gray-100 cursor-not-allowed opacity-60"
          }`}
        />

        {/* Save Button */}
        <div className="mt-4 flex justify-end">
          <button
            className="px-6 py-2 bg-dark-orange text-white font-semibold rounded-xl hover:bg-medium-orange transition disabled:bg-medium-gray disabled:cursor-not-allowed"
            disabled={!canWrite || notes.trim() === ""}
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
}
