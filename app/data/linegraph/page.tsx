"use client";
import { useUser } from "@auth0/nextjs-auth0/client";
import "../../globals.css";
import DataLineGraph from "../../components/graphComponents/DataLineGraph";
import NavigationBar from "../../components/NavigationBar";

export default function Page() {
  const { user } = useUser();

  return (
    <div className="bg-base-200">
      <NavigationBar defaultIndex={6} username={user ? user.name : "Guest"} />
      <div className="bg-base-100/30 min-h-screen flex-1 overflow-hidden">
        <DataLineGraph />
      </div>
    </div>
  );
}
