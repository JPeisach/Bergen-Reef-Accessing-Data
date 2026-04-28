import { fetchLatestData } from "app/services/dataService";
import { useEffect, useState } from "react";
import ObservationList from "./observations/ObservationList";

export default function TankStatsPanel({ panelClass, tankName }) {
  const [elementData, setElementData] = useState([]);

  useEffect(() => {
    // FIXME: make it so when we change the tankName, it immediately refreshes
    const interval = setInterval(() => {
      // TODO: Error handling
      fetchLatestData(tankName).then((response) => {
        setElementData(response);
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [tankName]);

  return (
    <div className={panelClass}>
      <h2 className="text-lg font-bold text-primary mb-3">Tank {tankName}</h2>

      {/* TODO: Depending on how we insert observations, we need to  make sure any extra data doesn't show up here */}
      {elementData.length == 0 ? (
        <p className="text-primary">Fetching data...</p>
      ) : (
        <ul className="space-y-1.5 text-sm text-primary/80 font-medium">
          {elementData.map((element) => {
            if (element != null) {
              return (
                <li key={element.id}>
                  {element.name}: {element.value}
                </li>
              );
            }
          })}
        </ul>
      )}

      {/* TODO: Pinned notes? */}
      {/* TODO: Display in some arrow card mode? */}
      <ObservationList></ObservationList>
    </div>
  );
}
