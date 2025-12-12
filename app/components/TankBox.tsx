import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import "../globals.css";
import { useEffect, useState } from "react";

export default function TankBox({ tankNumber }) {
  const [chartData, setChartData] = useState([]);

  useEffect(() => {
    async function fetchData() {
      try {
        const response = await fetch(`/api/getMostRecentData?type=pH`);
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
  }, []); // pass the [] otherwise it will infinitely render; https://stackoverflow.com/questions/53715465/can-i-set-state-inside-a-useeffect-hook

  return (
    <a className="tankbox box-content p-8 rounded-xl" href="/info">
      <h1>Tank {tankNumber}</h1>
      <ResponsiveContainer>
        <AreaChart data={chartData}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis
            dataKey="datetime"
            tickFormatter={(tick) =>
              tick.split("/")[0] + "/" + tick.split("/")[1]
            }
            stroke="#000000"
          />
          <YAxis
            domain={["dataMin - 1", "dataMax + 1"]}
            tickFormatter={(tick) => tick.toString().split(".")[0]}
            stroke="#000000"
          />
          <Tooltip />
          <Area
            type="monotone"
            dataKey="value"
            stroke="#feb934"
            dot={false}
            fill="#feb93499"
            strokeWidth={2.5}
          />
        </AreaChart>
      </ResponsiveContainer>
    </a>
  );
}
