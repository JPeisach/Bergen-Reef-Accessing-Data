"use client";

import { useEffect, useState } from "react";

export type Observation = {
  observationId: number;
  authorId: number;
  datetime: string | Date;
  observationTitle: string | null;
  observationText: string | null;
  observationTagsArray: string | null;
  author: string;
};

interface ObservationListProps {
  observations?: Observation[];
  onDelete?: (id: number) => void;
  onEdit?: (id: number, updates: Partial<Observation>) => void;
}

export default function ObservationList({
  observations: initialObservations = [],
  onDelete,
  onEdit,
}: ObservationListProps) {
  const [observations, setObservations] = useState<Observation[]>(initialObservations);
  const [searchQuery, setSearchQuery] = useState("");
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editText, setEditText] = useState("");
  const [editTitle, setEditTitle] = useState("");

  useEffect(() => {
    setObservations(initialObservations);
  }, [initialObservations]);

  const formatDate = (date: string | Date) => {
    const tempDate = new Date(date);
    return tempDate.toLocaleDateString() + " at " + tempDate.toLocaleTimeString();
  };

  const startEditing = (obs: Observation) => {
    setEditingId(obs.observationId);
    setEditText(obs.observationText || "");
    setEditTitle(obs.observationTitle || "");
  };

  const saveEdit = async (id: number) => {
    if (onEdit) {
      await onEdit(id, { observationText: editText, observationTitle: editTitle });
    }
    setEditingId(null);
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
        {filteredObservations.length === 0 && (
          <div className="rounded-lg bg-white/90 p-3.5 shadow-lg border border-light-orange/20 text-center text-gray-500">
            {searchQuery
              ? "No observations match your search."
              : "No observations yet."}
          </div>
        )}

        {filteredObservations.map((obs) => (
          <div
            key={obs.observationId}
            className="rounded-lg bg-white/90 p-3.5 shadow-lg border border-light-orange/20"
          >
            <div className="flex justify-between items-start mb-2">
              <div className="flex flex-col w-full">
                {editingId === obs.observationId ? (
                  <>
                    <input
                      type="text"
                      value={editTitle}
                      onChange={(e) => setEditTitle(e.target.value)}
                      className="mb-1 rounded p-1 border border-gray-300"
                    />
                    <textarea
                      value={editText}
                      onChange={(e) => setEditText(e.target.value)}
                      className="rounded p-1 border border-gray-300"
                      rows={3}
                    />
                  </>
                ) : (
                  <>
                    <h3 className="text-base font-semibold text-dark-orange">
                      {obs.observationTitle}
                    </h3>
                    <p className="text-sm text-gray-700 line-clamp-3 mt-1">
                      {obs.observationText}
                    </p>
                  </>
                )}
                {obs.observationTagsArray && (
                  <span className="text-xs text-medium-gray/80 mt-1">
                    {JSON.parse(obs.observationTagsArray, (_, v) => " " + v + " ")}
                  </span>
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
                  onClick={() => saveEdit(obs.observationId)}
                  className="px-3 py-1 bg-green-500 text-white rounded"
                >
                  Save
                </button>
              ) : (
                <button
                  onClick={() => startEditing(obs)}
                  className="px-3 py-1 bg-yellow-500 text-white rounded"
                >
                  Edit
                </button>
              )}
              <button
                onClick={() => onDelete && onDelete(obs.observationId)}
                className="px-3 py-1 bg-red-500 text-white rounded"
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}