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
import BarChartGraph from "app/components/graphComponents/BarChartGraph";

const tankNameOnly = (tank: string) => tank.substring("Tank ".length);

export default function Page() {
  const { user } = useUser();

  const defaultStartDate = new Date();
  defaultStartDate.setDate(defaultStartDate.getDate() - 10); // hacky fix to show *something*

  const [dateRange, setDateRange] = useState(
    localStorage.getItem("indivtanks-daterange") ?? [
      defaultStartDate,
      new Date(),
    ],
  );
  const [selectedTank, setSelectedTank] = useState(
    localStorage.getItem("indivtanks-tank") ?? "Tank CoralLab60_1",
  );
  const [selectedParameter, setSelectedParameter] = useState(
    localStorage.getItem("indivtanks-parameter") ?? "pH",
  );
  const [selectedGraphType, setSelectedGraphType] = useState(
    localStorage.getItem("indivtanks-graphtype") ?? "Line",
  );
  const [isNotepadVisible, setIsNotepadVisible] = useState(false);

  // AI CODE:
  // New: refresh key for TankStatsPanel. Increment to force a remount / refetch
  const [statsRefreshKey, setStatsRefreshKey] = useState(0);

  const panelClass =
    "bg-base-100 border border-base-300 p-5 shadow-lg rounded-xl";

  // TODO: This is the fault of bad state and component management. StackOverflow forms suggest this thing about keys, so I let AI apply it. -Josh

  // AI CODE:
  // Replaces the previous hacky toggle; called by the notepad on successful submit
  const handleObservationSubmit = () => {
    setStatsRefreshKey((k) => k + 1);
  };

  const onSetDateRange = (date) => {
    setDateRange(date);
    localStorage.setItem("indivtanks-daterange", JSON.stringify(date));
  };

  const onSetSelectedTank = (tank) => {
    setSelectedTank(tank);
    localStorage.setItem("indivtanks-tank", tank);
  };

  const onSetSelectedParameter = (parameter) => {
    setSelectedParameter(parameter);
    localStorage.setItem("indivtanks-parameter", parameter);
  };

  const onSetSelectedGraphType = (graphType) => {
    setSelectedGraphType(graphType);
    localStorage.setItem("indivtanks-graphtype", graphType);
  };

  return (
    <div className="bg-base-200">
      <NavigationBar defaultIndex={1} username={user ? user.name : "Guest"} />

      <div className="h-screen overflow-scroll">
        <div className="inline relative">
          <div className="p-8 mx-auto">
            <div className={`mb-6 flex flex-wrap items-end ${panelClass}`}>
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
                    "LLS",
                  ],
                },
                {
                  label: "Graph Type",
                  options: ["Line", "Bar"],
                },
              ].map((item) => {
                let value, setValue;

                switch (item.label) {
                  case "Tank":
                    value = selectedTank;
                    setValue = onSetSelectedTank;
                    break;
                  case "Parameters":
                    value = selectedParameter;
                    setValue = onSetSelectedParameter;
                    break;
                  case "Graph Type":
                    value = selectedGraphType;
                    setValue = onSetSelectedGraphType;
                    break;
                  default:
                    value = "";
                    setValue = () => {};
                }

                return (
                  <div key={item.label} className="w-[20dvw]">
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
              <div>
                <label className="block text-primary font-bold mb-1 text-sm">
                  Date Range
                </label>
                {/* FIXME: THEME */}
                <Flatpickr
                  className="w-full bg-base-100 px-2 block py-2 text-sm font-medium text-base-content focus:outline-none focus:ring-2 focus:ring-primary shadow-inner rounded-lg border border-base-300"
                  data-enable-time
                  options={{ enableSeconds: true, mode: "range" }}
                  value={dateRange}
                  onClose={(date) => onSetDateRange(date)}
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
              {/* AI CODE INSERTION: */}
              {/* give TankStatsPanel a key that changes when observations are submitted */}
              <TankStatsPanel
                key={`${tankNameOnly(selectedTank)}-${statsRefreshKey}`}
                tankName={tankNameOnly(selectedTank)}
                panelClass={panelClass}
              />

              <div className={`${panelClass}`}>
                {selectedGraphType === "Line" ? (
                  <HistoricDataTankBox
                    tankName={tankNameOnly(selectedTank)}
                    variableType={selectedParameter}
                    dateRange={dateRange}
                  />
                ) : (
                  <BarChartGraph
                    tankNames={[tankNameOnly(selectedTank)]}
                    variableTypes={[selectedParameter]}
                    dateRange={dateRange}
                  />
                )}

                {isNotepadVisible && (
                  <PredefinedObservationNotepad
                    dateRange={dateRange}
                    tankName={selectedTank}
                    submitCallback={handleObservationSubmit}
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
