import { useEffect, useState } from "react";

// TODO: Query specific tank data
export default function ObservationList({}) {
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

  useEffect(() => {
    fetchObservations();
  }, []);

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

  return (
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
  );
}
