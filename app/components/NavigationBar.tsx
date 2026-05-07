import { Tab, TabGroup, TabList } from "@headlessui/react";
import { UserCircleIcon, Cog6ToothIcon } from "@heroicons/react/24/solid";

import clsx from "clsx";
import { Fragment } from "react";
import { Menu, MenuButton, MenuItems, MenuItem } from "@headlessui/react";
import { ChevronDownIcon } from "@heroicons/react/24/outline";
import Link from "next/link";

interface NavigationBarProps {
  defaultIndex: number;
  username: string;
}

// WARNING: AI CODE (mostly in styling and className), and use of aside.
const NavigationBar: React.FC<NavigationBarProps> = ({
  defaultIndex,
  username,
}) => {
  // Sidebar width classes used both for the fixed aside and for the placeholder
  const widthClasses = "w-20 sm:w-56 md:w-64 lg:w-72 xl:w-80";

  return (
    <>
      {/* Fixed sidebar: removed from document flow so we render a placeholder below */}
      <aside
        role="navigation"
        className={clsx(
          "fixed left-0 top-0 z-30 flex flex-col bg-base-100 h-screen border border-base-300 p-4 shadow-md",
          widthClasses,
        )}
      >
        {/* Logo / title */}
        <Link href="/">
          <div className="flex items-center gap-3 min-w-0 py-2 cursor-pointer">
            <img
              src="/images/coral-reef-logo.png"
              className="w-8 sm:w-10 md:w-12 h-auto"
              alt="Coral Reef Logo"
            />
            <h1 className="text-primary font-semibold text-base sm:text-xl md:text-2xl whitespace-nowrap truncate hidden sm:block">
              Bergen Reef Accessing Data
            </h1>
          </div>
        </Link>

        {/* Navigation list - scrolls if needed and takes remaining height */}
        <div className="flex-1 mt-4 w-full overflow-hidden">
          <TabGroup vertical defaultIndex={defaultIndex}>
            <TabList className="flex flex-col w-full h-full overflow-auto pr-2">
              <Link href="/">
                <Tab as={Fragment}>
                  {() => (
                    <button
                      className={clsx(
                        "navbar-tabitem w-full text-left",
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

              <a href="/indiv_tanks">
                <Tab as={Fragment}>
                  {() => (
                    <button
                      className={clsx(
                        "navbar-tabitem w-full text-left",
                        defaultIndex === 1
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
                        "navbar-tabitem w-full text-left",
                        defaultIndex === 2
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
                        "navbar-tabitem w-full text-left",
                        defaultIndex === 3
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
                        "navbar-tabitem w-full text-left",
                        defaultIndex === 4
                          ? "navbar-tabitem-highlighted"
                          : "navbar-tabitem-unhighlighted",
                      )}
                    >
                      History
                    </button>
                  )}
                </Tab>
              </a>

              <Menu as="div" className="relative inline-block w-full">
                <MenuButton
                  className={clsx(
                    "navbar-tabitem flex items-center justify-between w-full",
                    defaultIndex === 5
                      ? "navbar-tabitem-highlighted"
                      : "navbar-tabitem-unhighlighted",
                  )}
                >
                  <span>Graphs</span>
                  <ChevronDownIcon className="-mr-1 size-5 text-base-content/50" />
                </MenuButton>
                <MenuItems
                  className="absolute left-1/2 -translate-x-1/2 mt-2 w-56 bg-base-100 shadow-lg ring-1 ring-base-300 z-50"
                  style={{ zIndex: 40 }}
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
                  <MenuItem>
                    <a href="/data/barchart">
                      <button className="navbar-graphs-dropdown-button">
                        Bar Chart
                      </button>
                    </a>
                  </MenuItem>
                </MenuItems>
              </Menu>

              {/* spacer to create a visual gap before bottom area when content is short */}
              <div className="h-6" />
            </TabList>
          </TabGroup>
        </div>

        {/* Bottom area: profile and settings sit at the bottom */}
        <div className="mt-4 w-full">
          <a href="/profile" className="flex items-center gap-2 w-full">
            <UserCircleIcon className={clsx("h-8 w-8", "text-primary")} />
            <p className="text-base sm:text-lg md:text-xl text-primary font-semibold px-2 py-0.5 whitespace-pre-wrap truncate hidden sm:block">
              Welcome {username}!
            </p>
          </a>

          <a href="/settings" className="block w-full mt-3">
            <button className="w-full py-3 rounded-2xl transition-all duration-300 flex items-center justify-center gap-2 bg-base-100 drop-shadow-md border border-base-300 text-base-content font-semibold hover:bg-primary hover:text-primary-content hover:shadow-lg hover:-translate-y-1 active:translate-y-0">
              <Cog6ToothIcon className="h-5 w-5" />
              <span className="hidden sm:inline">Settings</span>
            </button>
          </a>
        </div>
      </aside>

      {/* Placeholder so pages that render nav inline keep correct layout (sidebar width) */}
      {/*
        Use a floated, full-height placeholder so normal (non-flex) page layouts flow to the right
        of the fixed sidebar. Hidden on very small screens so the sidebar can overlay if needed.
      */}
      <div
        aria-hidden
        className={clsx(
          "hidden sm:block float-left h-screen flex-shrink-0",
          widthClasses,
        )}
      />
    </>
  );
};

export default NavigationBar;
