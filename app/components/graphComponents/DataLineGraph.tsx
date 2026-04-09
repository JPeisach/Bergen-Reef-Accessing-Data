"use client";

import { useEffect, useState, useRef } from "react";
import * as d3 from "d3";
import "../../globals.css";
import "../../css/graphComponents.css";
import DateBoundElement from "../DateBoundElement";
import ZoomSlider from "../ZoomSlider";
import StepSlider from "../StepSlider";
import { Menu, MenuButton, MenuItem, MenuItems } from "@headlessui/react";
import { ChevronDownIcon } from "@heroicons/react/20/solid";
import {
  fetchDataInDateRange,
  fetchSingularDataTypeInDateRange,
} from "app/services/dataService";
import {
  Area,
  AreaChart,
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

interface DataPoint {
  id: number;
  datetime: string;
  name: string;
  unit: string;
  value: number;
}

const units = {
  Salinity: "ppt",
  ORP: "mV",
  Temperature: "°F",
  Alkalinity: "dKH",
  Calcium: "ppm",
};

export default function DataLineGraph() {
  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(new Date());
  const [data, setData] = useState([]);
  const [selectedNames, setSelectedNames] = useState<string[]>([]);
  const [zoom, setZoom] = useState(50);
  const [step, setStep] = useState(50);
  const [shouldFetch, setShouldFetch] = useState(false);
  const svgRef = useRef<SVGSVGElement>(null);
  const [isSmallScreen, setIsSmallScreen] = useState(false);
  const [useInterpolation, setUseInterpolation] = useState(true);
  const [windowHeight, setWindowHeight] = useState(0);
  const [lastFetchedRange, setLastFetchedRange] = useState<{
    start: Date;
    end: Date;
  } | null>(null);

  const availableNames = [
    "Salinity",
    "ORP",
    "Temperature",
    "Alkalinity",
    "Calcium",
    "pH",
  ];

  const colorScale = d3.scaleOrdinal(d3.schemeCategory10);
  useEffect(() => {
    if (!lastFetchedRange) {
      setShouldFetch(true);
      setLastFetchedRange({ start: startDate, end: endDate });
      return;
    }

    const rangeExtended =
      startDate < lastFetchedRange.start || endDate > lastFetchedRange.end;

    if (rangeExtended) {
      setShouldFetch(true);
      setLastFetchedRange({ start: startDate, end: endDate });
    }
  }, [startDate, endDate]);

  useEffect(() => {
    if (!shouldFetch) return;

    const fetchAll = async () => {
      setData([]);
      const results = await Promise.all(
        // stupid
        selectedNames.map((name) =>
          fetchSingularDataTypeInDateRange(startDate, endDate, name),
        ),
      );

      setData(results);
      setShouldFetch(false);
    };

    fetchAll();
  }, [shouldFetch, startDate, endDate, selectedNames]);

  useEffect(() => {
    const today = new Date();
    const lastWeek = new Date();
    lastWeek.setDate(today.getDate() - 7);
    setStartDate(lastWeek);
    setEndDate(today);
    setSelectedNames(["Salinity"]);
    setShouldFetch(true);
  }, []);

  // Add window height calculation
  useEffect(() => {
    const updateHeight = () => {
      setWindowHeight(window.innerHeight);
    };
    updateHeight();
    window.addEventListener("resize", updateHeight);
    return () => window.removeEventListener("resize", updateHeight);
  }, []);

  const availableHeight = windowHeight - 120;

  const handleNameSelect = (index: number, name: string) => {
    setData([]);
    const newSelectedNames = [...selectedNames];
    newSelectedNames[index] = name;
    setSelectedNames(newSelectedNames);
    setShouldFetch(true);
  };

  const addPlot = () => {
    setData([]);
    if (selectedNames.length < 5) {
      setSelectedNames([...selectedNames, ""]);
      setShouldFetch(true);
    }
  };

  useEffect(() => {
    setZoom(100); // Set default zoom to 100%
    setShouldFetch(true);
  }, []);

  const handleStartDateChange = (date: Date) => {
    setStartDate(date);
    setShouldFetch(true);
  };

  const handleEndDateChange = (date: Date) => {
    setEndDate(date);
    setShouldFetch(true);
  };

  const allValues = data.flat().map((p) => p.value);
  const min = Math.min(...allValues);
  const max = Math.max(...allValues);
  return (
    <div className="grid grid-cols-4 gap-4 p-4 h-full">
      <div
        className="col-span-3 bg-white ml-8 pr-8 pt-3 pb-3 rounded-lg justify-center items-center"
        style={{ height: `${availableHeight}px` }}
      >
        <ResponsiveContainer width="100%" height="100%">
          <LineChart>
            <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
            <XAxis
              // domain={["dataMin - 1", "dataMax + 1"]}
              dataKey="datetime"
              tickFormatter={(tick) => tick.split("/")[0]}
              stroke="#757575"
              fontSize={12}
              allowDuplicatedCategory={false}
            />
            {/*<YAxis
              domain={[min - 1, max + 1]}
              tickFormatter={(tick) => tick.toFixed(1).toString()}
              scale="linear"
              stroke="#757575"
              fontSize={12}
            />*/}
            <YAxis />
            <YAxis />
            <Tooltip
              contentStyle={{
                backgroundColor: "var(--color-base-content)",
                border: "1px solid var(--color-base-content)",
                borderRadius: "8px",
              }}
              itemStyle={{
                color: "var(--base-text-content)",
              }}
            />
            {data.map((line) => {
              return (
                <Line
                  type="monotone"
                  key={line[0]?.name}
                  data={line}
                  dataKey="value"
                  name={line[0] ? line[0].name : ""}
                  stroke="var(--color-primary)"
                  dot={false}
                  fill="var(--color-primary)"
                  fillOpacity={0.5}
                  strokeWidth={2.5}
                />
              );
            })}
          </LineChart>
        </ResponsiveContainer>
      </div>

      <div
        className="graph-settings-panel"
        style={{ maxHeight: `${availableHeight}px` }}
      >
        <h1 className="text-xl bg-teal drop-shadow-xl text-white text-center font-semibold rounded-lg p-4">
          Line Plot
        </h1>
        <div className="flex flex-col">
          {selectedNames.map((name, index) => (
            <Menu
              as="div"
              key={index}
              className="relative inline-block text-left m-3"
            >
              <MenuButton
                className={
                  index === 0
                    ? "outline-medium-blue bg-light-blue inline-flex w-full justify-center outline-solid outline-1 rounded-xl font-semibold px-3 py-2"
                    : "outline-medium-red-orange bg-light-red-orange inline-flex w-full justify-center outline-solid outline-1 rounded-xl font-semibold px-3 py-2"
                }
              >
                <span style={{ color: colorScale(index) }}>
                  {name || "Select Name"}
                </span>
                <ChevronDownIcon
                  className="-mr-1 size-6"
                  style={{ color: colorScale(index) }}
                />
              </MenuButton>
              <MenuItems
                className={
                  index === 0
                    ? "absolute left-1/2 -translate-x-1/2 bg-light-blue w-full z-50 right-1/2 transform mt-2 rounded-xl shadow-lg ring-1 ring-black/5"
                    : "absolute left-1/2 -translate-x-1/2 bg-light-red-orange w-full z-50 right-1/2 transform mt-2 rounded-xl shadow-lg ring-1 ring-black/5"
                }
              >
                {availableNames
                  .filter((n) => !selectedNames.includes(n))
                  .map((n) => (
                    <MenuItem key={n}>
                      <button
                        onClick={() => handleNameSelect(index, n)}
                        className={
                          index === 0
                            ? "text-blue block w-full px-4 py-2 text-md font-semibold hover:bg-medium-orange"
                            : "text-red-orange block w-full px-4 py-2 text-md font-semibold hover:bg-medium-orange"
                        }
                      >
                        {n}
                      </button>
                    </MenuItem>
                  ))}
              </MenuItems>
            </Menu>
          ))}
          {selectedNames.length < 2 && ( // keep to 2 plots for now
            <button
              onClick={addPlot}
              className="bg-primary outline-solid outline-1 outline-dark-orange drop-shadow-xl text-white font-medium px-4 py-2 m-3 rounded-xl hover:bg-primary"
            >
              Add Another Plot
            </button>
          )}
          {selectedNames.length > 1 && (
            <button
              onClick={() => setSelectedNames(selectedNames.slice(0, -1))}
              className="bg-medium-teal outline-solid outline-1 outline-dark-teal drop-shadow-xl text-white font-medium px-4 py-2 m-3 rounded-xl hover:bg-dark-teal"
            >
              Remove Last Plot
            </button>
          )}
        </div>

        <div className="date-constraints-box">
          <div className="bg-teal text-white font-semibold text-center p-2 m-4 mb-2 rounded-xl self-center mx-auto w-fit">
            Date Constraints
          </div>
          <div
            className={`flex items-center ${
              true ? "flex-col" : "space-x-4" // Can change this to make it horizontal using isSmallScreen
            } justify-center rounded-lg pt-2 m-3 mt-1 text-lg text-neutral-700`}
          >
            <DateBoundElement
              value={startDate}
              onChange={handleStartDateChange}
            />

            <div className="bg-teal p-1 pl-2 pr-2 mt-3 mb-3 rounded-lg">
              <span className="text-white font-semibold text-center">to</span>
            </div>

            <DateBoundElement value={endDate} onChange={handleEndDateChange} />
          </div>

          <div className="flex items-center justify-center mt-4 mx-3">
            <label className="flex items-center bg-teal rounded-lg m-1 p-3 space-x-2 cursor-pointer">
              <input
                type="checkbox"
                checked={!useInterpolation}
                onChange={(e) => {
                  setUseInterpolation(!e.target.checked);
                  setShouldFetch(true);
                }}
                className="form-checkbox h-5 w-5 text-teal rounded-sm border-gray-300 focus:ring-teal"
              />
              <span className="text-white font-medium">
                Display Discrete Points
              </span>
            </label>
          </div>
        </div>

        <div
          className="flex flex-col items-center justify-center mt-auto"
          style={{ visibility: "hidden" }}
        >
          <ZoomSlider
            value={zoom}
            onChange={(value) => {
              setZoom(value);
              setShouldFetch(true);
            }}
          />
          <StepSlider
            value={step}
            onChange={(value) => {
              setStep(value);
              setShouldFetch(true);
            }}
          />
        </div>
      </div>
    </div>
  );
}
