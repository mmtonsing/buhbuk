// src/components/MobileVarietyPopover.jsx
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Compass } from "lucide-react";
import { VarietyRedirectButton } from "../VarietyRedirectButton";
import { useState } from "react";

export function MobileVarietyPopover() {
  const [open, setOpen] = useState(false);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <button
          className="flex flex-col items-center text-xs text-stone-300 hover:text-amber-300 transition"
          aria-label="Open Variety Menu"
        >
          <Compass className="h-6 w-6" />
          Variety
        </button>
      </PopoverTrigger>

      <PopoverContent
        className="w-36 p-2 bg-[#2f1f1c] text-stone-200 rounded-xl shadow-lg border border-[#4a2f2b]"
        side="top"
        align="center"
      >
        <div className="flex flex-col gap-1">
          <VarietyRedirectButton
            label="3D Models"
            to="/home3d"
            onClick={() => setOpen(false)}
          />
          <VarietyRedirectButton
            label="Blogs"
            to="/blogs"
            onClick={() => setOpen(false)}
          />
          <VarietyRedirectButton
            label="Graphics"
            to="/graphics"
            onClick={() => setOpen(false)}
          />
        </div>
      </PopoverContent>
    </Popover>
  );
}
