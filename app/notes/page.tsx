"use client";

import { useState } from "react";
import { useUser } from "@auth0/nextjs-auth0/client";
import "../globals.css";
import NavigationBar from "../components/NavigationBar";
import ObservationNotepad from "app/components/observations/ObservationNotepad";
import ObservationList from "app/components/observations/ObservationList";

export default function Page() {
  const { user } = useUser();

  // AI CODE: refresh keys callback
  // Refresh key to force remounting ObservationList when a new note is saved
  const [notesRefreshKey, setNotesRefreshKey] = useState(0);

  const handleNoteSaved = () => {
    setNotesRefreshKey((k) => k + 1);
  };

  return (
    <div className="bg-base-200">
      <NavigationBar defaultIndex={2} username={user ? user.name : "Guest"} />

      <div className="relative flex">
        <div className="p-8 bg-base-200 min-h-screen min-w-full">
          <h1 className="text-3xl font-bold text-primary mb-6 text-center drop-shadow-sm">
            Observations
          </h1>

          {/* layout of page*/}
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
            <ObservationList key={`notes-${notesRefreshKey}`} />

            {/* notepad */}
            {<ObservationNotepad submitCallback={handleNoteSaved} />}
          </div>
        </div>
      </div>
    </div>
  );
}
