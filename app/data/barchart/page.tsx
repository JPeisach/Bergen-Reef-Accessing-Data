"use client";
import { useUser } from "@auth0/nextjs-auth0/client";
import "../../globals.css";
import "../../css/graphComponents.css";
import BarChartGraph from "../../components/graphComponents/BarChartGraph";
import NavigationBar from "../../components/NavigationBar";
import { useEffect, useState } from "react";
import DateBoundElement from "app/components/DateBoundElement";
import { Menu, MenuButton, MenuItem, MenuItems } from "@headlessui/react";
import { ChevronDownIcon } from "@heroicons/react/24/outline";

export default function Page() {
  const { user } = useUser();
  const [windowHeight, setWindowHeight] = useState(0);

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
    <div className="bg-base-200 min-h-screen">
      <NavigationBar defaultIndex={9} username={user ? user.name : "Guest"} />
      <div className="grid grid-cols-4 gap-4 p-4 min-h-screen">
        <div className="col-span-3 h-full ml-8 pr-8 pt-3 pb-3 rounded-lg justify-center items-center">
          <div className="pt-8 bg-base-100 w-full h-full relative border border-base-300 drop-shadow-md rounded-lg">
            <BarChartGraph
              tankNames={tanks}
              variableTypes={variables}
              dateRange={[startDate, endDate]}
            />
          </div>
        </div>

        {/* Right settings column: single panel (use graph-settings-panel class) */}
        <div className="col-span-1 h-full ml-8">
          <div className="graph-settings-panel h-full">
            <h1 className="text-xl bg-accent text-accent-content drop-shadow-xl text-center font-semibold rounded-lg p-4">
              Bar Chart
            </h1>

            <div className="flex flex-col items-center">
              <div className="relative inline-block m-3 dropdown text-center">
                <button
                  tabIndex={0}
                  className="btn btn-primary w-fit px-4"
                  type="button"
                >
                  Select up to Two Variables
                </button>
                <ul
                  tabIndex={-1}
                  className="dropdown-content menu bg-base-100 rounded-box z-10 p-2 shadow-sm w-auto min-w-max"
                >
                  {variableNames.map((item) => (
                    <li
                      key={item}
                      className={`label flex-row cursor-pointer justify-start ${
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
                      <span className="ml-2">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="relative inline-block m-3 dropdown text-center">
                <button
                  tabIndex={0}
                  className="btn btn-primary w-fit px-4"
                  type="button"
                >
                  Select Tanks
                </button>
                <ul
                  tabIndex={-1}
                  className="dropdown-content menu bg-base-100 rounded-box z-10 p-2 shadow-sm w-auto min-w-max"
                >
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
                      <span className="ml-2">{item}</span>
                    </label>
                  ))}
                </ul>
              </div>

              <div className="date-constraints-box w-full">
                <div className="bg-accent text-accent-content font-semibold text-center p-2 m-4 mb-2 rounded-xl self-center mx-auto w-fit">
                  Date Constraints
                </div>
                <div
                  className={`flex items-center ${true ? "flex-col" : "space-x-4"} justify-center rounded-lg pt-2 m-3 mt-1 text-lg text-base-content/80`}
                >
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
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
