"use client";
import { useUser } from "@auth0/nextjs-auth0/client";
import "../../globals.css";
import BarChartGraph from "../../components/graphComponents/BarChartGraph";
import NavigationBar from "../../components/NavigationBar";

export default function Page() {
  const { user } = useUser();

  const dateA = new Date();
  dateA.setDate(dateA.getDay() - 5);
  return (
    <div>
      <NavigationBar defaultIndex={6} username={user ? user.name : "Guest"} />
      <div className="bg-base-100/30 min-h-screen flex-1 overflow-hidden">
        {/* TODO: Selectable tanks, variables */}
        <BarChartGraph
          tankNames={["CoralLab60_1", "CoralLab60_2"]}
          variableType={"pH"}
          dateRange={[dateA, new Date()]}
        />
      </div>
    </div>
  );
}
