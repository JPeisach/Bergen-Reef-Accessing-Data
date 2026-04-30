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
import DownloadCSVButton from "../buttons/DownloadCSVButton";
import { useEffect, useState } from "react";

export default function RecentDataTankBox({ tankName, variableType }) {
  const [chartData, setChartData] = useState([]);

  const isDataOld = () => {
    if (chartData.length === 0) return false;
    const lastDatetime = new Date(chartData[chartData.length - 1].datetime);
    return new Date().getTime() - lastDatetime.getTime() > 604800 * 1000;
  };

  useEffect(() => {
    async function fetchData() {
      try {
        const response = await fetch(
          `/api/getMostRecentData?type=${variableType}&tankName=${tankName}`,
        );
        const result = await response.json();

        console.log("Fetched data:", result);

        if (!Array.isArray(result)) {
          console.error("Unexpected API response:", result);
          return;
        }

        // Filter and format data
        const filteredData = result.map((item) => {
          const date = new Date(item.datetime);
          date.setHours(date.getHours() - 2);

          return {
            ...item,
            datetime: date.toLocaleString(),
          };
        });

        console.log("Filtered data:", filteredData);
        const reversedData = filteredData.reverse();
        setChartData(reversedData);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    }

    fetchData();
    const interval = setInterval(fetchData, 300000);
    return () => clearInterval(interval);
  }, [variableType]);

  return (
    <div className="block rounded-2xl bg-base-100/90 p-6 shadow-xl border border-base-300 cursor-pointer">
      <h2 className="text-xl font-bold text-primary text-center">
        Tank {tankName}
      </h2>
      {chartData.length != 0 ? (
        <div className="h-[75%] w-full">
          {isDataOld() ? (
            <p className="text-xs font-bold text-warning text-center w-full">
              Warning: Recent data is older than one week. This tank may be
              offline.
            </p>
          ) : null}
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
        <p className="mt-[25%] text-xl font-bold text-error text-center">
          This tank has no data. It may be offline.
        </p>
      )}
    </div>
  );
}
