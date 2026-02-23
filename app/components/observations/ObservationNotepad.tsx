"use client";

import { useState } from "react";

interface ObservationNotepadProps {
  onSave?: () => void | Promise<void>;
}

export default function ObservationNotepad({ onSave }: ObservationNotepadProps) {
  const [title, setTitle] = useState("");
  const [text, setText] = useState("");

  const handleSave = async () => {
    try {
      await fetch("/api/observations", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          authorId: 1,
          datetime: new Date(),
          observationDatetimeStart: new Date(),
          observationDatetimeEnd: new Date(),
          observationTagsArray: [],
          observationText: text,
          observationTitle: title,
          tankNumber: 1,
        }),
      });
      setTitle("");
      setText("");
      if (onSave) await onSave();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="rounded-lg bg-white/90 p-4 shadow-lg border border-light-orange/20">
      <h2 className="font-semibold text-dark-orange mb-2">New Observation</h2>
      <input
        type="text"
        placeholder="Title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        className="w-full mb-2 rounded p-2 border border-gray-300"
      />
      <textarea
        placeholder="Observation text..."
        value={text}
        onChange={(e) => setText(e.target.value)}
        className="w-full rounded p-2 border border-gray-300"
        rows={4}
      />
      <button
        onClick={handleSave}
        className="mt-2 px-4 py-2 bg-dark-orange text-white rounded"
      >
        Save
      </button>
    </div>
  );
}