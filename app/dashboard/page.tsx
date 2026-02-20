"use client";
import "../globals.css";
import NavigationBar from "app/components/NavigationBar";
import { useUser } from "@auth0/nextjs-auth0/client";
import HistoricDataTankBox from "app/components/tankBoxes/HistoricDataTankBox";
import { useState } from "react";
import RecentDataTankBox from "app/components/tankBoxes/RecentDataTankBox";
import { Menu, MenuButton, MenuItem, MenuItems } from "@headlessui/react";
import { ChevronDownIcon } from "@heroicons/react/20/solid";

export default function DashboardPage() {
  const { user } = useUser();
  const [variableType, setVariableType] = useState("pH");

  return (
    <div>
      <NavigationBar defaultIndex={1} username={user ? user.name : "Guest"} />

      <div className="p-8 bg-light-orange/30 h-screen overflow-scroll">
        <h1 className="text-3xl font-bold text-dark-orange mb-6 text-center drop-shadow-sm">
          Tank Dashboard
        </h1>

        <div className="flex flex-col items-center py-5 gap-4">
          <label className="text-2xl font-bold text-dark-orange text-center drop-shadow-sm">
            Variable
          </label>
          <div className="w-full max-w-xs relative z-10">
            <Menu as="div" className="relative inline-block text-left w-full">
              <MenuButton className="w-full h-10 text-center rounded-xl bg-dark-orange text-lg text-white font-semibold shadow-md transition-all hover:bg-orange focus:outline-none flex items-center justify-center">
                <span>{variableType}</span>
                <ChevronDownIcon className="-mr-1 size-6 text-white ml-2" />
              </MenuButton>
              <MenuItems className="absolute left-0 mt-2 w-full origin-top-right divide-y divide-gray-100 rounded-xl bg-white shadow-lg ring-1 ring-black/5 focus:outline-none z-50">
                <div className="px-1 py-1">
                  {[
                    "pH",
                    "Calcium",
                    "Alkalinity",
                    "ORP",
                    "Temperature",
                    "Salinity",
                  ].map((type) => (
                    <MenuItem key={type}>
                      <button
                        onClick={() => setVariableType(type)}
                        className="group flex w-full items-center rounded-lg px-2 py-2 text-sm font-semibold text-dark-orange hover:bg-light-orange"
                      >
                        {type}
                      </button>
                    </MenuItem>
                  ))}
                </div>
              </MenuItems>
            </Menu>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-7xl mx-auto">
          <RecentDataTankBox
            tankNumber={1}
            variableType={variableType}
          ></RecentDataTankBox>
          <RecentDataTankBox
            tankNumber={2}
            variableType={variableType}
          ></RecentDataTankBox>
          <RecentDataTankBox
            tankNumber={3}
            variableType={variableType}
          ></RecentDataTankBox>
          <RecentDataTankBox
            tankNumber={4}
            variableType={variableType}
          ></RecentDataTankBox>
          <RecentDataTankBox
            tankNumber={5}
            variableType={variableType}
          ></RecentDataTankBox>
          <RecentDataTankBox
            tankNumber={6}
            variableType={variableType}
          ></RecentDataTankBox>
          <RecentDataTankBox
            tankNumber={7}
            variableType={variableType}
          ></RecentDataTankBox>
          <RecentDataTankBox
            tankNumber={8}
            variableType={variableType}
          ></RecentDataTankBox>
          <RecentDataTankBox
            tankNumber={9}
            variableType={variableType}
          ></RecentDataTankBox>
        </div>
      </div>
    </div>
  );
}
