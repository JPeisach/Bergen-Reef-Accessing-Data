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
    if (notes.trim() === "") return;

    setStatus("sending");

    const date = new Date();
    // TODO: set date/time info of what the observation is talking about.

    try {
      const response = await fetch("/api/observations", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
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

      // Success - reset form and refresh observations
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
      <div className="w-full space-y-5 rounded-2xl bg-white p-6 shadow-xl backdrop-blur-sm">
        {/* Tank Number */}
        <Field>
          <Label className="mb-2 text-sm font-bold text-dark-orange">
            Tank Number:
          </Label>
          <Select
            name="tankNumber"
            className="text-sm text-gray"
            onChange={(e) => setTankNumber(Number(e.target.value))}
          >
            <option value={1}>1</option>
            <option value={2}>2</option>
            <option value={3}>3</option>
            <option value={4}>4</option>
            <option value={5}>5</option>
            <option value={6}>6</option>
            <option value={7}>7</option>
            <option value={8}>8</option>
            <option value={9}>9</option>
          </Select>
        </Field>

        {/* Observation Title */}

        {/* FIXME: For these inputs, Headless UI doc recommends defining the "name" prop. Should we do this? */}
        <Field>
          <Label className="mb-2 block text-sm font-bold text-dark-orange">
            Observation Title
          </Label>
          <Input
            type="Enter text here..."
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Enter title here..."
            className="w-full rounded-xl bg-white p-3 text-sm font-medium text-gray focus:outline-none focus:ring-2 focus:ring-light-orange shadow-sm transition-all"
          />
        </Field>

        {/* Date Range */}
        <Field>
          <Label className="mb-2 text-sm font-bold text-dark-orange">
            Date Range
          </Label>
          <Flatpickr
            className="w-full bg-white px-2 py-2 text-sm font-medium text-gray focus:outline-none focus:ring-2 focus:ring-light-orange shadow-inner rounded-lg"
            data-enable-time
            options={{ enableSeconds: true, mode: "range" }}
            value={dateRange}
            onChange={(date) => setDateRange(date)}
          />
        </Field>

        {/* Tags Display */}
        <Field>
          <Label className="mb-2 text-sm font-bold text-dark-orange">
            Tags
          </Label>
          {/* TODO: Store these tags in DB, add a way to drop down/select/create tags */}
          <Input
            name="tags"
            className="w-full rounded-xl bg-white resize-none p-3 text-sm font-medium text-gray focus:outline-none focus:ring-2 focus:ring-light-orange shadow-sm transition-all"
            placeholder="Enter a list of tags separated by comma..."
            onChange={(e) => setTags(e.target.value.split(","))}
          ></Input>
        </Field>

        {/* Notes Textbox */}
        <Field>
          <Label className="mb-2 block text-sm font-bold text-dark-orange">
            Notes
          </Label>
          <Textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="Enter any notes here..."
            className="h-64 w-full resize-none rounded-xl bg-white p-4 text-sm font-medium text-gray focus:outline-none focus:ring-2 focus:ring-light-orange shadow-sm transition-all"
          />
        </Field>

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
