"use client";
import { useUser } from "@auth0/nextjs-auth0/client";
import "../../globals.css";
import HeatMap from "../../components/graphComponents/HeatMap";
import NavigationBar from "../../components/NavigationBar";

export default function Page() {
  const { user } = useUser();

  return (
    <div className="bg-base-200">
      <NavigationBar defaultIndex={5} username={user ? user.name : "Guest"} />
      <div className="bg-base-100/30 min-h-scren flex-1 overflow-hidden">
        <HeatMap />
      </div>
    </div>
  );
}
