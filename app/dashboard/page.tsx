"use client";
import "../globals.css";
import NavigationBar from "app/components/NavigationBar";
import { useUser } from "@auth0/nextjs-auth0/client";
import TankBox from "app/components/TankBox";
import { useEffect } from "react";

export default function DashboardPage() {
  const { user } = useUser();
  useEffect(() => {});
  return (
    <div id="dashboard-page" className="items-center">
      <NavigationBar defaultIndex={2} username={user ? user.name : "Guest"} />

      <div className="grid grid-rows-3 grid-cols-3 p-8 gap-8">
        <TankBox tankNumber={1}></TankBox>
        <TankBox tankNumber={2}></TankBox>
        <TankBox tankNumber={3}></TankBox>
        <TankBox tankNumber={4}></TankBox>
        <TankBox tankNumber={5}></TankBox>
        <TankBox tankNumber={6}></TankBox>
        <TankBox tankNumber={7}></TankBox>
        <TankBox tankNumber={8}></TankBox>
        <TankBox tankNumber={9}></TankBox>
      </div>
    </div>
  );
}
