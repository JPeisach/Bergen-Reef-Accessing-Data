import { Tab, TabGroup, TabList } from "@headlessui/react";
import {
  UserCircleIcon,
  Cog6ToothIcon,
  BellIcon,
} from "@heroicons/react/24/solid";

import clsx from "clsx";
import { Fragment } from "react";
import { Menu, MenuButton, MenuItems, MenuItem } from "@headlessui/react";
import { ChevronDownIcon } from "@heroicons/react/24/outline";
import Link from "next/link";

interface NavigationBarProps {
  defaultIndex: number;
  username: string;
}

const NavigationBar: React.FC<NavigationBarProps> = ({
  defaultIndex,
  username,
}) => {
  return (
    <>
      <div className="flex bg-white">
        <Link href="/">
          <div className="flex items-center gap-3 min-w-0 py-2">
            <img
              src="/images/coral-reef-logo.png"
              className="w-8 sm:w-10 md:w-12 h-auto"
              alt="Coral Reef Logo"
            />
            <h1 className="text-dark-orange font-semibold text-base sm:text-xl md:text-2xl whitespace-nowrap truncate min-w-0">
              Bergen Reef Accessing Data
            </h1>
          </div>
        </Link>
      </div>
      <div
        className="navbar flex flex-col items-center justify-between bg-white p-4 drop-shadow-orange rounded-lg h-screen"
        style={{ position: "relative", zIndex: 10 }}
      >
        <div className="flex flex-col">
          <TabGroup vertical defaultIndex={defaultIndex}>
            <TabList className="flex flex-col">
              <Link href="/">
                <Tab as={Fragment}>
                  {() => (
                    <button
                      className={clsx(
                        "navbar-tabitem",
                        defaultIndex === 0
                          ? "navbar-tabitem-highlighted"
                          : "navbar-tabitem-unhighlighted",
                      )}
                    >
                      Home
                    </button>
                  )}
                </Tab>
              </Link>

              <a href="/dashboard">
                <Tab as={Fragment}>
                  {() => (
                    <button
                      className={clsx(
                        "navbar-tabitem",
                        defaultIndex === 1
                          ? "navbar-tabitem-highlighted"
                          : "navbar-tabitem-unhighlighted",
                      )}
                    >
                      Dashboard
                    </button>
                  )}
                </Tab>
              </a>

              <a href="/indiv_tanks">
                <Tab as={Fragment}>
                  {({ selected }) => (
                    <button
                      className={clsx(
                        "navbar-tabitem",
                        defaultIndex === 2
                          ? "navbar-tabitem-highlighted"
                          : "navbar-tabitem-unhighlighted",
                      )}
                    >
                      Individual Tanks
                    </button>
                  )}
                </Tab>
              </a>

              <a href="/notes">
                <Tab as={Fragment}>
                  {() => (
                    <button
                      className={clsx(
                        "navbar-tabitem",
                        defaultIndex === 3
                          ? "navbar-tabitem-highlighted"
                          : "navbar-tabitem-unhighlighted",
                      )}
                    >
                      Observations
                    </button>
                  )}
                </Tab>
              </a>
              <a href="/info">
                <Tab as={Fragment}>
                  {() => (
                    <button
                      className={clsx(
                        "navbar-tabitem",
                        defaultIndex === 4
                          ? "navbar-tabitem-highlighted"
                          : "navbar-tabitem-unhighlighted",
                      )}
                    >
                      Info
                    </button>
                  )}
                </Tab>
              </a>

              <a href="/history">
                <Tab as={Fragment}>
                  {() => (
                    <button
                      className={clsx(
                        "navbar-tabitem",
                        defaultIndex === 5
                          ? "navbar-tabitem-highlighted"
                          : "navbar-tabitem-unhighlighted",
                      )}
                    >
                      History
                    </button>
                  )}
                </Tab>
              </a>

              <Menu as="div" className="relative inline-block">
                <MenuButton
                  className={clsx(
                    "navbar-tabitem flex items-center justify-center",
                    defaultIndex === 6
                      ? "navbar-tabitem-highlighted"
                      : "navbar-tabitem-unhighlighted",
                  )}
                >
                  Graphs
                  <ChevronDownIcon className="-mr-1 size-5 text-gray-400" />
                </MenuButton>
                <MenuItems
                  className="absolute left-1/2 -translate-x-1/2 mt-2 w-56  bg-white shadow-lg ring-1 ring-black/5 z-50"
                  style={{ zIndex: 20 }}
                >
                  <MenuItem>
                    <a href="/data/linegraph">
                      <button className="navbar-graphs-dropdown-button">
                        Line Graph
                      </button>
                    </a>
                  </MenuItem>
                  <MenuItem>
                    <a href="/data/twodimgraph">
                      <button className="navbar-graphs-dropdown-button">
                        Two Dimension Plot
                      </button>
                    </a>
                  </MenuItem>
                  <MenuItem>
                    <a href="/data/boxplot">
                      <button className="navbar-graphs-dropdown-button">
                        Box Plot
                      </button>
                    </a>
                  </MenuItem>
                  <MenuItem>
                    <a href="/data/heatmap">
                      <button className="navbar-graphs-dropdown-button">
                        Heat Map
                      </button>
                    </a>
                  </MenuItem>
                </MenuItems>
              </Menu>

              <a href="/profile" className="">
                <div className="flex flex-row flex-wrap">
                  <UserCircleIcon className={clsx("size-8", "text-orange")} />
                  {/* FIXME: wrap text neatly with the icon */}
                  <p className="text-base sm:text-lg md:text-xl text-dark-orange font-semibold px-2 py-0.5 whitespace-pre-wrap">
                    Welcome {username}!
                  </p>
                </div>
              </a>
            </TabList>
          </TabGroup>
        </div>

        {/* FIXME: This should be in TabGroup */}
        <div className="mt-auto">
          <a href="/settings">
            <button className="tab-item w-full py-5 transition flex items-center justify-bottom gap-2 bg-light-gray outline outline-1 outline-medium-gray drop-shadow-xl text-gray font-semibold hover:bg-medium-orange">
              <Cog6ToothIcon className="size-5" />
              Settings
            </button>
          </a>
        </div>
        <div className="mt">
          <a href="/notifications">
            <button className="tab-item py-5 transition flex items-center justify-top gap-0 bg-light-gray outline outline-1 outline-medium-gray drop-shadow-xl text-gray font-semibold hover:bg-medium-orange">
              <BellIcon className="size-5" />
              Notifications
            </button>
          </a>
        </div>
      </div>
    </>
  );
};

export default NavigationBar;
