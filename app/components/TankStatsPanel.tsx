import { fetchLatestData } from "app/services/dataService";
import { useEffect, useState } from "react";

export default function TankStatsPanel({ panelClass }) {
  // TODO: Tank number
  const [elementData, setElementData] = useState([]);

  useEffect(() => {
    const interval = setInterval(() => {
      // TODO: Error handling
      fetchLatestData().then((response) => {
        setElementData(response);
      });
    }, 2000);
    return () => clearInterval(interval);
  });

  return (
    <div className={panelClass}>
      <h2 className="text-lg font-bold text-dark-orange mb-3">Tank 1</h2>

      {/* TODO: Depending on how we insert observations, we need to  make sure any extra data doesn't show up here */}
      {elementData.length == 0 ? (
        <p className="text-dark-orange">Fetching data...</p>
      ) : (
        <ul className="space-y-1.5 text-sm text-dark-orange/80 font-medium">
          {elementData.map((element) => {
            return (
              <li key={element.id}>
                {element.name}: {element.value}
              </li>
            );
          })}
        </ul>
      )}

      {/* TODO: get an actual pinned note */}
      <div className="mt-4 bg-white p-3 shadow-inner rounded-lg">
        <h3 className="font-bold text-dark-orange text-sm mb-1">
          Pinned Notes
        </h3>
        <h4 className="font-bold text-dark-orange text-xs mb-1">
          🙍 Mr. Ramirez
        </h4>
        <p className="text-xs text-dark-orange/70 leading-relaxed">
          Tank 1 has been struggling lately. We suspect that the addition of the
          new supplement, "GroCoral", has negatively impacted the tank's
          vitality. Increased algae bloom observed.
        </p>
        <p className="font-bold text-dark-orange text-xs mt-2 underline">
          <a href="/notes">Open in Observations</a>
        </p>
      </div>
    </div>
  );
}
