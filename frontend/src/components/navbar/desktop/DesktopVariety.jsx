import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { VarietyRedirectButton } from "../VarietyRedirectButton";
import { ChevronDown } from "lucide-react";
import { useState } from "react";

export function DesktopVariety() {
  const [open, setOpen] = useState(false);

  return (
    <DropdownMenu open={open} onOpenChange={setOpen}>
      <DropdownMenuTrigger className="  flex items-center gap-2 px-4 py-1.5 text-md rounded-lg transition">
        Variety
        <ChevronDown size={16} />
      </DropdownMenuTrigger>

      <DropdownMenuContent className="bg-[#2f1f1c] border border-[#4a2f2b] rounded-xl text-stone-100 shadow-lg p-1 w-40">
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
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
