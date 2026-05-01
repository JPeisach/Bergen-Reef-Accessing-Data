"use client";
import { useUser } from "@auth0/nextjs-auth0/client";
import "../../globals.css";
import "../../css/graphComponents.css";
import BarChartGraph from "../../components/graphComponents/BarChartGraph";
import NavigationBar from "../../components/NavigationBar";
import { useState } from "react";
import DateBoundElement from "app/components/DateBoundElement";

export default function Page() {
  const { user } = useUser();

  // Temporary set so we can initialize on a previous point in time
  const dateA = new Date();
  dateA.setDate(dateA.getDay() - 5);

  const [startDate, setStartDate] = useState(
    localStorage.getItem("barchart-startDate")
      ? new Date(localStorage.getItem("barchart-startDate"))
      : dateA,
  );
  const [endDate, setEndDate] = useState(
    localStorage.getItem("barchart-endDate")
      ? new Date(localStorage.getItem("barchart-endDate"))
      : new Date(),
  );
  const [tanks, setTanks] = useState(
    localStorage.getItem("barchart-tanks")
      ? JSON.parse(localStorage.getItem("barchart-tanks"))
      : [],
  );
  const [variables, setVariables] = useState(
    localStorage.getItem("barchart-variables")
      ? JSON.parse(localStorage.getItem("barchart-variables"))
      : [],
  );

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
    "LLS",
  ];

  const toggleTank = (item: string) => {
    const newTanks = tanks.includes(item)
      ? tanks.filter((x) => x !== item)
      : [...tanks, item];
    setTanks(newTanks);
    localStorage.setItem("barchart-tanks", JSON.stringify(newTanks));
  };

  // start AI code
  const toggleVariable = (item: string) => {
    const newVars = variables.includes(item)
      ? variables.filter((x) => x !== item) // deselect
      : variables.length >= 2
        ? variables // block selecting more than 2
        : [...variables, item];
    setVariables(newVars);
    localStorage.setItem("barchart-variables", JSON.stringify(newVars));
  };

  const isDisabled = (item: string) =>
    !variables.includes(item) && variables.length >= 2;

  // FIXME: Most of this was written by AI, primarily the selection boxes,
  // but they are misplaced in UI location.
  return (
    <div className="bg-base-200">
      <NavigationBar defaultIndex={5} username={user ? user.name : "Guest"} />
      <div className="bg-base-100/30 min-h-screen overflow-hidden">
        <div className="justify-center items-center flex-2 bg-base-200 border-base-300 graph-settings-panel">
          <fieldset className="fieldset bg-base-200 rounded-box w-xs p-4 flex">
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
          <fieldset className="fieldset bg-base-200 rounded-box w-xs p-4 flex">
            <legend className="fieldset-legend">
              Select up to Two Variables
            </legend>

            {variableNames.map((item) => (
              <label
                key={item}
                className={`label cursor-pointer justify-start gap-3 ${
                  isDisabled(item) ? "opacity-50 cursor-not-allowed" : ""
                }`}
              >
                <input
                  type="checkbox"
                  className="checkbox checkbox-primary"
                  checked={variables.includes(item)}
                  disabled={isDisabled(item)}
                  onChange={() => toggleVariable(item)}
                />
                <span>{item}</span>
              </label>
            ))}
          </fieldset>
          <div
            className={`flex items-center ${
              true ? "flex" : "space-x-4" // Can change this to make it horizontal using isSmallScreen
            } justify-center rounded-lg m-3 text-lg text-base-content/80`}
          >
            {/* FIXME: For now, trying out this way of date picking */}
            <DateBoundElement
              value={startDate}
              onChange={(date) => {
                localStorage.setItem(
                  "barchart-startDate",
                  date?.toISOString() ?? "",
                );
                return setStartDate(date);
              }}
            />

            <div className="bg-accent text-accent-content p-1 pl-2 pr-2 mt-3 mb-3 rounded-lg">
              <span className="text-accent-content font-semibold text-center">
                to
              </span>
            </div>

            <DateBoundElement
              value={endDate}
              onChange={(date) => {
                localStorage.setItem(
                  "barchart-endDate",
                  date?.toISOString() ?? "",
                );
                return setEndDate(date);
              }}
            />
          </div>
        </div>
        <BarChartGraph
          tankNames={tanks}
          variableTypes={variables}
          dateRange={[startDate, endDate]}
        />
      </div>
    </div>
  );
}
