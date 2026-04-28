"use client";
import { useUser } from "@auth0/nextjs-auth0/client";
import "../globals.css";
import HistoryPageGrid from "../components/HistoryPageGrid";
import NavigationBar from "../components/NavigationBar";

export default function Page() {
  const { user } = useUser();

  return (
    <div className="bg-base-200">
      <NavigationBar defaultIndex={5} username={user ? user.name : "Guest"} />

      {/* Content */}
      <HistoryPageGrid />
    </div>
  );
}
