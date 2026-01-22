import { ChevronLeftIcon, ChevronRightIcon } from "@heroicons/react/20/solid";
import DateBoundElement from "../DateBoundElement";

export default function DateConstraintsBox({
  startDate,
  endDate,
  rangeMode,
  handleStartDateChange,
  handleEndDateChange,
  setRangeModeWithDates,
  adjustDateRange,
}) {
  const now = new Date();
  return (
    <div className="date-constraints-box">
      <div className="bg-teal text-white font-semibold text-center p-2 m-4 mb-2 rounded-xl self-center mx-auto w-fit">
        Date Constraints
      </div>
      <div className="flex items-center justify-center space-x-2 px-3">
        <button
          onClick={() => adjustDateRange("backward")}
          className="bg-white p-2 rounded-lg hover:bg-medium-teal disabled:opacity-50"
        >
          <ChevronLeftIcon className="h-5 w-5 text-teal hover:text-white" />
        </button>
        <div
          className={`flex items-center flex-col justify-center rounded-lg pt-2 m-3 mt-1 text-lg text-neutral-700`}
        >
          <DateBoundElement
            value={startDate || new Date()}
            onChange={handleStartDateChange}
          />

          <div className="bg-teal p-1 pl-2 pr-2 mt-3 mb-3 rounded-lg">
            <span className="text-white font-semibold text-center">to</span>
          </div>

          <DateBoundElement
            value={endDate || new Date()}
            onChange={handleEndDateChange}
          />
        </div>
        <button
          onClick={() => adjustDateRange("forward")}
          className="bg-white p-2 rounded-lg hover:bg-medium-teal disabled:opacity-50"
          disabled={now && endDate && endDate >= now}
        >
          <ChevronRightIcon className="h-5 w-5 text-teal hover:text-white" />
        </button>
      </div>

      <div className="flex justify-center space-x-4 mt-4">
        <button
          onClick={() => setRangeModeWithDates("day")}
          className={`date-range-button ${
            rangeMode === "day"
              ? "date-range-button-selected"
              : "date-range-button-unselected"
          }`}
        >
          Day
        </button>
        <button
          onClick={() => setRangeModeWithDates("week")}
          className={`date-range-button ${
            rangeMode === "week"
              ? "date-range-button-selected"
              : "date-range-button-unselected"
          }`}
        >
          Week
        </button>
        <button
          onClick={() => setRangeModeWithDates("twoWeeks")}
          className={`date-range-button ${
            rangeMode === "twoWeeks"
              ? "date-range-button-selected"
              : "date-range-button-unselected"
          }`}
        >
          Two Weeks
        </button>
      </div>
    </div>
  );
}
