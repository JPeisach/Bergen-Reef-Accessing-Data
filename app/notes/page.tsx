"use client";
import React from "react";
import { useUser } from "@auth0/nextjs-auth0/client";
import "../globals.css";
import NavigationBar from "../components/NavigationBar";

export default function Page() {
  const { user } = useUser();

  return (
    <div>
      <NavigationBar defaultIndex={3} username={(user) ? user.name : "Guest"}/>

      {/* Content */}
      <div className="p-8">
        <h1 className="text-2xl font-bold text-dark-orange mb-4">Notes</h1>
        <p className="text-gray">Welcome to the Notes page.</p>
      </div>
    </div>
  );
}

