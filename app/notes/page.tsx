"use client";

import { useState, useEffect } from "react";
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
  const [observations, setObservations] = useState([]);

  const coralTypes = [
    "Mushroom Coral",
    "Brain Coral",
    "Jolene Coral",
    "Sarah Coral",
    "Josh Coral",
  ];

  const fetchObservations = async () => {
    const res = await fetch("/api/observations");
    const data = await res.json();
    setObservations(data);
  };

  const deleteObservation = async (id: number) => {
    await fetch(`/api/observations?id=${id}`, { method: "DELETE" });
    fetchObservations();
  };

  const editObservation = async (id: number, updates: any) => {
    await fetch("/api/observations", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, ...updates }),
    });
    fetchObservations();
  };

  useEffect(() => {
    fetchObservations();
  }, []);

  return (
    <div>
      <NavigationBar defaultIndex={3} username={user?.name || "Guest"} />

      <div className="p-8 bg-light-orange/30 min-h-screen">
        <h1 className="text-3xl font-bold text-dark-orange mb-6 text-center">
          Observations
        </h1>

        <div className="mb-8 flex flex-wrap items-end gap-4 rounded-2xl bg-light-orange/40 p-5 shadow-lg">
          <div>
            <label className="block font-bold text-sm">Tank</label>
            <select
              value={tankNumber}
              onChange={(e) => setTankNumber(e.target.value)}
              className="rounded-xl p-2"
            >
              <option value="">Select tank...</option>
              {Array.from({ length: 9 }, (_, i) => i + 1).map((num) => (
                <option key={num}>{num}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block font-bold text-sm">Coral</label>
            <select
              value={coralType}
              onChange={(e) => setCoralType(e.target.value)}
              className="rounded-xl p-2"
            >
              <option value="">Select coral...</option>
              {coralTypes.map((type) => (
                <option key={type}>{type}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block font-bold text-sm">Time</label>
            <input
              type="time"
              value={observationTime}
              onChange={(e) => setObservationTime(e.target.value)}
              className="rounded-xl p-2"
            />
          </div>

          <button
            onClick={() => setIsNotepadVisible((p) => !p)}
            className="ml-auto h-12 w-12 rounded-full bg-dark-orange text-white text-xl"
          >
            {isNotepadVisible ? "−" : "+"}
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <ObservationList
            observations={observations}
            onDelete={deleteObservation}
            onEdit={editObservation}
          />

          {isNotepadVisible && (
            <ObservationNotepad onSave={fetchObservations} />
          )}
        </div>
      </div>
    </div>
  );
}