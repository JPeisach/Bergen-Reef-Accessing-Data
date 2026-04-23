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

const tankNameOnly = (tank: string) => tank.substring("Tank ".length);

export default function Page() {
  const { user } = useUser();

  const defaultStartDate = new Date();
  defaultStartDate.setDate(defaultStartDate.getDate() - 10); // hacky fix to show *something*

  const [dateRange, setDateRange] = useState([defaultStartDate, new Date()]);
  const [selectedTank, setSelectedTank] = useState("Tank CoralLab60_1");
  const [selectedParameter, setSelectedParameter] = useState("pH");
  const [selectedGraphType, setSelectedGraphType] = useState("Line");
  const [isNotepadVisible, setIsNotepadVisible] = useState(false);

  const panelClass =
    "bg-base-100 border border-base-300 p-5 shadow-lg rounded-xl";

  return (
    <div>
      <NavigationBar defaultIndex={2} username={user ? user.name : "Guest"} />

      <div className="bg-base-200 h-screen overflow-scroll">
        <div className="flex relative">
          <div className="p-8 max-w-7xl mx-auto">
            <div
              className={`mb-6 flex flex-wrap items-end gap-4 ${panelClass}`}
            >
              {[
                {
                  label: "Tank",
                  options: [
                    "Tank CoralLab60_1",
                    "Tank CoralLab60_2",
                    "Tank CoralLab60_3",
                    "Tank CoralLab60_4",
                    "Tank CoralLab60_5",
                    "Tank CoralLab60_6",
                    "Tank MakerReef",
                    "Tank ESCReef",
                    "Tank CoralLab380",
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
                    "LLS",
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
                    <label className="block text-primary font-bold mb-1 text-sm">
                      {item.label}
                    </label>
                    <select
                      value={value}
                      onChange={(e) => setValue(e.target.value)}
                      className="w-left bg-base-100 px-2 py-2 text-sm font-medium text-base-content focus:outline-none focus:ring-2 focus:ring-primary shadow-inner rounded-lg border border-base-300"
                    >
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
                <label className="block text-primary font-bold mb-1 text-sm">
                  Date Range
                </label>
                {/* FIXME: THEME */}
                <Flatpickr
                  className="w-full bg-base-100 px-2 py-2 text-sm font-medium text-base-content focus:outline-none focus:ring-2 focus:ring-primary shadow-inner rounded-lg border border-base-300"
                  data-enable-time
                  options={{ enableSeconds: true, mode: "range" }}
                  value={dateRange}
                  onChange={(date) => setDateRange(date)}
                />
              </div>

              <button
                type="button"
                onClick={() => setIsNotepadVisible((prev) => !prev)}
                className="ml-auto flex h-12 w-12 items-center justify-center rounded-full bg-primary text-2xl font-bold text-primary-content shadow-lg transition-all hover:scale-110 hover:shadow-xl hover:bg-primary/90"
                aria-label={isNotepadVisible ? "Hide notepad" : "Open notepad"}
              >
                {isNotepadVisible ? "−" : "+"}
              </button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-[280px_1fr] gap-6">
              <TankStatsPanel
                tankName={tankNameOnly(selectedTank)}
                panelClass={panelClass}
              />

              <div className={`${panelClass}`}>
                <HistoricDataTankBox
                  tankName={tankNameOnly(selectedTank)}
                  variableType={selectedParameter}
                  dateRange={dateRange}
                />

                <div className="mt-6 text-sm text-primary/70 text-center italic">
                  Tank 1 houses numerous types of corals, including mushroom
                  corals, button polyps, leather corals, and bubble corals.
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
      </div>
    </div>
  );
}
