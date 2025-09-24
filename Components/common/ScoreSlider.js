import React from "react";
import { Slider } from "@/components/ui/slider";

export default function ScoreSlider({ value, onChange, max = 10, step = 1 }) {
  const getSliderColor = (value) => {
    const percentage = (value / max) * 100;
    if (percentage >= 80) return "bg-green-500";
    if (percentage >= 60) return "bg-yellow-500";
    if (percentage >= 40) return "bg-orange-500";
    return "bg-red-500";
  };

  return (
    <div className="space-y-2">
      <Slider
        value={[value]}
        onValueChange={([newValue]) => onChange(newValue)}
        max={max}
        step={step}
        className="relative"
      />
      <div className="flex justify-between text-xs text-slate-400">
        {Array.from({ length: max + 1 }, (_, i) => (
          <span key={i} className={value === i ? "text-slate-600 font-medium" : ""}>
            {i}
          </span>
        ))}
      </div>
    </div>
  );
}