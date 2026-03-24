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
  }, [dateRange, variableType]);

  return (
    // TODO: Show something if dateRange[1] DNE and needs to be entered.
    // TODO: Hyperlink clicks to indiv tank tab with default info filled out
    <a
      className="card bg-base-300 card-border rounded-2xl p-6 border-base-100 shadow-xl"
      href="/info"
    >
      <h2 className="text-base-content text-xl font-bold mb-4 text-center">
        Tank {tankName}
      </h2>
      <div className="h-48">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={chartData}>
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
              scale="sequential"
              stroke="#757575"
              fontSize={12}
            />
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
      </div>
    </a>
  );
}
