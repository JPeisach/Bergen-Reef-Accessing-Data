"use client";
import { useState } from "react";
import { useUser } from "@auth0/nextjs-auth0/client";
import "../globals.css";
import NavigationBar from "../components/NavigationBar";

export default function Page() {
  const { user } = useUser();
  const [tankNumber, setTankNumber] = useState("");

  // actual info will replace this later
  const getTankInfo = (tankNum: string) => {
    if (!tankNum) return null;
    return {
      coralTypes: ["Mushroom Coral", "Brain Coral", "Jolene Coral"],
    };
  };

  const getTankImage = (tankNum: string) => {
    switch (tankNum) {
      case "2":
        return "https://www.thesprucepets.com/thmb/M22UH3-0kR74sgHT91kkUn4wKco=/3100x0/filters:no_upscale():strip_icc()/GettyImages-1413740339-5aea18fdc25b41039fa8dc91d687f527.jpg";
      case "3":
        return "https://cdn11.bigcommerce.com/s-15h88fcyw7/product_images/uploaded_images/fishtanksdirect-136796-were-they-made-blogbanner1.jpg";
      case "4":
        return "https://i.pinimg.com/474x/f9/31/06/f93106fa1161221adf0d6761b82cca5f.jpg";
      default:
        // Default image (Tank 1 and others)
        return "https://www.hepper.com/wp-content/uploads/2022/09/saltwater-tank-clownfish-tropical-fish-coral_Vojce_Shutterstock.jpg";
    }
  };

  const tankInfo = getTankInfo(tankNumber);

  return (
    <div>
      <NavigationBar defaultIndex={4} username={user ? user.name : "Guest"} />

      <div className="relative flex">
        {/* Content */}
        <div className="p-8 bg-light-orange/30 min-h-screen min-w-full">
          <h1 className="text-3xl font-bold text-dark-orange mb-6 text-center drop-shadow-sm">
            Tank Information
          </h1>

          {/* Tank Number Dropdown */}
          <div className="mb-8 flex flex-wrap items-end gap-4 rounded-2xl bg-light-orange/40 p-5 shadow-lg backdrop-blur-sm">
            <div className="min-w-[200px]">
              <label className="block text-dark-orange font-bold mb-2 text-sm">
                Tank Number
              </label>
              <select
                value={tankNumber}
                onChange={(e) => setTankNumber(e.target.value)}
                className="w-full rounded-xl bg-white p-2.5 text-sm font-medium text-gray focus:outline-none focus:ring-2 focus:ring-light-orange shadow-sm transition-all"
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
                <h2 className="text-xl font-bold text-dark-orange mb-4">
                  Tank {tankNumber} Picture
                </h2>
                <div className="rounded-2xl bg-white/90 p-4 shadow-xl border border-light-orange/20 flex flex-col items-center justify-center min-h-[300px] overflow-hidden">
                  <img
                    src={getTankImage(tankNumber)}
                    alt={`Tank ${tankNumber} coral reef aquarium`}
                    className="w-full h-auto object-cover rounded-xl mb-4"
                  />
                  <p className="text-dark-orange font-bold text-lg text-center">
                    2/3/2026
                  </p>
                </div>
              </div>

              {/* Coral Types Information */}
              <div>
                <h2 className="text-xl font-bold text-dark-orange mb-4">
                  Coral Types in Tank {tankNumber}
                </h2>
                <div className="rounded-2xl bg-white/90 p-6 shadow-xl border border-light-orange/20">
                  {tankInfo && tankInfo.coralTypes.length > 0 ? (
                    <div className="space-y-3">
                      {tankInfo.coralTypes.map((coralType, index) => (
                        <div
                          key={index}
                          className="rounded-lg bg-light-orange/40 px-4 py-3 text-dark-orange font-semibold shadow-sm border border-light-orange/30"
                        >
                          {coralType}
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-gray font-medium text-center py-4">
                      No coral types available
                    </p>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Placeholder message when no tank is selected */}
          {!tankNumber && (
            <div className="rounded-2xl bg-white/90 p-8 text-center shadow-xl border border-light-orange/20">
              <p className="text-gray font-medium text-lg">
                Select tank number to view information.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
