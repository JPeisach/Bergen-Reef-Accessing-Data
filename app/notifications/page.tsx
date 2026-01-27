"use client";

import { useUser } from "@auth0/nextjs-auth0/client";
import NavigationBar from "../components/NavigationBar";

const tanks = [
  { name: "Tank 1", status: "yes", updated: "just now" },
  { name: "Tank 2", status: "ok", updated: "1 day ago" },
  { name: "Tank 3", status: "no", updated: "2 days ago" },
  { name: "Tank 4", status: "yes", updated: "just now" },
  { name: "Tank 5", status: "ok", updated: "3 hours ago" },
  { name: "Tank 6", status: "yes", updated: "10 minutes ago" },
  { name: "Tank 7", status: "no", updated: "5 days ago" },
  { name: "Tank 8", status: "ok", updated: "yesterday" },
  { name: "Tank 9", status: "yes", updated: "just now" },
];

const statusStyles: Record<string, string> = {
  yes: "bg-green-100 text-green-800",
  ok: "bg-yellow-100 text-yellow-800",
  no: "bg-red-100 text-red-800",
};

export default function NotificationsPage() {
  const { user, isLoading } = useUser();

  if (isLoading) return <div>Loading...</div>;

  return (
    <div className="bg-[#F3E9D2] min-h-screen">
      <NavigationBar defaultIndex={-1} username={user ? user.name : "Guest"} />

      <main className="p-10">
        <div className="bg-white rounded-2xl orange shadow-lg p-8 max-w-6xl mx-auto">
          <h2 className="text-2xl font-semibold text-orange-500 mb-6 text-center">
            Tank Notifications
          </h2>

          <table className="w-full text-center border-separate border-spacing-y-3">
            <thead>
              <tr>
                <th className="text-gray-600 font-semibold">Tank</th>
                <th className="text-gray-600 font-semibold">Stable?</th>
                <th className="text-gray-600 font-semibold">Last Updated</th>
              </tr>
            </thead>

            <tbody>
              {tanks.map((tank) => (
                <tr
                  key={tank.name}
                  className="bg-[#FAF7F2] oramge rounded-xl shadow-sm"
                >
                  <td className="py-4 font-semibold rounded-l-xl">
                    {tank.name}
                  </td>

                  <td className="py-4">
                    <span
                      className={`px-4 py-1 rounded-full font-semibold text-sm ${statusStyles[tank.status]}`}
                    >
                      {tank.status === "yes"
                        ? "Yes"
                        : tank.status === "ok"
                          ? "OK"
                          : "Fail"}
                    </span>
                  </td>

                  <td className="py-4 text-dark-orange rounded-r-xl">
                    {tank.updated}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </main>
    </div>
  );
}
