"use client";

import "./globals.css";

import { useState } from "react";
import { useUser } from "@auth0/nextjs-auth0/client";

import { ResponsiveContainer } from "recharts";

import HomePageGraph from "./components/HomePageGraph";
import HomePageElements from "./components/HomePageElements";
import NavigationBar from "./components/NavigationBar";

const styles = {
  container: {
    display: "flex",
    flexDirection: "row" as const, // Explicitly cast the type
    gap: "10px",
    padding: "0 20px",
  },
  leftHalf: {
    flex: 1,
    justifyContent: "center",
    padding: "10px",
    backgroundColor: "#f9f9f9",
  },
  rightHalf: {
    flex: 2, // Takes up the other 50%
    display: "flex",
    justifyContent: "center", // Centers the graph horizontally
    alignItems: "center", // Centers the graph vertically
  },
  select: {
    marginTop: "20px",
    padding: "10px",
    fontSize: "16px",
  },
};

export default function Page() {
  const { user } = useUser();
  const [selectedType, setSelectedType] = useState("Salinity");

  return (
    <div>
      <NavigationBar defaultIndex={0} username={user ? user.name : "Guest"} />

      <br></br>

      {/*CONTAINER HOLDING ELEMENTS AND GRAPH IN HALVES OF THE SCREEN*/}
      <div style={styles.container}>
        {/*ELEMENTS*/}
        <div style={{ position: "relative", zIndex: 1 }}>
          <HomePageElements
            selectedType={selectedType}
            onTypeSelectAction={setSelectedType}
          />
        </div>

        {/*CHART*/}
        <div
          className="w-3/5 rounded-lg p-3 ml-1"
          style={{ position: "relative", zIndex: 1 }}
        >
          <ResponsiveContainer width={"100%"} height={"auto"}>
            <HomePageGraph
              selectedType={selectedType}
              onTypeSelectAction={setSelectedType}
            />
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
