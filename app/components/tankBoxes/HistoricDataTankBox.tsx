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
import { fetchSingularDataTypeInDateRange } from "app/services/dataService";

export default function HistoricDataTankBox({
  tankNumber,
  variableType,
  dateRange,
}) {
  const [chartData, setChartData] = useState([]);

  useEffect(() => {
    const interval = setInterval(() => {
      fetchSingularDataTypeInDateRange(
        dateRange[0],
        dateRange[1],
        variableType,
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

        console.log("Filtered data:", filteredData);
        const reversedData = filteredData.reverse();
        setChartData(reversedData);
      });
    }, 300000);
    return () => clearInterval(interval);
  }, [dateRange, variableType]);

  return (
    <a
      className="block rounded-2xl bg-white/90 p-6 shadow-xl border border-light-orange/20 cursor-pointer"
      href="/info"
    >
      <h2 className="text-xl font-bold text-dark-orange mb-4 text-center">
        Tank {tankNumber}
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
              tickFormatter={(tick) => tick.toString().split(".")[0]}
              stroke="#757575"
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
    </a>
  );
}
