"use client";

import { useUser } from "@auth0/nextjs-auth0/client";
import NavigationBar from "../components/NavigationBar";
import { useState } from "react";

export default function SettingsPage() {
  const { user, isLoading } = useUser();
  const [isDark, setIsDark] = useState(false);

  if (isLoading) return <div>Loading...</div>;

  return (
    <div>
      <NavigationBar defaultIndex={-1} username={user ? user.name : "Guest"} />
      <br></br>
      <br></br>

      <br />
      <br />

      {/* Settings Box */}
      <div
        style={{
          width: "150px",
          height: "75px",
          margin: "0 auto",
          borderRadius: "5px",
          border: "1px solid #ccc",
          backgroundColor: isDark ? "rgb(250, 185, 100)" : "#f9fafb",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <button
          onClick={() => setIsDark(!isDark)}
          style={{
            padding: "4px 6px",
            borderRadius: "6px",
            border: "none",
            cursor: "pointer",
            backgroundColor: isDark ? "#ecb45a" : "#f79736",
            color: "white",
            fontWeight: "500",
          }}
        >
          Change Theme
        </button>
      </div>
    </div>
  );
}
