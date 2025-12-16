"use client";
import React, { useState } from "react";
import { useUser } from "@auth0/nextjs-auth0/client";
import "../globals.css";
import NavigationBar from "../components/NavigationBar";

export default function Page() {
  const { user } = useUser();
  const [tankNumber, setTankNumber] = useState("");

  // actual info will replace this later
  const getTankInfo = (tankNum: string) => {
    if (!tankNum) return null;
    return {
      coralTypes: [
        "Mushroom Coral",
        "Brain Coral",
        "Jolene Coral",
      ],
    };
  };

  const tankInfo = getTankInfo(tankNumber);

  return (
    <div>
      <NavigationBar defaultIndex={4} username={user ? user.name : "Guest"} />

      {/* Content */}
      <div className="p-8">
        <h1 className="text-2xl font-bold text-dark-orange mb-4">Tank Information</h1>

        {/* Tank Number Dropdown */}
        <div className="mb-6">
          <label className="block text-gray font-semibold mb-2">
            Tank Number
          </label>
          <select
            value={tankNumber}
            onChange={(e) => setTankNumber(e.target.value)}
            className="w-full max-w-xs p-3 border-2 border-medium-gray rounded-xl focus:outline-none focus:border-dark-orange text-gray font-medium bg-white"
          >
            <option value="">Select tank number...</option>
            {Array.from({ length: 9 }, (_, i) => i + 1).map((num) => (
              <option key={num} value={num.toString()}>
                {num}
              </option>
            ))}
          </select>
        </div>

        {/* Tank Information Display */}
        {tankNumber && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Tank Picture */}
            <div>
              <h2 className="text-xl font-semibold text-dark-orange mb-3">
                Tank {tankNumber} Picture
              </h2>
              <div className="bg-light-gray border-2 border-medium-gray rounded-xl p-4 flex items-center justify-center min-h-[300px] overflow-hidden">
                <img
                  src="https://www.hepper.com/wp-content/uploads/2022/09/saltwater-tank-clownfish-tropical-fish-coral_Vojce_Shutterstock.jpg"
                  alt={`Tank ${tankNumber} coral reef aquarium`}
                  className="w-full h-full object-cover rounded-lg"
                />
              </div>
            </div>

            {/* Coral Types Information */}
            <div>
              <h2 className="text-xl font-semibold text-dark-orange mb-3">
                Coral Types in Tank {tankNumber}
              </h2>
              <div className="bg-light-gray border-2 border-medium-gray rounded-xl p-6">
                {tankInfo && tankInfo.coralTypes.length > 0 ? (
                  <ul className="space-y-3">
                    {tankInfo.coralTypes.map((coralType, index) => (
                      <li
                        key={index}
                        className="p-3 bg-white rounded-lg border border-medium-gray text-gray font-medium"
                      >
                        {coralType}
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-gray font-medium">No coral types available</p>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Placeholder message when no tank is selected */}
        {!tankNumber && (
          <div className="bg-light-gray border-2 border-medium-gray rounded-xl p-8 text-center">
            <p className="text-gray font-medium text-lg">
              Select tank number to view information.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

