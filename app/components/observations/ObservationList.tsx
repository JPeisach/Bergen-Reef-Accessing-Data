import { useEffect, useState } from "react";

// TODO: Query specific tank data
export default function ObservationList({}) {
  const [searchQuery, setSearchQuery] = useState("");

  // TODO: Shared so we don't have to define this twice
  const [observations, setObservations] = useState<
    Array<{
      observationId: number;
      authorId: number;
      datetime: Date;
      observationTitle: string | null;
      observationText: string | null;
      observationTagsArray: string | null;

      // Not in DB
      author: string;
    }>
  >([]);

  const [isLoadingObservations, setIsLoadingObservations] = useState(true);

  const [editingId, setEditingId] = useState<number | null>(null);
  const [editTitle, setEditTitle] = useState("");
  const [editText, setEditText] = useState("");
  const [editTags, setEditTags] = useState("");

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

  const parseTags = (raw: string | null): string[] => {
    if (!raw) return [];
    try {
      const parsed = JSON.parse(raw);
      return Array.isArray(parsed) ? parsed : [];
    } catch {
      return [];
    }
  };

  const startEditing = (obs: any) => {
    setEditTitle(obs.observationTitle || "");
    setEditText(obs.observationText || "");
    setEditTags(parseTags(obs.observationTagsArray).join(", "));
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

      <div className="space-y-4">
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
              >
                        ? JSON.parse(obs.observationTagsArray, (_, value) => {
                            return " " + value + "";
                          })
                        : ""}
                    </span>
                  </div>
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
                    {obs.observationText}
                  </p>
              <div className="flex justify-end gap-2 mt-2">
                {editingId === obs.observationId ? (
                )}
                  className="px-3 py-1 bg-red-500 text-white rounded"
              </div>
            );
          })
            </div>
        )}
      </div>
    </div>
  );
}