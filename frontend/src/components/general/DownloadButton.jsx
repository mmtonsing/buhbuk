// components/general/DownloadButton.jsx
import { Download as DownloadIcon } from "lucide-react";

export function DownloadButton({ files = [], className = "" }) {
  if (!files.length) return null;

  const handleDownload = (file) => {
    const link = document.createElement("a");
    link.href = `/api/file/public/${file.key}`;
    link.download = file.originalName || "model-file";
    link.click();
  };

  return (
    <button
      onClick={() => handleDownload(files[0])}
      className={`flex items-center gap-2 ${className}`}
    >
      <DownloadIcon className="w-5 h-5" />
      Download
    </button>
  );
}
