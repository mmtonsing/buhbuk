// src/components/MobilecATEGORYPopover.jsx
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Compass } from "lucide-react";
import { CategoryRedirectButton } from "../CategoryRedirectButton";
import { useState } from "react";

export function MobileVarietyPopover() {
  const [open, setOpen] = useState(false);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <button className="flex flex-col items-center text-xs text-stone-300 hover:text-white transition">
          <Compass className="h-6 w-6" />
          Variety
        </button>
      </PopoverTrigger>

      <PopoverContent
        className="w-32 p-2 bg-[#2f1f1c] text-stone-300 rounded-md shadow-lg border border-[#4a2f2b]"
        side="top"
        align="center"
      >
        <div className="flex flex-col gap-2 text-xs">
          <CategoryRedirectButton
            label="3D Models"
            to="/home3d"
            onClick={() => setOpen(false)}
          />
          <CategoryRedirectButton
            label="Blogs"
            to="/blogs"
            onClick={() => setOpen(false)}
          />
          <CategoryRedirectButton
            label="Graphics"
            to="/graphics"
            onClick={() => setOpen(false)}
          />
        </div>
      </PopoverContent>
    </Popover>
  );
}
