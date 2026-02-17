import { fetchLatestData } from "app/services/dataService";
import { useEffect, useState } from "react";
import ObservationList from "./observations/ObservationList";

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

      {/* TODO: Pinned notes? */}
      {/* TODO: Display in some arrow card mode? */}
      <ObservationList></ObservationList>
    </div>
  );
}
