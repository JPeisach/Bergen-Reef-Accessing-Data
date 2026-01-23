"use client";
import "../globals.css";
import { useState } from "react";
import { useUser } from "@auth0/nextjs-auth0/client";
import NavigationBar from "../components/NavigationBar";
import HistoricDataTankBox from "app/components/tankBoxes/HistoricDataTankBox";
import "flatpickr/dist/themes/confetti.css";
import Flatpickr from "react-flatpickr";

export default function Page() {
  const { user } = useUser();
  const [notes, setNotes] = useState("");

  const [dateRange, setDateRange] = useState([new Date()]);
  const [selectedTank, setSelectedTank] = useState("");
  const [selectedParameter, setSelectedParameter] = useState("");
  const [selectedGraphType, setSelectedGraphType] = useState("");

  const panelClass = "bg-light-orange/40 p-5 shadow-lg rounded-xl";

  return (
    <div className="min-h-screen bg-light-orange/30">
      <NavigationBar defaultIndex={2} username={user ? user.name : "Guest"} />

      <div className="p-8 max-w-7xl mx-auto">
        <div className={`mb-6 flex flex-wrap items-end gap-4 ${panelClass}`}>
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
          {/* TODO: Theme */}
          <Flatpickr
            data-enable-time
            options={{
              mode: "range",
              closeOnSelect: false,
            }}
            value={dateRange}
            onClose={(date) => setDateRange(date)} // TODO: Consider adding a close or reset button? See which functionality works the best
          ></Flatpickr>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-[280px_1fr] gap-6">
          <div className={panelClass}>
            <h2 className="text-lg font-bold text-dark-orange mb-3">Tank 1</h2>
            <ul className="space-y-1.5 text-sm text-dark-orange/80 font-medium">
              <li>pH: 8.08</li>
              <li>Salinity: 27.7 ppt</li>
              <li>Temperature: 76.9°F</li>
              <li>ORP: 308 mV</li>
              <li>Alkalinity: 9.4 dKH</li>
              <li>Calcium: 306 ppm</li>
              <li>Nitrate: 0 ppm</li>
              <li>Nitrite: 0 ppm</li>
              <li>Phosphate: 6.5 ppb</li>
            </ul>

            <div className="mt-4 bg-white p-3 shadow-inner rounded-lg">
              <h3 className="font-bold text-dark-orange text-sm mb-1">
                Pinned Notes
              </h3>
              <h4 className="font-bold text-dark-orange text-xs mb-1">
                🙍 Mr. Ramirez
              </h4>
              <p className="text-xs text-dark-orange/70 leading-relaxed">
                Tank 1 has been struggling lately. We suspect that the addition
                of the new supplement, "GroCoral", has negatively impacted the
                tank's vitality. Increased algae bloom observed.
              </p>
              <p className="font-bold text-dark-orange text-xs mt-2 underline">
                <a href="/notes">Open in Observations</a>
              </p>
            </div>
          </div>

          <div className={`${panelClass}`}>
            <div className="mb-3 bg-white px-4 py-2 text-sm font-semibold text-dark-orange shadow-inner flex justify-between rounded-lg">
              <span className="text-dark-orange/60">
                {selectedTank || "Tank"}
              </span>
              <span className="text-dark-orange/60">
                {selectedParameter || "Parameter"}
              </span>
              <span className="text-dark-orange/60">
                {dateRange[0].toLocaleDateString() || "Time Range"}
              </span>
              <span className="text-dark-orange/60">
                {selectedGraphType || "Graph Type"}
              </span>
            </div>

            <div className="h-[500px] bg-white shadow-inner p-5 rounded-lg">
              <HistoricDataTankBox
                tankNumber={1}
                variableType={selectedParameter}
                dateRange={dateRange}
              />
            </div>

            <div className="mt-6 text-sm text-dark-orange/70 text-center italic">
              Tank 1 houses numerous types of corals, including mushroom corals,
              button polyps, leather corals, and bubble corals.
            </div>
          </div>
        </div>
      </div>

      <div className={`p-8 max-w-7xl mx-auto ${panelClass}`}>
        <div className="p-8 max-w-7xl mx-auto">
          <label className="block mb-2 text-sm font-bold text-dark-orange">
            Open Notes & Observations
          </label>
          <textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="Write observations here…"
            className="w-full h-32 resize-none bg-white p-4 text-sm font-medium text-dark-orange focus:outline-none focus:ring-2 focus:ring-light-orange shadow-inner rounded-lg"
          />
        </div>
      </div>

      <div className="mt-1 flex justify-end">
        <button className="bg-orange px-8 py-3 text-sm font-bold text-white rounded-lg transition-all hover:shadow-lg hover:bg-orange">
          Save
        </button>
      </div>
    </div>
  );
}
