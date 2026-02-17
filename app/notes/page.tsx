"use client";
import { useState, useEffect } from "react";
import { useUser } from "@auth0/nextjs-auth0/client";
import "../globals.css";
import NavigationBar from "../components/NavigationBar";
import ObservationNotepad from "app/components/observations/ObservationNotepad";

export default function Page() {
  const { user } = useUser();
  const [tankNumber, setTankNumber] = useState("");
  const [coralType, setCoralType] = useState("");
  const [observationTime, setObservationTime] = useState("");
  const [isNotepadVisible, setIsNotepadVisible] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [observations, setObservations] = useState<
    Array<{
      observationId: number;
      authorId: number;
      datetime: Date;
      observationTitle: string | null;
      observationText: string | null;

      // Not in DB
      author: string;
    }>
  >([]);

  const [isLoadingObservations, setIsLoadingObservations] = useState(true);

  const coralTypes = [
    "Mushroom Coral",
    "Brain Coral",
    "Jolene Coral",
    "Sarah Coral",
    "Josh Coral",
  ];

  const fetchObservations = async () => {
    setIsLoadingObservations(true);
    try {
      const response = await fetch("/api/observations?limit=5");
      if (!response.ok) {
        throw new Error("Failed to fetch observations");
      }
      const data = await response.json();
      setObservations(data || []);
    } catch (error) {
      console.error("Error fetching observations:", error);
      setObservations([]);
    } finally {
      setIsLoadingObservations(false);
    }
  };

  const formatDate = (date: Date) => {
    // Why is react gaslighting us into thinking these methods don't exist?
    // Why is this..
    // https://stackoverflow.com/questions/48101949/cannot-apply-todatestring-to-date-in-js
    //
    // ???????
    const tempDate = new Date(date.toString());

    return (
      tempDate.toLocaleDateString() + " at " + tempDate.toLocaleTimeString()
    );
  };

  const filteredObservations = observations.filter((obs) => {
    const query = searchQuery.toLowerCase();
    const titleMatch = obs.observationTitle?.toLowerCase().includes(query);
    const textMatch = obs.observationText?.toLowerCase().includes(query);
    return titleMatch || textMatch;
  });

  useEffect(() => {
    fetchObservations();
  }, []);

  return (
    <div>
      <NavigationBar defaultIndex={3} username={user ? user.name : "Guest"} />

      <div className="relative flex">
        <div className="p-8 bg-light-orange/30 min-h-screen min-w-full">
          <h1 className="text-3xl font-bold text-dark-orange mb-6 text-center drop-shadow-sm">
            Observations
          </h1>

          {/* TODO: Determine what this will be - a panel to filter observations? */}
          <div className="mb-8 flex flex-wrap items-end gap-4 rounded-2xl bg-light-orange/40 p-5 shadow-lg backdrop-blur-sm">
            {/* Tank numnber dropdown menu */}
            <div className="min-w-[160px]">
              <label className="block text-dark-orange font-bold mb-2 text-sm">
                Tank
              </label>
              <select
                value={tankNumber}
                onChange={(e) => setTankNumber(e.target.value)}
                className="w-full rounded-xl bg-white p-2.5 text-sm font-medium text-gray focus:outline-none focus:ring-2 focus:ring-light-orange shadow-sm transition-all"
              >
                <option value="">Select tank...</option>
                {Array.from({ length: 9 }, (_, i) => i + 1).map((num) => (
                  <option key={num} value={num}>
                    {num}
                  </option>
                ))}
              </select>
            </div>

            {/* coral dropdown */}
            <div className="min-w-[180px]">
              <label className="block text-dark-orange font-bold mb-2 text-sm">
                Coral Type
              </label>
              <select
                value={coralType}
                onChange={(e) => setCoralType(e.target.value)}
                className="w-full rounded-xl bg-white p-2.5 text-sm font-medium text-gray focus:outline-none focus:ring-2 focus:ring-light-orange shadow-sm transition-all"
              >
                <option value="">Select coral type...</option>
                {coralTypes.map((type, index) => (
                  <option key={`${type}-${index}`} value={type}>
                    {type}
                  </option>
                ))}
              </select>
            </div>

            {/* time input*/}
            <div className="min-w-[160px]">
              <label className="block text-dark-orange font-bold mb-2 text-sm">
                Time
              </label>
              <input
                type="time"
                value={observationTime}
                onChange={(e) => setObservationTime(e.target.value)}
                className="w-full rounded-xl bg-white p-2.5 text-sm font-medium text-gray focus:outline-none focus:ring-2 focus:ring-light-orange shadow-sm transition-all"
              />
            </div>

            {/* button to open notepad */}
            <button
              type="button"
              onClick={() => setIsNotepadVisible((prev) => !prev)}
              className="ml-auto flex h-12 w-12 items-center justify-center rounded-full bg-dark-orange text-2xl font-bold text-white shadow-lg transition-all hover:scale-110 hover:shadow-xl hover:bg-orange"
              aria-label={isNotepadVisible ? "Hide notepad" : "Open notepad"}
            >
              {isNotepadVisible ? "−" : "+"}
            </button>
          </div>

          {/* layout of page*/}
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
            {/* placeholder saved observations */}
            <div className="space-y-4">
              <h2 className="text-xl font-bold text-dark-orange mb-4">
                Recent Observations
              </h2>
              {/* Search Bar */}
              <div className="mb-4">
                <input
                  type="text"
                  placeholder="Search observations..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full rounded-xl bg-white p-3 text-sm font-medium text-gray focus:outline-none focus:ring-2 focus:ring-light-orange shadow-sm transition-all"
                />
              </div>
              <div className="space-y-4 max-h-[600px] overflow-y-auto">
                {isLoadingObservations ? (
                  <div className="rounded-lg bg-white/90 p-3.5 shadow-lg border border-light-orange/20">
                    <p className="text-sm text-gray/90 text-center py-4">
                      Loading observations...
                    </p>
                  </div>
                ) : filteredObservations.length === 0 ? (
                  <div className="rounded-lg bg-white/90 p-3.5 shadow-lg border border-light-orange/20">
                    <p className="text-sm text-gray/90 text-center py-4">
                      {searchQuery
                        ? "No observations found matching your search."
                        : "No observations yet. Create your first observation using the notepad!"}
                    </p>
                  </div>
                ) : (
                  filteredObservations.map((obs, index) => {
                    return (
                      <div
                        key={obs.observationId}
                        className="rounded-lg bg-white/90 p-3.5 shadow-lg border border-light-orange/20"
                      >
                        <div className="flex items-start justify-between mb-2.5">
                          <h3 className="text-base font-semibold text-dark-orange">
                            {obs.observationTitle}
                          </h3>
                          <div className="flex flex-col">
                            <span className="text-xs text-medium-gray/80 whitespace-nowrap ml-2">
                              {obs.author}
                            </span>
                            <span className="text-xs text-medium-gray/80 whitespace-nowrap ml-2">
                              {obs.datetime ? formatDate(obs.datetime) : ""}
                            </span>
                          </div>
                        </div>

                        {/* FIXME: unnecessary conditional? */}
                        {obs.observationText && (
                          <p className="text-sm text-gray/90 mt-2 line-clamp-3 leading-relaxed">
                            {obs.observationText}
                          </p>
                        )}
                      </div>
                    );
                  })
                )}
              </div>
            </div>

            {/* notepad */}
            {isNotepadVisible && <ObservationNotepad></ObservationNotepad>}
          </div>
        </div>
      </div>
    </div>
  );
}
