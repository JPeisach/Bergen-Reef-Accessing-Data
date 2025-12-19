"use client";
import "../globals.css";
import NavigationBar from "app/components/NavigationBar";
import { useUser } from "@auth0/nextjs-auth0/client";
import TankBox from "app/components/TankBox";

export default function DashboardPage() {
  const { user } = useUser();
  
  return (
    <div>
      <NavigationBar defaultIndex={2} username={user ? user.name : "Guest"} />

      
      <div className="p-8 bg-light-orange/30 min-h-screen">
        <h1 className="text-3xl font-bold text-dark-orange mb-6 text-center drop-shadow-sm">
          Tank Dashboard
        </h1>

        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-7xl mx-auto">
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
    </div>
  );
}
