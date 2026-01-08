import React from "react";
import "./globals.css"; // These styles apply to every route in the application
import { Auth0Provider } from "@auth0/nextjs-auth0";

export const metadata = {
  title: "Bergen Reef Accessing Data",
  description:
    "Data Visualization Web Application for the BCA Coral Reef Research Lab ",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <Auth0Provider>
        <body>{children}</body>
      </Auth0Provider>
    </html>
  );
}
