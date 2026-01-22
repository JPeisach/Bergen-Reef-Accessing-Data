"use client";
import "../globals.css";
import NavigationBar from "app/components/NavigationBar";
import { useUser } from "@auth0/nextjs-auth0/client";
import HistoricDataTankBox from "app/components/tankBoxes/HistoricDataTankBox";
import { useState } from "react";
import RecentDataTankBox from "app/components/tankBoxes/RecentDataTankBox";

export default function DashboardPage() {
  const { user } = useUser();
  const [variableType, setVariableType] = useState("pH");

  return (
    <div>
      <NavigationBar defaultIndex={1} username={user ? user.name : "Guest"} />

      <div className="p-8 bg-light-orange/30 min-h-screen">
        <h1 className="text-3xl font-bold text-dark-orange mb-6 text-center drop-shadow-sm">
          Tank Dashboard
        </h1>

        <center className="py-5">
          <div className="variable-select">
            <label className="text-2xl font-bold text-dark-orange text-center drop-shadow-sm">
              Variable:{" "}
            </label>
            <select
              onChange={(e) => {
                setVariableType(e.target.value);
              }}
            >
              <option value="pH">pH</option>
              <option value="Calcium">Calcium</option>
              <option value="Alkalinity">Alkalinity</option>
              <option value="ORP">ORP</option>
              <option value="Temperature">Temperature</option>
              <option value="Salinity">Salinity</option>
            </select>
          </div>
        </center>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-7xl mx-auto">
          <RecentDataTankBox
            tankNumber={1}
            variableType={variableType}
          ></RecentDataTankBox>
          <RecentDataTankBox
            tankNumber={2}
            variableType={variableType}
          ></RecentDataTankBox>
          <RecentDataTankBox
            tankNumber={3}
            variableType={variableType}
          ></RecentDataTankBox>
          <RecentDataTankBox
            tankNumber={4}
            variableType={variableType}
          ></RecentDataTankBox>
          <RecentDataTankBox
            tankNumber={5}
            variableType={variableType}
          ></RecentDataTankBox>
          <RecentDataTankBox
            tankNumber={6}
            variableType={variableType}
          ></RecentDataTankBox>
          <RecentDataTankBox
            tankNumber={7}
            variableType={variableType}
          ></RecentDataTankBox>
          <RecentDataTankBox
            tankNumber={8}
            variableType={variableType}
          ></RecentDataTankBox>
          <RecentDataTankBox
            tankNumber={9}
            variableType={variableType}
          ></RecentDataTankBox>
        </div>
      </div>
    </div>
  );
}
