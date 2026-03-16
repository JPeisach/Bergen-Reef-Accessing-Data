"use client";
import { Fragment } from "react";
import clsx from "clsx";
import { Tab, TabGroup, TabList } from "@headlessui/react";
import { UserCircleIcon } from "@heroicons/react/24/solid";
import Link from "next/link";

export default function Page() {
  return (
    <div>
      <div className="flex items-center justify-between bg-teal p-4 shadow-lg rounded-lg">
        <Link href="/">
          <div className="text-3xl">
            {" "}
            <img src="/images/coral-logo.png"></img>
          </div>
        </Link>
        <div className="flex items-right justify-between">
          <a href="/admin">
            <div className="pt-1.5 pr-8">
              <UserCircleIcon className="size-8 text-primary-content" />
            </div>
          </a>
          <TabGroup defaultIndex={0}>
            <TabList className="flex space-x-4">
              <Link href="/">
                <Tab as={Fragment}>
                  {({ selected }) => (
                    <button
                      className={clsx(
                        "tab-item px-6 py-2 rounded-full transition",
                        selected
                          ? "bg-base-100 text-dark-teal font-semibold hover:bg-medium-orange"
                          : "bg-base-100 text-dark-teal font-semibold hover:bg-medium-orange",
                      )}
                    >
                      Home
                    </button>
                  )}
                </Tab>
              </Link>
              <a href="/data">
                <Tab as={Fragment}>
                  {({ selected }) => (
                    <button
                      className={clsx(
                        "tab-item px-6 py-2 rounded-full transition",
                        selected
                          ? "bg-primary text-white font-bold"
                          : "bg-base-100 text-dark-teal font-semibold hover:bg-medium-orange",
                      )}
                    >
                      Data
                    </button>
                  )}
                </Tab>
              </a>
              <a href="/history">
                <Tab as={Fragment}>
                  {({ selected }) => (
                    <button
                      className={clsx(
                        "tab-item px-6 py-2 rounded-full transition",
                        selected
                          ? "bg-primary text-white font-bold"
                          : "bg-base-100 text-dark-teal font-semibold hover:bg-medium-orange",
                      )}
                    >
                      History
                    </button>
                  )}
                </Tab>
              </a>
            </TabList>
          </TabGroup>
        </div>
      </div>

      <div></div>

      <div className="flex space-x-4">
        <a
          href="../api/auth/login"
          className="bg-primary text-white px-6 py-2 rounded-full shadow-lg hover:bg-primary transition"
        >
          Login
        </a>

        <a
          href="../api/auth/logout"
          className="bg-primary text-white px-6 py-2 rounded-full shadow-lg hover:bg-primary transition"
        >
          Logout
        </a>
      </div>
    </div>
  );
}
