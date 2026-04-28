"use client";
import { useUser } from "@auth0/nextjs-auth0/client";
import "../globals.css";
import NavigationBar from "../components/NavigationBar";

export default function Page() {
  const { user } = useUser();

  return (
    <div className="bg-base-200">
      <NavigationBar defaultIndex={6} username={user ? user.name : "Guest"} />
      <br></br>
      <div
        style={{
          width: "50%",
          position: "fixed",
          top: "12.8%",
          left: "25%",
          height: "79%",
          overflowY: "auto",
        }}
      >
        <div className="flex h-full w-full flex-col items-center rounded-2xl border border-base-300 bg-base-100 p-6">
          <div className="bg-accent text-accent-content rounded-lg p-4 w-full">
            <h2 className="flex justify-center text-xl font-semibold">
              Graphs
            </h2>
          </div>
          <div className="flex flex-col gap-4 p-6 w-full items-center">
            <a href="/data/linegraph" className="w-full">
              <button
                type="button"
                className="bg-primary text-primary-content outline outline-1 outline-primary font-medium px-4 py-2 rounded-xl hover:bg-primary/90 w-full flex items-center justify-center text-base"
              >
                Simple Line Graph
              </button>
            </a>
            <a href="/data/twodimgraph" className="w-full">
              <button
                type="button"
                className="bg-primary text-primary-content outline outline-1 outline-primary font-medium px-4 py-2 rounded-xl hover:bg-primary/90 w-full flex items-center justify-center text-base"
              >
                Two Dimensional Scatter Plot
              </button>
            </a>
            <a href="/data/boxplot" className="w-full">
              <button
                type="button"
                className="bg-primary text-primary-content outline outline-1 outline-primary font-medium px-4 py-2 rounded-xl hover:bg-primary/90 w-full flex items-center justify-center text-base"
              >
                Box Plot
              </button>
            </a>
            <a href="/data/heatmap" className="w-full">
              <button
                type="button"
                className="bg-primary text-primary-content outline outline-1 outline-primary font-medium px-4 py-2 rounded-xl hover:bg-primary/90 w-full flex items-center justify-center text-base"
              >
                Heat Map
              </button>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
