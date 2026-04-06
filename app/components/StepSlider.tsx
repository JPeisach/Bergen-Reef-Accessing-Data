import React, { useState, useEffect } from "react";

interface StepSliderProps {
  value: number;
  onChange: (value: number) => void;
}

const StepSlider: React.FC<StepSliderProps> = ({ value, onChange }) => {
  const [sliderValue, setSliderValue] = useState(value);

  // Update local state when prop value changes
  useEffect(() => {
    setSliderValue(value);
  }, [value]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = Number(e.target.value);
    setSliderValue(newValue);
    onChange(newValue);
  };

  return (
    <div className="w-full bg-accent text-accent-content rounded-xl p-2 m-1 mt-2">
      <div className="ml-4 text-left text-m font-semibold">
        # of Weeks Represented: {sliderValue}
      </div>
      <input
        type="range"
        min="2"
        max="12"
        value={sliderValue}
        onChange={handleChange}
        className="ml-4 w-11/12 h-2 bg-base-300 rounded-lg cursor-pointer accent-primary"
      />
    </div>
  );
};

export default StepSlider;
