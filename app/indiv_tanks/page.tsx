"use client";
import "../globals.css";
import { useState } from "react";
import { useUser } from "@auth0/nextjs-auth0/client";
import NavigationBar from "../components/NavigationBar";
import HistoricDataTankBox from "app/components/tankBoxes/HistoricDataTankBox";
import "flatpickr/dist/themes/confetti.css";
import Flatpickr from "react-flatpickr";
import TankStatsPanel from "app/components/TankStatsPanel";
import PredefinedObservationNotepad from "app/components/observations/PredefinedObservationNotepad";

export default function Page() {
  const { user } = useUser();

  const [dateRange, setDateRange] = useState([new Date()]);
  const [selectedTank, setSelectedTank] = useState("");
  const [selectedParameter, setSelectedParameter] = useState("");
  const [selectedGraphType, setSelectedGraphType] = useState("");
  const [isNotepadVisible, setIsNotepadVisible] = useState(false);

  const panelClass = "bg-light-orange/40 p-5 shadow-lg rounded-xl";

  return (
    <div>
      <NavigationBar defaultIndex={2} username={user ? user.name : "Guest"} />

      <div className="bg-light-orange/30 h-screen overflow-scroll">
        <div className="flex relative">
          <div className="p-8 max-w-7xl mx-auto">
            <div
              className={`mb-6 flex flex-wrap items-end gap-4 ${panelClass}`}
            >
              {[
                {
                  label: "Tank",
                  options: [
                    "Tank 1",
                    "Tank 2",
                    "Tank 3",
                    "Tank 4",
                    "Tank 5",
                    "Tank 6",
                    "Tank 7",
                    "Tank 8",
                    "Tank 9",
                  ],
                },
                {
                  label: "Parameters",
                  options: [
                    "pH",
                    "Salinity",
                    "Temperature",
                    "ORP",
                    "Alkalinity",
                    "Calcium",
                    "Nitrate",
                    "Nitrite",
                    "Phosphate",
                  ],
                },
                {
                  label: "Graph Type",
                  options: ["Line", "Bar", "Sankey", "Other"],
                },
              ].map((item) => {
                let value, setValue;

                switch (item.label) {
                  case "Tank":
                    value = selectedTank;
                    setValue = setSelectedTank;
                    break;
                  case "Parameters":
                    value = selectedParameter;
                    setValue = setSelectedParameter;
                    break;
                  case "Graph Type":
                    value = selectedGraphType;
                    setValue = setSelectedGraphType;
                    break;
                  default:
                    value = "";
                    setValue = () => {};
                }

                return (
                  <div key={item.label} className="min-w-[160px]">
                    <label className="block text-dark-orange font-bold mb-1 text-sm">
                      {item.label}
                    </label>
                    <select
                      value={value}
                      onChange={(e) => setValue(e.target.value)}
                      className="w-left bg-white px-2 py-2 text-sm font-medium text-dark-orange focus:outline-none focus:ring-2 focus:ring-light-orange shadow-inner rounded-lg"
                    >
                      <option value="">Select…</option>
                      {item.options.map((opt) => (
                        <option key={opt} value={opt}>
                          {opt}
                        </option>
                      ))}
                    </select>
                  </div>
                );
              })}
              <div className="min-w-[160px]">
                <label className="block text-dark-orange font-bold mb-1 text-sm">
                  Date Range
                </label>
                <Flatpickr
                  className="w-full bg-white px-2 py-2 text-sm font-medium text-dark-orange focus:outline-none focus:ring-2 focus:ring-light-orange shadow-inner rounded-lg"
                  data-enable-time
                  options={{ enableSeconds: true, mode: "range" }}
                  value={dateRange}
                  onChange={(date) => setDateRange(date)}
                />
              </div>

              <button
                type="button"
                onClick={() => setIsNotepadVisible((prev) => !prev)}
                className="ml-auto flex h-12 w-12 items-center justify-center rounded-full bg-dark-orange text-2xl font-bold text-white shadow-lg transition-all hover:scale-110 hover:shadow-xl hover:bg-orange"
                aria-label={isNotepadVisible ? "Hide notepad" : "Open notepad"}
              >
                {isNotepadVisible ? "−" : "+"}
              </button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-[280px_1fr] gap-6">
              <TankStatsPanel panelClass={panelClass}></TankStatsPanel>

              <div className={`${panelClass}`}>
                <HistoricDataTankBox
                  tankNumber={1}
                  variableType={selectedParameter}
                  dateRange={dateRange}
                />

                <div className="mt-6 text-sm text-dark-orange/70 text-center italic">
                  Tank 1 houses numerous types of corals, including mushroom
                  corals, button polyps, leather corals, and bubble corals.
                </div>
              </div>
            </div>

            {isNotepadVisible && (
              <PredefinedObservationNotepad
                dateRange={dateRange}
                tankNumber={selectedTank}
              ></PredefinedObservationNotepad>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
