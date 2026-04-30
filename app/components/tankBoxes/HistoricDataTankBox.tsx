import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import "../../globals.css";
import { useEffect, useState } from "react";
import { fetchSingularDataTypeInDateRange } from "app/services/dataService";
import DownloadCSVButton from "../buttons/DownloadCSVButton";

export default function HistoricDataTankBox({
  tankName,
  variableType,
  dateRange,
}) {
  const [chartData, setChartData] = useState([]);

  useEffect(() => {
    // Ensure we have our data
    if (!variableType || dateRange.length < 2) {
      return;
    }

    // FIXME: stupid fix to ensure that we reload quickly for when we are waiting for valid params, but once we have data going through we aren't spamming the API
    // Honestly, we should figure out how to handle being given invalid or incomplete params and where we want to handle it.
    let delay = 1000;

    const interval = setInterval(() => {
      fetchSingularDataTypeInDateRange(
        dateRange[0],
        dateRange[1],
        variableType,
        tankName,
      ).then((result) => {
        const filteredData = result.map((item) => {
          const date = new Date(item.datetime);
          // TODO: why do we do this
          date.setHours(date.getHours() - 2);

          return {
            ...item,
            datetime: date.toLocaleString(),
          };
        });

        setChartData(filteredData);
        delay = 30000;
      });
    }, delay);
    return () => clearInterval(interval);
  }, [tankName, dateRange, variableType]);

  return (
    // TODO: Show something if dateRange[1] DNE and needs to be entered.
    <a
      className="block rounded-2xl bg-base-100/90 p-6 shadow-xl border border-base-300 cursor-pointer"
      href="/info"
    >
      <h2 className="text-xl font-bold text-primary mb-4 text-center">
        Tank {tankName}
      </h2>
      {/* stupid height has to be constant otherwise things dont show up */}
      <div className="h-64 w-full">
        {chartData.length != 0 ? (
          <div className="h-[80%]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData} margin={{ left: -10 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                <XAxis
                  dataKey="datetime"
                  tickFormatter={(tick) =>
                    tick.split("/")[0] + "/" + tick.split("/")[1]
                  }
                  stroke="var(--color-base-content)"
                  fontSize={12}
                />
                <YAxis
                  domain={["dataMin - 1", "dataMax + 1"]}
                  tickFormatter={(tick) => tick.toFixed(1).toString()}
                  stroke="var(--color-base-content)"
                  scale="sequential"
                  fontSize={12}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "var(--color-base-100)",
                    border: "1px solid var(--color-base-300)",
                    borderRadius: "8px",
                  }}
                />
                <Area
                  type="monotone"
                  dataKey="value"
                  stroke="var(--color-primary)"
                  dot={false}
                  fill="var(--color-primary)"
                  fillOpacity={0.5}
                  strokeWidth={2.5}
                />
              </AreaChart>
            </ResponsiveContainer>
            <DownloadCSVButton data={chartData}></DownloadCSVButton>
          </div>
        ) : (
          <p className="mt-[20%] text-xl font-bold text-error text-center">
            No data.
          </p>
        )}
      </div>
    </a>
  );
}
