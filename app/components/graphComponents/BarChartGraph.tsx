import {
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import "../../globals.css";
import { useEffect, useState } from "react";
import { fetchDataInDateRange } from "app/services/dataService";

// start of AI code
type DataPoint = {
  value: number;
  datetime: string;
  name: string; // variable type (pH, temp, etc.)
};

function averageByDay(filteredData: DataPoint[]) {
  const grouped: Record<
    string,
    Record<string, { total: number; count: number }>
  > = {};

  for (const item of filteredData) {
    const date = new Date(item.datetime);
    const dayKey = date.toISOString().split("T")[0];
    const varName = item.name;

    if (!grouped[dayKey]) {
      grouped[dayKey] = {};
    }

    if (!grouped[dayKey][varName]) {
      grouped[dayKey][varName] = { total: 0, count: 0 };
    }

    grouped[dayKey][varName].total += Number(item.value);
    grouped[dayKey][varName].count += 1;
  }

  return Object.entries(grouped)
    .map(([datetime, vars]) => {
      const row: Record<string, any> = { datetime };

      for (const varName in vars) {
        row[varName] = Number(
          vars[varName].total / vars[varName].count,
        ).toFixed(2);
      }

      return row;
    })
    .sort(
      (a, b) => new Date(a.datetime).getTime() - new Date(b.datetime).getTime(),
    );
}

// end of AI code

// Currently supports up to two variable types
export default function BarChartGraph({ tankNames, variableTypes, dateRange }) {
  const [chartData, setChartData] = useState<DataPoint[]>([]);

  // FIXME: stupid fix to ensure that we reload quickly for when we are waiting for valid params, but once we have data going through we aren't spamming the API
  // Honestly, we should figure out how to handle being given invalid or incomplete params and where we want to handle it.
  const delay = 1000;
  useEffect(() => {
    // Ensure we have our data
    if (!variableTypes || dateRange.length < 2) {
      return;
    }

    const interval = setInterval(() => {
      for (const tankName of tankNames) {
        fetchDataInDateRange(
          dateRange[0],
          dateRange[1],
          variableTypes,
          tankName,
        ).then((result) => {
          // start of AI code
          const dailyAverageData = averageByDay(result);

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
  }, [dateRange, variableTypes, tankNames]);

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
              <Legend />
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

              {/* Hardcoded: Max 2 variable types */}
              {variableTypes.length >= 1 && (
                <YAxis
                  orientation="left"
                  yAxisId={variableTypes[0]}
                  domain={["auto", "auto"]}
                  tickFormatter={(tick) => tick.toFixed(2).toString()}
                  stroke="#757575"
                  fontSize={12}
                />
              )}
              {variableTypes.length == 2 && (
                <YAxis
                  orientation="right"
                  yAxisId={variableTypes[1]}
                  domain={["auto", "auto"]}
                  tickFormatter={(tick) => tick.toFixed(2).toString()}
                  stroke="#757575"
                  fontSize={12}
                />
              )}
              <Tooltip />
              {tankNames.map((tankName) => {
                return variableTypes.map((variableType) => {
                  // TODO: It would be great if we could ensure tanks get unique colors
                  return variableTypes[0] === variableType ? (
                    <Bar
                      key={tankName + variableType}
                      yAxisId={variableType}
                      // @ts-expect-error 2769
                      data={chartData[tankName]}
                      dataKey={variableType}
                      name={tankName + " " + variableType}
                      fill="var(--color-primary)"
                      stroke="var(--color-primary)"
                    />
                  ) : (
                    <Bar
                      key={tankName + variableType}
                      yAxisId={variableType}
                      // @ts-expect-error 2769
                      data={chartData[tankName]}
                      dataKey={variableType}
                      name={tankName + " " + variableType}
                      fill="var(--color-secondary)"
                      stroke="var(--color-secondary)"
                    />
                  );
                });
              })}
            </BarChart>
          </ResponsiveContainer>
        </div>
      </>
    </a>
  );
}
