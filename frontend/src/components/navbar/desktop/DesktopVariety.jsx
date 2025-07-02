import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { navigationMenuTriggerStyle } from "@/components/ui/navigation-menu";
import { CategoryRedirectButton } from "../CategoryRedirectButton";
import { ChevronDown } from "lucide-react";
import { useState } from "react";

export function DesktopVariety() {
  const [open, setOpen] = useState(false);

  return (
    <DropdownMenu open={open} onOpenChange={setOpen}>
      <DropdownMenuTrigger
        className={`${navigationMenuTriggerStyle()} text-white gap-2 px-4 py-2 rounded-md text-sm font-medium hover:bg-stone-700 transition`}
      >
        Variety
        <ChevronDown size={16} />
      </DropdownMenuTrigger>
      <DropdownMenuContent className="bg-stone-800 border border-stone-700 rounded-lg text-stone-100 shadow-lg p-1">
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
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
