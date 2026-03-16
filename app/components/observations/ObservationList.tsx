"use client";

import { useUser } from "@auth0/nextjs-auth0";
import { useEffect, useState } from "react";

// TODO: Query specific tank data
export default function ObservationList({}) {
  const { user } = useUser();

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
  const [searchQuery, setSearchQuery] = useState("");

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

  // TODO: fix typing
  const onDelete = async (obs: any) => {
    if (!user) {
      alert(
        "You must be logged in as the observation author to delete the observation.",
      );
      return;
    }

    // We have to check user exists otherwise we will (probably) end up on an error accessing a property of a null object
    if (user.sub !== obs.authorId) {
      alert(
        "You must be logged in as the observation author to delete the observation.",
      );
    } else {
      await fetch(`/api/observations?id=${obs.observationId}`, {
        method: "DELETE",
      });
    }
    fetchObservations();
  };

  const onEdit = (obs: any) => {
    if (!user) {
      alert(
        "You must be logged in as the observation author to edit the observation.",
      );
      return;
    }

    // We have to check user exists otherwise we will (probably) end up on an error accessing a property of a null object
    if (user.sub !== obs.authorId) {
      alert(
        "You must be logged in as the observation author to edit the observation.",
      );
    } else {
      setEditingId(obs.observationId);
      setEditTitle(obs.observationTitle || "");
      setEditText(obs.observationText || "");
      setEditTags(parseTags(obs.observationTagsArray).join(", "));
    }
  };

  // Only called if user ID matches original author. UI
  // blocks attempts.
  // TODO: Backend should probably verify the User ID!!!
  const editObservation = async (id: number, updates: any) => {
    await fetch("/api/observations", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, ...updates }),
    });
    fetchObservations();
  };

  // User validation shouldn't be needed, UI blocks users from getting to this point.
  const onSave = async (obs: any) => {
    await editObservation(obs.observationId, {
      observationTitle: editTitle,
      observationText: editText,
      observationTagsArray: JSON.stringify(
        editTags
          .split(",")
          .map((t) => t.trim())
          .filter(Boolean),
      ),
    });
    setEditingId(null);
    fetchObservations();
  };

  // TODO: wasn't there some smart way to make it refresh automatically for us?
  useEffect(() => {
    fetchObservations();
  }, []);

  const filteredObservations = observations.filter((obs) => {
    const query = searchQuery.toLowerCase();
    const titleMatch = obs.observationTitle?.toLowerCase().includes(query);
    const textMatch = obs.observationText?.toLowerCase().includes(query);
    return titleMatch || textMatch;
  });

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-bold text-primary-content mb-4">
        Recent Observations
      </h2>

      {/* Search Bar */}
      <div className="mb-4">
        <input
          type="text"
          placeholder="Search observations..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full rounded-xl bg-white p-3 text-sm font-medium text-gray focus:outline-hidden focus:ring-2 focus:ring-light-orange shadow-xs transition-all"
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
          filteredObservations.map((obs) => (
            <div
              key={obs.observationId}
              className="rounded-lg bg-white/90 p-3.5 shadow-lg border border-light-orange/20 overflow-scroll"
            >
              <div className="flex justify-between mb-2.5">
                <div className="flex flex-col w-full">
                  {editingId === obs.observationId ? (
                    <>
                      <input
                        value={editTitle}
                        onChange={(e) => setEditTitle(e.target.value)}
                        className="mb-1 rounded-sm p-1 border border-gray-300"
                      />
                      <textarea
                        value={editText}
                        onChange={(e) => setEditText(e.target.value)}
                        className="rounded-sm p-1 border border-gray-300"
                        rows={3}
                      />
                      <input
                        value={editTags}
                        onChange={(e) => setEditTags(e.target.value)}
                        placeholder="tags, comma, separated"
                        className="mt-1 rounded-sm p-1 border border-gray-300"
                      />
                    </>
                  ) : (
                    <>
                      <h3 className="text-base font-semibold text-primary-content">
                        {obs.observationTitle}
                      </h3>
                      <span className="text-xs text-medium-gray/80">
                        {parseTags(obs.observationTagsArray).join(" ")}
                      </span>
                      {obs.observationText && (
                        <p className="text-sm text-gray/90 mt-2 line-clamp-3 leading-relaxed">
                          {obs.observationText}
                        </p>
                      )}
                    </>
                  )}
                </div>

                <div className="flex flex-col items-end ml-2 text-xs text-medium-gray/80 whitespace-nowrap">
                  <span>{obs.author}</span>
                  <span>{obs.datetime ? formatDate(obs.datetime) : ""}</span>
                </div>
              </div>

              <div className="flex justify-end gap-2 mt-2">
                {editingId === obs.observationId ? (
                  <button
                    onClick={() => onSave(obs)}
                    className="px-3 py-1 bg-green-500 text-white rounded-sm"
                  >
                    Save
                  </button>
                ) : (
                  <button
                    onClick={() => onEdit(obs)}
                    className="px-3 py-1 bg-yellow-500 text-white rounded-sm"
                  >
                    Edit
                  </button>
                )}
                <button
                  onClick={() => onDelete(obs)}
                  className="px-3 py-1 bg-red-500 text-white rounded-sm"
                >
                  Delete
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
