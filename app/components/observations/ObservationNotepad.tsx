import { useUser } from "@auth0/nextjs-auth0";
import { useState } from "react";

export default function ObservationNotepad({}) {
  const { user } = useUser();
  const [title, setTitle] = useState("");
  const [selectedVariables, setSelectedVariables] = useState<string[]>([]);
  const [notes, setNotes] = useState("");

  const [status, setStatus] = useState("");

  const variables = [
    "pH",
    "Calcium",
    "Temperature",
    "Salinity",
    "None of the above",
  ];

  const handleSave = async () => {
    if (notes.trim() === "") return;

    setStatus("sending");

    const date = new Date();
    date.setHours(Number(title.substring(0, 2)));
    date.setMinutes(Number(title.substring(2)));

    try {
      const response = await fetch("/api/observations", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          authorId: user.sub,
          observationText: notes.trim(),
          observationTitle: title.trim(),
          datetime: date,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to save observation");
      }

      // Success - reset form and refresh observations
      setStatus("success");
      setNotes("");
      setTitle("");
      setSelectedVariables([]);

      setTimeout(() => setStatus(""), 3000);
    } catch (error) {
      console.error("Error saving observation:", error);
      setStatus("error");
    } finally {
      setStatus("");
    }
  };

  return (
    <div>
      <div className="w-full space-y-5 rounded-2xl bg-white p-6 shadow-xl backdrop-blur-sm">
        {/* Observation Title */}
        <div>
          <label className="mb-2 block text-sm font-bold text-dark-orange">
            Observation Title
          </label>
          <input
            type="Enter text here..."
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Enter title here..."
            className="w-full rounded-xl bg-white p-3 text-sm font-medium text-gray focus:outline-none focus:ring-2 focus:ring-light-orange shadow-sm transition-all"
          />
        </div>

        {/* Variables Display */}
        <div>
          <p className="mb-2 text-sm font-bold text-dark-orange">Variables</p>
          {selectedVariables.length === 0 ? (
            <p className="text-sm text-medium-gray italic">
              Variables appear here...
            </p>
          ) : (
            <div className="flex flex-wrap gap-2">
              {variables.map((variable) => (
                <span
                  key={variable}
                  className="inline-flex items-center gap-1.5 rounded-full bg-light-orange/50 px-4 py-1.5 text-xs font-bold text-dark-orange shadow-sm"
                >
                  {variable}
                  <button
                    type="button"
                    onClick={() =>
                      setSelectedVariables((prev) =>
                        prev.includes(variable)
                          ? prev.filter((v) => v !== variable)
                          : [...prev, variable],
                      )
                    }
                    className="text-sm text-dark-orange hover:text-orange hover:scale-125 transition-transform font-bold"
                    aria-label={`Remove ${variable}`}
                  >
                    ×
                  </button>
                </span>
              ))}
            </div>
          )}
        </div>

        {/* Notes Textbox */}
        <div>
          <label className="mb-2 block text-sm font-bold text-dark-orange">
            Notes
          </label>
          <textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="observation here"
            className="h-64 w-full resize-none rounded-xl bg-white p-4 text-sm font-medium text-gray focus:outline-none focus:ring-2 focus:ring-light-orange shadow-sm transition-all"
          />
        </div>

        {/* Save Button */}
        <div className="flex flex-col items-end gap-2 pt-2">
          {status === "error" && (
            <p className="text-sm text-red-600 font-medium">
              Failed to save observation.
            </p>
          )}
          {status === "success" && (
            <p className="text-sm text-green-600 font-medium">
              Observation saved successfully!
            </p>
          )}
          <button
            onClick={handleSave}
            className="rounded-xl bg-dark-orange px-8 py-3 text-sm font-bold text-white transition-all hover:scale-105 hover:shadow-lg hover:bg-orange disabled:cursor-not-allowed disabled:bg-medium-gray disabled:hover:scale-100 disabled:hover:shadow-none shadow-md"
            disabled={notes.trim() === "" || status === "sending"}
          >
            {status === "sending" ? "Saving..." : "Save"}
          </button>
        </div>
      </div>
    </div>
  );
}
