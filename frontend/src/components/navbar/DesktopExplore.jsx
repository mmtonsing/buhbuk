import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { navigationMenuTriggerStyle } from "@/components/ui/navigation-menu";
import { ExploreRedirectButton } from "./ExploreRedirectButton";
import { ChevronDown } from "lucide-react";
import { useState } from "react";

export function DesktopExplore() {
  const [open, setOpen] = useState(false);

  return (
    <DropdownMenu open={open} onOpenChange={setOpen}>
      <DropdownMenuTrigger
        className={`${navigationMenuTriggerStyle()} text-white gap-2 px-4 py-2 rounded-md text-sm font-medium hover:bg-stone-700 transition`}
      >
        Explore
        <ChevronDown size={16} />
      </DropdownMenuTrigger>
      <DropdownMenuContent className="bg-stone-800 border border-stone-700 rounded-lg text-stone-100 shadow-lg p-1">
        <ExploreRedirectButton
          label="3D Models"
          to="/home3d"
          onClick={() => setOpen(false)}
        />
        <ExploreRedirectButton
          label="Blogs"
          to="/blogs"
          onClick={() => setOpen(false)}
        />
        <ExploreRedirectButton
          label="Graphics"
          to="/graphics"
          onClick={() => setOpen(false)}
        />
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
