"use client";

import { useUser } from "@auth0/nextjs-auth0";
import { Field, Input, Label, Select, Textarea } from "@headlessui/react";
import { useState } from "react";
import Flatpickr from "react-flatpickr";
import "flatpickr/dist/themes/confetti.css";

export default function ObservationNotepad({}) {
  const { user } = useUser();
  const [tankNumber, setTankNumber] = useState(1);
  const [title, setTitle] = useState("");
  const [dateRange, setDateRange] = useState([new Date()]);
  const [tags, setTags] = useState<string[]>([]);
  const [notes, setNotes] = useState("");
  const [status, setStatus] = useState("");

  const handleSave = async () => {
    if (!user) {
      alert("You must be logged in to save observations.");
      return;
    }

    if (notes.trim() === "") return;

    setStatus("sending");

    const date = new Date();
    // TODO: set date/time info of what the observation is talking about.

    try {
      const response = await fetch("/api/observations", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          authorId: user.sub,
          tankNumber: tankNumber,
          datetime: date,
          observationText: notes.trim(),
          observationTitle: title.trim(),
          observationDatetimeStart: dateRange[0],
          observationDatetimeEnd:
            dateRange.length > 1 ? dateRange[1] : dateRange[0],
          observationTagsArray: JSON.stringify(tags),
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to save observation");
      }

      setStatus("success");
      setNotes("");
      setTitle("");
      setTags([]);

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
      <div className="w-full space-y-5 rounded-2xl bg-base-100 border border-base-300 p-6 shadow-xl backdrop-blur-sm">
        {/* Tank Number */}
        <Field>
          <Label className="mb-2 text-sm font-bold text-primary">Tank:</Label>
          <Select
            name="tankNumber"
            className="text-sm text-base-content rounded-lg border border-base-300 bg-base-100 px-2 py-1"
            onChange={(e) => setTankNumber(Number(e.target.value))}
          >
            <option value={1}>Tank CoralLab60_1</option>
            <option value={2}>Tank CoralLab60_2</option>
            <option value={3}>Tank CoralLab60_3</option>
            <option value={4}>Tank CoralLab60_4</option>
            <option value={5}>Tank CoralLab60_5</option>
            <option value={6}>Tank CoralLab60_6</option>
            <option value={7}>Tank ESCReef</option>
            <option value={8}>Tank CoralLab380</option>
          </Select>
        </Field>

        {/* Observation Title */}

        {/* FIXME: For these inputs, Headless UI doc recommends defining the "name" prop. Should we do this? */}
        <Field>
          <Label className="mb-2 block text-sm font-bold text-primary">
            Observation Title
          </Label>
          <Input
            type="Enter text here..."
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Enter title here..."
            className="w-full rounded-xl bg-base-100 border border-base-300 p-3 text-sm font-medium text-base-content focus:outline-none focus:ring-2 focus:ring-primary shadow-sm transition-all"
          />
        </Field>

        {/* Date Range */}
        <Field>
          <Label className="mb-2 text-sm font-bold text-primary">
            Date Range
          </Label>
          <Flatpickr
            className="w-full bg-base-100 px-2 py-2 text-sm font-medium text-base-content focus:outline-none focus:ring-2 focus:ring-primary shadow-inner rounded-lg border border-base-300"
            data-enable-time
            options={{ enableSeconds: true, mode: "range" }}
            value={dateRange}
            onChange={(date) => setDateRange(date)}
          />
        </Field>

        {/* Tags Display */}
        <Field>
          <Label className="mb-2 text-sm font-bold text-primary">Tags</Label>
          {/* TODO: Store these tags in DB, add a way to drop down/select/create tags */}
          <Input
            name="tags"
            className="w-full rounded-xl bg-base-100 border border-base-300 resize-none p-3 text-sm font-medium text-base-content focus:outline-none focus:ring-2 focus:ring-primary shadow-sm transition-all"
            placeholder="Enter a list of tags separated by comma..."
            value={tags.join(", ")}
            onChange={(e) =>
              setTags(e.target.value.split(",").map((t) => t.trim()))
            }
          />
        </Field>

        {/* Notes Textbox */}
        <Field>
          <Label className="mb-2 block text-sm font-bold text-primary">
            Notes
          </Label>
          <Textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="Enter any notes here..."
            className="h-64 w-full resize-none rounded-xl bg-base-100 border border-base-300 p-4 text-sm font-medium text-base-content focus:outline-none focus:ring-2 focus:ring-primary shadow-sm transition-all"
          />
        </Field>

        {/* Save Button */}
        <div className="flex flex-col items-end gap-2 pt-2">
          {status === "error" && (
            <p className="text-sm text-error font-medium">
              Failed to save observation.
            </p>
          )}
          {status === "success" && (
            <p className="text-sm text-success font-medium">
              Observation saved successfully!
            </p>
          )}
          <button
            onClick={handleSave}
            className="rounded-xl bg-primary px-8 py-3 text-sm font-bold text-primary-content transition-all hover:scale-105 hover:shadow-lg hover:bg-primary/90 disabled:cursor-not-allowed disabled:bg-base-300 disabled:text-base-content/50 disabled:hover:scale-100 disabled:hover:shadow-none shadow-md"
            disabled={
              notes.trim() === "" || title === "" || status === "sending"
            }
          >
            {status === "sending" ? "Saving..." : "Save"}
          </button>
        </div>
      </div>
    </div>
  );
}
