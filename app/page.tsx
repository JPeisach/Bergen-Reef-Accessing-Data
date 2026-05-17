"use client";
import "./globals.css";
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
    <div className="bg-base-200">
      <NavigationBar defaultIndex={0} username={user ? user.name : "Guest"} />

      <div className="p-8 bg-base-200 h-dvh overflow-scroll">
        <h1 className="text-3xl font-bold text-primary mb-6 text-center drop-shadow-sm">
          Tank Dashboard
        </h1>

        <div className="flex flex-col items-center py-5 gap-4">
          <label className="text-2xl font-bold text-primary text-center drop-shadow-sm">
            Variable
          </label>
          <div className="w-full max-w-xs relative z-10">
            <Menu as="div" className="relative inline-block text-left w-full">
              <MenuButton className="w-full h-10 text-center rounded-xl bg-primary text-lg text-primary-content font-semibold shadow-md transition-all hover:bg-primary/90 focus:outline-none flex items-center justify-center">
                <span>{variableType}</span>
                <ChevronDownIcon className="-mr-1 size-6 text-primary-content ml-2" />
              </MenuButton>
              <MenuItems className="absolute left-0 mt-2 w-full origin-top-right divide-y divide-base-300 rounded-xl bg-base-100 shadow-lg ring-1 ring-base-300 focus:outline-none z-50">
                <div className="px-1 py-1">
                  {[
                    "pH",
                    "Calcium",
                    "Alkalinity",
                    "ORP",
                    "Temperature",
                    "Salinity",
                    "LLS",
                  ].map((type) => (
                    <MenuItem key={type}>
                      <button
                        onClick={() => setVariableType(type)}
                        className="group flex w-full items-center rounded-lg px-2 py-2 text-sm font-semibold text-primary hover:bg-base-200"
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

        <div className="grid grid-cols-3 grid-rows-3 gap-6">
          <RecentDataTankBox
            tankName="CoralLab60_1"
            variableType={variableType}
          ></RecentDataTankBox>
          <RecentDataTankBox
            tankName="CoralLab60_2"
            variableType={variableType}
          ></RecentDataTankBox>
          <RecentDataTankBox
            tankName="CoralLab60_3"
            variableType={variableType}
          ></RecentDataTankBox>
          <RecentDataTankBox
            tankName="CoralLab60_4"
            variableType={variableType}
          ></RecentDataTankBox>
          <RecentDataTankBox
            tankName="CoralLab60_5"
            variableType={variableType}
          ></RecentDataTankBox>
          <RecentDataTankBox
            tankName="CoralLab60_6"
            variableType={variableType}
          ></RecentDataTankBox>
          <RecentDataTankBox
            tankName="MakerReef"
            variableType={variableType}
          ></RecentDataTankBox>
          <RecentDataTankBox
            tankName="ESCReef"
            variableType={variableType}
          ></RecentDataTankBox>
          <RecentDataTankBox
            tankName="CoralLab380"
            variableType={variableType}
          ></RecentDataTankBox>
        </div>
      </div>
    </div>
  );
}
