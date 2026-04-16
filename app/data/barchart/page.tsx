"use client";
import { useUser } from "@auth0/nextjs-auth0/client";
import "../../globals.css";
import BarChartGraph from "../../components/graphComponents/BarChartGraph";
import NavigationBar from "../../components/NavigationBar";
import { useState } from "react";

export default function Page() {
  const { user } = useUser();
  const [tanks, setTanks] = useState([]);
  const [variables, setVariables] = useState([]);

  const tankNames = [
    "CoralLab60_1",
    "CoralLab60_2",
    "CoralLab60_3",
    "CoralLab60_4",
    "CoralLab60_5",
    "CoralLab60_6",
    "ESCReef",
    "CoralLab380",
  ];

  const variableNames = [
    "pH",
    "Salinity",
    "ORP",
    "Temperature",
    "Alkalinity",
    "Calcium",
  ];

  const toggleTank = (item: string) => {
    setTanks((prev) =>
      prev.includes(item) ? prev.filter((x) => x !== item) : [...prev, item],
    );
  };

  const toggleVariable = (item: string) => {
    setVariables((prev) =>
      prev.includes(item) ? prev.filter((x) => x !== item) : [...prev, item],
    );
  };

  const dateA = new Date();
  dateA.setDate(dateA.getDay() - 5);
  return (
    <div>
      <NavigationBar defaultIndex={6} username={user ? user.name : "Guest"} />
      <div className="bg-base-100/30 min-h-screen flex-1 overflow-hidden">
        {/* TODO: Selectable tanks, variables */}
        <BarChartGraph
          tankNames={tanks}
          variableTypes={variables}
          dateRange={[dateA, new Date()]}
        />
        <fieldset className="fieldset bg-base-200 border-base-300 rounded-box w-xs border p-4">
          <legend className="fieldset-legend">Select Tanks</legend>

          {tankNames.map((item) => (
            <label
              key={item}
              className="label cursor-pointer justify-start gap-3"
            >
              <input
                type="checkbox"
                className="checkbox checkbox-primary"
                checked={tanks.includes(item)}
                onChange={() => toggleTank(item)}
              />
              <span>{item}</span>
            </label>
          ))}
        </fieldset>
        <fieldset className="fieldset bg-base-200 border-base-300 rounded-box w-xs border p-4">
          <legend className="fieldset-legend">Select Variables</legend>

          {variableNames.map((item) => (
            <label
              key={item}
              className="label cursor-pointer justify-start gap-3"
            >
              <input
                type="checkbox"
                className="checkbox checkbox-primary"
                checked={variables.includes(item)}
                onChange={() => toggleVariable(item)}
              />
              <span>{item}</span>
            </label>
          ))}
        </fieldset>
      </div>
    </div>
  );
}
