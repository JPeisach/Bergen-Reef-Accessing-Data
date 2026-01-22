"use client";
import { useUser } from "@auth0/nextjs-auth0/client";
import "../../globals.css";
import HeatMap from "../../components/graphComponents/HeatMap";
import NavigationBar from "../../components/NavigationBar";

export default function Page() {
  const { user } = useUser();

  return (
    <div>
      <NavigationBar defaultIndex={6} username={user ? user.name : "Guest"} />
      <div className="flex-1 overflow-hidden">
        <HeatMap />
      </div>
    </div>
  );
}
