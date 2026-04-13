import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import "../../globals.css";
import { useEffect, useState } from "react";
import { fetchSingularDataTypeInDateRange } from "app/services/dataService";

// start of AI code
type DataPoint = {
  value: number;
  datetime: string;
  name: string;
};

function averageByDay(filteredData: DataPoint[]): DataPoint[] {
  const grouped: Record<
    string,
    { total: number; count: number; name: string }
  > = {};

  for (const item of filteredData) {
    const date = new Date(item.datetime);
    const dayKey = date.toISOString().split("T")[0]; // YYYY-MM-DD

    if (!grouped[dayKey]) {
      grouped[dayKey] = { total: 0, count: 0, name: item.name };
    }

    grouped[dayKey].total += Number(item.value);
    grouped[dayKey].count += 1;
  }

  return Object.entries(grouped)
    .map(([date, stats]) => ({
      datetime: date,
      name: stats.name,
      value: stats.total / stats.count,
    }))
    .sort(
      (a, b) => new Date(a.datetime).getTime() - new Date(b.datetime).getTime(),
    );
}

// end of AI code

export default function BarChartGraph({ tankNames, variableType, dateRange }) {
  const [chartData, setChartData] = useState<DataPoint[]>([]);

  useEffect(() => {
    // Ensure we have our data
    if (!variableType || dateRange.length < 2) {
      return;
    }

    // FIXME: stupid fix to ensure that we reload quickly for when we are waiting for valid params, but once we have data going through we aren't spamming the API
    // Honestly, we should figure out how to handle being given invalid or incomplete params and where we want to handle it.
    const delay = 1000;

    const interval = setInterval(() => {
      for (const tankName of tankNames) {
        fetchSingularDataTypeInDateRange(
          dateRange[0],
          dateRange[1],
          variableType,
          tankName,
        ).then((result) => {
          const filteredData = result.map((item) => {
            const date = new Date(item.datetime);

            return {
              name: variableType,
              value: item.value,
              datetime: date.toLocaleString(),
            };
          });

          // start of AI code
          const dailyAverageData = averageByDay(filteredData);

          // We need to know which tank is which
          // @ts-expect-error 2345
          setChartData((prev) => ({
            ...prev,
            [tankName]: dailyAverageData,
          }));
          // end of AI code
        });
      }
    }, delay);
    return () => clearInterval(interval);
  }, [dateRange, variableType]);

  return (
    // TODO: Show something if dateRange[1] DNE and needs to be entered.
    <a
      className="block rounded-2xl bg-base-100/90 p-6 shadow-xl border border-base-300 cursor-pointer"
      href="/info"
    >
      <>
        <h2 className="text-xl font-bold text-primary mb-4 text-center">
          Tank
        </h2>
        <div className="h-48">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData}>
              <CartesianGrid />
              <XAxis
                allowDuplicatedCategory={false}
                // start AI code
                dataKey="datetime"
                tickFormatter={(tick) => {
                  const date = new Date(tick);
                  return `${date.getMonth() + 1}/${date.getDate()}`;
                }}
                stroke="#757575"
                fontSize={12}
                // end AI code
              />
              <YAxis
                domain={["dataMin", "dataMax"]}
                tickFormatter={(tick) => tick.toFixed(2).toString()}
                scale={"sequential"}
                stroke="#757575"
                fontSize={12}
              />
              <Tooltip />
              {tankNames.map((tankName) => {
                return (
                  <Bar
                    key={tankName}
                    // @ts-expect-error 2769
                    data={chartData[tankName]}
                    dataKey="value"
                    fill="var(--color-primary)"
                    stroke="var(--color-primary)"
                  />
                );
              })}
            </BarChart>
          </ResponsiveContainer>
        </div>
      </>
    </a>
  );
}
