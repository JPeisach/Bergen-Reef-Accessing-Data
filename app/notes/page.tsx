"use client";
import React, { useState } from "react";
import { useUser } from "@auth0/nextjs-auth0/client";
import "../globals.css";
import NavigationBar from "../components/NavigationBar";

export default function Page() {
  const { user } = useUser();
  const [notes, setNotes] = useState("");

  return (
    <div>
      <NavigationBar defaultIndex={3} username={(user) ? user.name : "Guest"}/>

      {/* Content */}
      <div className="p-8">
        <h1 className="text-2xl font-bold text-dark-orange mb-4">Notes</h1>
        <textarea
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          placeholder="placeholder"
          className="w-full h-96 p-4 border-2 border-medium-gray rounded-xl resize-none focus:outline-none focus:border-dark-orange text-gray font-medium"
        />
      </div>
    </div>
  );
}

