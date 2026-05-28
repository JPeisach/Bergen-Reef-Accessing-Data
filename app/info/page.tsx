"use client";
import { useState, Fragment } from "react";
import { useUser } from "@auth0/nextjs-auth0/client";
import { Dialog, Transition } from "@headlessui/react";
import "../globals.css";
import NavigationBar from "../components/NavigationBar";

export default function Page() {
  const { user } = useUser();
  const [tankNumber, setTankNumber] = useState("");
  const [selectedCoral, setSelectedCoral] = useState<string | null>(null);

  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const handleUpload = async () => {
    if (!selectedFile || !tankNumber) return;

    if (!user) {
      alert("You must be logged in to submit pictures.");
      return;
    }

    const formData = new FormData();
    formData.append("image", selectedFile);
    formData.append("tankNumber", tankNumber);

    const res = await fetch("/api/uploadImage", {
      method: "POST",
      body: formData,
    });

    if (res.ok) {
      alert("Image uploaded!");
      window.location.reload();
    }
  };

  const coralDetails: { [key: string]: string } = {
    "Mushroom Coral":
      "Mushroom corals are hardy and make ideal corals for the beginner reef aquarist. Mushrooms that have long tentacles are aggressive toward other types of corals, so provide these corals with adequate space.",
    "Brain Coral":
      "Brain corals get their common name from the grooves and channels on their surfaces that look like the folds of the human brain.",
    "Jolene Coral": "Jolene corals are...",
    Empty: "This tank is currently empty.",
    "N/A": "To be filled out by administrator.",
  };

  const getTankInfo = (tankNum: string) => {
    if (!tankNum) return null;
    switch (tankNum) {
      case "1":
      case "7":
      case "8":
      case "9":
        return {
          coralTypes: ["Empty"],
        };
      default:
        return {
          coralTypes: ["N/A"],
        };
    }
  };

  // TODO: Tanks by name, not number
  // // FIXME: Images are guesses - basing off of when EXIF says they were taken
  const getTankImage = (tankNum: string) => {
    return `/api/tankImage/${tankNum}`;
  };

  const tankInfo = getTankInfo(tankNumber);

  return (
    <div className="bg-base-200">
      <NavigationBar defaultIndex={3} username={user ? user.name : "Guest"} />

      <div className="relative flex">
        {/* Content */}
        <div className="p-8 bg-base-200 min-h-screen min-w-full">
          <h1 className="text-3xl font-bold text-primary mb-6 text-center drop-shadow-sm">
            Tank Information
          </h1>

          {/* Tank Number Dropdown */}
          <div className="mb-8 flex flex-wrap items-end gap-4 rounded-2xl bg-base-100 border border-base-300 p-5 shadow-lg backdrop-blur-sm">
            <div className="min-w-[200px]">
              <label className="block text-primary font-bold mb-2 text-sm">
                Tank Number
              </label>
              <select
                value={tankNumber}
                onChange={(e) => setTankNumber(e.target.value)}
                className="w-full rounded-xl bg-base-100 p-2.5 text-sm font-medium text-base-content focus:outline-none focus:ring-2 focus:ring-primary shadow-sm transition-all border border-base-300"
              >
                <option value="">Select tank number...</option>
                {Array.from({ length: 9 }, (_, i) => i + 1).map((num) => (
                  <option key={num} value={num.toString()}>
                    {num}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Tank Information Display */}
          {tankNumber && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Tank Picture */}
              <div>
                <div className="rounded-2xl bg-base-100/90 p-4 shadow-xl border border-base-300 flex flex-col items-center">
                  <img
                    src={getTankImage(tankNumber)}
                    alt={`Tank ${tankNumber} coral reef aquarium`}
                    className="w-full h-auto object-cover rounded-xl mb-4"
                  />

                  {/* TODO: show image date of uploaded image */}
                  <p className="text-primary font-bold text-lg text-center">
                    5/14/2026
                  </p>

                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => {
                      if (e.target.files?.[0]) {
                        setSelectedFile(e.target.files[0]);
                      }
                    }}
                    className="file-input file-input-primary mt-4 mb-4 "
                  />

                  <button
                    type="button"
                    onClick={() => {
                      handleUpload();
                    }}
                    className={
                      selectedFile !== null
                        ? "mt-4 rounded btn btn-info px-4 py-2 cursor-pointer"
                        : "mt-4 rounded btn btn-info btn-disabled px-4 py-2 cursor-pointer"
                    }
                  >
                    Upload Image
                  </button>
                </div>
              </div>
              {/* Coral Types Information */}
              <div>
                <h2 className="text-xl font-bold text-primary mb-4">
                  Coral Types in Tank {tankNumber}
                </h2>
                <div className="rounded-2xl bg-base-100/90 p-6 shadow-xl border border-base-300">
                  {tankInfo && tankInfo.coralTypes.length > 0 ? (
                    <div className="space-y-3">
                      {tankInfo.coralTypes.map((coralType, index) => (
                        <button
                          key={index}
                          onClick={() => setSelectedCoral(coralType)}
                          className="w-full text-left rounded-lg bg-base-200 px-4 py-3 text-primary font-semibold shadow-sm border border-base-300 hover:bg-base-300 hover:scale-[1.02] active:scale-95 transition-all duration-200 cursor-pointer"
                        >
                          {coralType}
                        </button>
                      ))}
                    </div>
                  ) : (
                    <p className="text-base-content/80 font-medium text-center py-4">
                      No coral types available
                    </p>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Placeholder message when no tank is selected */}
          {!tankNumber && (
            <div className="rounded-2xl bg-base-100/90 p-8 text-center shadow-xl border border-base-300">
              <p className="text-base-content/80 font-medium text-lg">
                Select tank number to view information.
              </p>
            </div>
          )}
        </div>
      </div>
      <Transition appear show={!!selectedCoral} as={Fragment}>
        <Dialog
          as="div"
          className="relative z-50"
          onClose={() => setSelectedCoral(null)}
        >
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-black/25 backdrop-blur-xs" />
          </Transition.Child>

          <div className="fixed inset-0 overflow-y-auto">
            <div className="flex min-h-full items-center justify-center p-4 text-center">
              <Transition.Child
                as={Fragment}
                enter="ease-out duration-300"
                enterFrom="opacity-0 scale-95"
                enterTo="opacity-100 scale-100"
                leave="ease-in duration-200"
                leaveFrom="opacity-100 scale-100"
                leaveTo="opacity-0 scale-95"
              >
                <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-2xl bg-base-100 p-6 text-left align-middle shadow-xl transition-all border border-base-300">
                  <Dialog.Title
                    as="h3"
                    className="text-2xl font-bold leading-6 text-primary mb-4"
                  >
                    {selectedCoral}
                  </Dialog.Title>
                  <div className="mt-2">
                    <p className="text-base-content/70">
                      {selectedCoral && coralDetails[selectedCoral]
                        ? coralDetails[selectedCoral]
                        : "Information about this coral type is currently unavailable."}
                    </p>
                  </div>

                  <div className="mt-6 flex justify-end">
                    <button
                      type="button"
                      className="inline-flex justify-center rounded-xl bg-base-200 px-4 py-2 text-sm font-bold text-primary hover:bg-base-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-base-100 transition-colors"
                      onClick={() => setSelectedCoral(null)}
                    >
                      Close
                    </button>
                  </div>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition>
    </div>
  );
}
