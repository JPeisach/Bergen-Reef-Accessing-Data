"use client";

import { useUser } from "@auth0/nextjs-auth0/client";
import NavigationBar from "../components/NavigationBar";

export default function SettingsPage() {
  const { user, isLoading } = useUser();

  if (isLoading) return <div>Loading...</div>;

  return (
    <div>
      <NavigationBar defaultIndex={-1} username={user ? user.name : "Guest"} />
      <br></br>
      <br></br>
    </div>
  );
}

