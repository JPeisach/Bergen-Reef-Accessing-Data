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

export default function RecentDataTankBox({ tankNumber, variableType }) {
  const [chartData, setChartData] = useState([]);

  useEffect(() => {
    async function fetchData() {
      try {
        const response = await fetch(
          `/api/getMostRecentData?type=${variableType}`,
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
    <div className="block rounded-2xl bg-white/90 p-6 shadow-xl border border-light-orange/20 cursor-pointer">
      <h2 className="text-xl font-bold text-dark-orange mb-4 text-center">
        Tank {tankNumber}
      </h2>
      <div className="h-48">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={chartData} margin={{ left: -10 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
            <XAxis
              dataKey="datetime"
              tickFormatter={(tick) =>
                tick.split("/")[0] + "/" + tick.split("/")[1]
              }
              stroke="#757575"
              fontSize={12}
            />
            <YAxis
              domain={["dataMin - 1", "dataMax + 1"]}
              tickFormatter={(tick) => tick.toFixed(1).toString()}
              stroke="#757575"
              scale="sequential"
              fontSize={12}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: "white",
                border: "1px solid #FCD98C",
                borderRadius: "8px",
              }}
            />
            <Area
              type="monotone"
              dataKey="value"
              stroke="#FEB934"
              dot={false}
              fill="#FEB93499"
              strokeWidth={2.5}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
      <DownloadCSVButton data={chartData}></DownloadCSVButton>
    </div>
  );
}
