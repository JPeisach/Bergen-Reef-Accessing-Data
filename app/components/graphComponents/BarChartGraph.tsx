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

// Input shape from the API
type InputDataPoint = {
  value: number;
  datetime: number | string;
  name: string; // variable type (pH, temp, etc.)
};

// Output row for the chart: { datetime: number, "Tank__Var": number, ... }
type ChartRow = Record<string, any> & { datetime: number };

// Group by day and variable, return numeric averages with numeric datetime (ms)
function averageByDayNumeric(filteredData: InputDataPoint[]) {
  const grouped: Record<
    string,
    Record<string, { total: number; count: number }>
  > = {};

  for (const item of filteredData) {
    const date = new Date(item.datetime);
    // Use the UTC YYYY-MM-DD day key so data for the same day merges consistently
    const dayKey = date.toISOString().split("T")[0];
    const varName = item.name;

    if (!grouped[dayKey]) grouped[dayKey] = {};
    if (!grouped[dayKey][varName])
      grouped[dayKey][varName] = { total: 0, count: 0 };

    grouped[dayKey][varName].total += Number(item.value);
    grouped[dayKey][varName].count += 1;
  }

  return Object.entries(grouped)
    .map(([day, vars]) => {
      const ts = new Date(day).getTime(); // midnight UTC for that day
      const row: Record<string, any> = { datetime: ts };
      for (const vn in vars) {
        row[vn] = (vars[vn].total / vars[vn].count).toFixed(2);
      }
      return row as ChartRow;
    })
    .sort((a, b) => a.datetime - b.datetime);
}

// Utility to create a stable key for a tank-variable pair
const keyFor = (tank: string, variable: string) => `${tank}__${variable}`;

// Currently supports multiple tanks and up to two variable types (for two Y axes)
export default function BarChartGraph({
  tankNames,
  variableTypes,
  dateRange,
}: any) {
  const [chartData, setChartData] = useState<ChartRow[]>([]);

  // Polling interval (ms) - retained from original behavior
  const delay = 1000;

  useEffect(() => {
    if (!variableTypes || !tankNames || !dateRange || dateRange.length < 2)
      return;

    let mounted = true;

    const fetchAll = async () => {
      // Map datetime(ms) -> merged row
      const merged: Record<number, ChartRow> = {};

      await Promise.all(
        tankNames.map(async (tankName: string) => {
          try {
            const result: InputDataPoint[] = await fetchDataInDateRange(
              dateRange[0],
              dateRange[1],
              variableTypes,
              tankName,
            );

            // Average by day for this tank
            const daily = averageByDayNumeric(result);

            // Merge each day row into the merged map
            for (const row of daily) {
              const ts = row.datetime;
              if (!merged[ts]) merged[ts] = { datetime: ts } as ChartRow;

              // For every variable name in this row, create a tank-specific key
              for (const varName of Object.keys(row)) {
                if (varName === "datetime") continue;
                const mergedKey = keyFor(tankName, varName);
                merged[ts][mergedKey] = Number(row[varName]);
              }
            }
          } catch (err) {
            console.error("Error fetching data for", tankName, err);
          }
        }),
      );

      const mergedArray = Object.values(merged).sort(
        (a, b) => a.datetime - b.datetime,
      );
      if (mounted) setChartData(mergedArray);
    };

    // initial fetch + polling
    fetchAll();
    const interval = setInterval(fetchAll, delay);

    return () => {
      mounted = false;
      clearInterval(interval);
    };
  }, [dateRange, variableTypes, tankNames]);

  // Simple color selection (alternate)
  const colorFor = (index: number) =>
    index % 2 === 0 ? "var(--color-primary)" : "var(--color-secondary)";

  return (
    <a
      className="block rounded-2xl bg-base-100/90 p-6 shadow-xl border border-base-300 cursor-pointer"
      href="/info"
    >
      <>
        <h2 className="text-xl font-bold text-primary mb-4 text-center">
          Bar Chart
        </h2>
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData}>
              <Legend />

              <CartesianGrid />
              <XAxis
                dataKey="datetime"
                type="number"
                scale="time"
                tickFormatter={(tick) => {
                  const date = new Date(tick);
                  return `${date.getMonth() + 1}/${date.getDate()}`;
                }}
                stroke="#757575"
                fontSize={12}
                domain={["auto", "auto"]}
                // Contrary to the obvious.. you would think this DISABLES overflow..
                allowDataOverflow={true}
              />

              {/* Y axes: one per variable type (if provided) */}
              {variableTypes?.length >= 1 && (
                <YAxis
                  orientation="left"
                  yAxisId={variableTypes[0]}
                  domain={["auto", "auto"]}
                  tickFormatter={(tick: number) => tick.toFixed(2).toString()}
                  stroke="#757575"
                  fontSize={12}
                  allowDataOverflow={false}
                />
              )}

              {variableTypes?.length >= 2 && (
                <YAxis
                  allowDataOverflow={false}
                  orientation="right"
                  yAxisId={variableTypes[1]}
                  domain={["auto", "auto"]}
                  tickFormatter={(tick: number) => tick.toFixed(2).toString()}
                  stroke="#757575"
                  fontSize={12}
                />
              )}

              <Tooltip
                labelFormatter={(label) => {
                  const d = new Date(label as number);
                  return d.toLocaleString();
                }}
              />

              {/* Render a Bar for each tank-variable pair. Bars read from the BarChart's `data`. */}
              {tankNames.map((tankName: string, tankIndex: number) =>
                variableTypes.map((variableType: string, varIndex: number) => {
                  const barKey = keyFor(tankName, variableType);
                  const color = colorFor(tankIndex + varIndex);

                  return (
                    <Bar
                      key={barKey}
                      yAxisId={variableType}
                      dataKey={barKey}
                      name={`${tankName} ${variableType}`}
                      fill={color}
                      stroke={color}
                    />
                  );
                }),
              )}
            </BarChart>
          </ResponsiveContainer>
        </div>
      </>
    </a>
  );
}
