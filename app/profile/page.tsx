"use client";
import { useEffect, useState } from "react";
import "../globals.css";
import { ArrowUpRightIcon } from "@heroicons/react/24/solid";
import { useUser } from "@auth0/nextjs-auth0/client";
import NavigationBar from "../components/NavigationBar";
import { isUserAdmin } from "../../actions/isUserAdmin";
import { ResponsiveContainer } from "recharts";
import UserList from "app/components/UserList";

export default function Page() {
  const { user, isLoading } = useUser();

  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    async function checkAdmin() {
      if (user) {
        const adminStatus = await isUserAdmin();
        setIsAdmin(adminStatus);
      }
    }
    checkAdmin();
    console.log(isAdmin);
  }, [user]);

  if (isLoading) return <div>Loading...</div>;

  return (
    <div className="bg-base-200 min-h-screen">
      <NavigationBar defaultIndex={-1} username={user ? user.name : "Guest"} />
      <br></br>
      <br></br>

      {/* top white box*/}
      <div className="bg-base-100 border border-base-300 rounded shadow-sm p-6 flex justify-between items-center w-3/4 mx-auto text-base-content">
        <div className="flex items-center gap-4">
          {user ? (
            <>
              <div>
                <h1 className="text-2xl font-semibold">{user.name}</h1>
                <h3 className="text-sm">{user.email}</h3>
              </div>
              <a
                href="/auth/logout"
                className="bg-secondary text-secondary-content px-6 py-2 rounded-xl shadow-lg hover:brightness-110 transition flex items-center justify-center text-base font-medium"
              >
                Logout
              </a>
            </>
          ) : (
            <>
              <div>
                <h1 className="text-2xl font-semibold">General User</h1>
                <p className="text-sm">Login for User Info!</p>
              </div>
              <a
                href="/auth/login"
                className="bg-primary text-primary-content px-6 py-2 rounded-xl shadow-lg hover:bg-primary/90 transition text-center flex items-center justify-center text-base font-medium"
              >
                Login
              </a>
            </>
          )}
        </div>

        <a
          target="_blank"
          href="https://docs.google.com/spreadsheets/d/1BF5JBYV3v2brBQQaRBo6X_J-uPCdDtzE4UUCDKtLPJA/edit?usp=sharing"
          className="bg-accent text-accent-content px-6 py-2 rounded-xl shadow-lg hover:brightness-110 transition inline-flex items-center"
        >
          View Data Backup Spreadsheet{" "}
          <ArrowUpRightIcon className="inline w-4 h-4 text-accent-content ml-1 align-text-bottom" />
        </a>
      </div>

      <br></br>

      {isAdmin && (
        <div className="flex justify-center">
          <div
            className="rounded-md justify-content-center w-1/2 bg-base-200 border border-base-300 p-4"
            style={{ height: 400 }}
          >
            <ResponsiveContainer>
              <UserList />
            </ResponsiveContainer>
          </div>

          <div className="ml-4">
            <iframe
              src="https://docs.google.com/spreadsheets/d/1BF5JBYV3v2brBQQaRBo6X_J-uPCdDtzE4UUCDKtLPJA/edit?usp=sharing&embedded=true"
              style={{
                width: "600px",
                height: "400px",
                outline: "none",
                border: "0px",
              }}
              className="rounded-xl shadow-lg"
            />
          </div>
        </div>
      )}
    </div>
  );
}
