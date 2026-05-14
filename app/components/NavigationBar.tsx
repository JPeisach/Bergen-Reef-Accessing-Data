import { UserCircleIcon, Cog6ToothIcon } from "@heroicons/react/24/solid";

import clsx from "clsx";
import Link from "next/link";

interface NavigationBarProps {
  defaultIndex: number;
  username: string;
}

// WARNING: AI CODE (mostly in styling and className)
const NavigationBar: React.FC<NavigationBarProps> = ({
  defaultIndex,
  username,
}) => {
  // Sidebar width classes used both for the fixed aside and for the placeholder
  const widthClasses = "w-20 sm:w-56 md:w-64 lg:w-72 xl:w-72";

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
        <ul className="menu flex-1 flex-nowrap mt-4 w-full overflow-hidden">
          <Link href="/">
            <button
              className={clsx(
                "navbar-tabitem w-full",
                defaultIndex === 0
                  ? "navbar-tabitem-highlighted"
                  : "navbar-tabitem-unhighlighted",
              )}
            >
              Home
            </button>
          </Link>

          <a href="/indiv_tanks">
            <button
              className={clsx(
                "navbar-tabitem w-full",
                defaultIndex === 1
                  ? "navbar-tabitem-highlighted"
                  : "navbar-tabitem-unhighlighted",
              )}
            >
              Individual Tanks
            </button>
          </a>

          <a href="/notes">
            <button
              className={clsx(
                "navbar-tabitem w-full",
                defaultIndex === 2
                  ? "navbar-tabitem-highlighted"
                  : "navbar-tabitem-unhighlighted",
              )}
            >
              Observations
            </button>
          </a>

          <a href="/info">
            <button
              className={clsx(
                "navbar-tabitem w-full",
                defaultIndex === 3
                  ? "navbar-tabitem-highlighted"
                  : "navbar-tabitem-unhighlighted",
              )}
            >
              Info
            </button>
          </a>

          <a href="/history">
            <button
              className={clsx(
                "navbar-tabitem w-full",
                defaultIndex === 4
                  ? "navbar-tabitem-highlighted"
                  : "navbar-tabitem-unhighlighted",
              )}
            >
              History
            </button>
          </a>

          <div className="divider"></div>

          <a href="/data/linegraph">
            <button
              className={clsx(
                "navbar-tabitem w-full",
                defaultIndex === 5
                  ? "navbar-tabitem-highlighted"
                  : "navbar-tabitem-unhighlighted",
              )}
            >
              Line Graph
            </button>
          </a>
          <a href="/data/twodimgraph">
            <button
              className={clsx(
                "navbar-tabitem w-full",
                defaultIndex === 6
                  ? "navbar-tabitem-highlighted"
                  : "navbar-tabitem-unhighlighted",
              )}
            >
              Two Dimension Plot
            </button>
          </a>
          <a href="/data/boxplot">
            <button
              className={clsx(
                "navbar-tabitem w-full",
                defaultIndex === 7
                  ? "navbar-tabitem-highlighted"
                  : "navbar-tabitem-unhighlighted",
              )}
            >
              Box Plot
            </button>
          </a>
          <a href="/data/heatmap">
            <button
              className={clsx(
                "navbar-tabitem w-full",
                defaultIndex === 8
                  ? "navbar-tabitem-highlighted"
                  : "navbar-tabitem-unhighlighted",
              )}
            >
              Heat Map
            </button>
          </a>
          <a href="/data/barchart">
            <button
              className={clsx(
                "navbar-tabitem w-full",
                defaultIndex === 9
                  ? "navbar-tabitem-highlighted"
                  : "navbar-tabitem-unhighlighted",
              )}
            >
              Bar Chart
            </button>
          </a>
        </ul>

        {/* spacer to create a visual gap before bottom area when content is short */}
        <div className="h-6" />

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
