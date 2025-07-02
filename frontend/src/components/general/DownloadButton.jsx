import { useState } from "react";
import { Download as DownloadIcon } from "lucide-react";

export function DownloadButton({ files = [], className = "", onStart, onEnd }) {
  const [downloading, setDownloading] = useState(false);

  if (!files.length) return null;

  const handleDownload = async (file) => {
    const url = `/api/file/public/${file.key}`;
    const filename = file.originalName || "model-file";

    try {
      setDownloading(true);
      onStart?.();

      // Attempt using fetch + blob
      const res = await fetch(url);
      if (!res.ok || !res.body) throw new Error("Failed to fetch file");

      const blob = await res.blob();
      const blobUrl = URL.createObjectURL(blob);

      const link = document.createElement("a");
      link.href = blobUrl;
      link.download = filename;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(blobUrl);
    } catch (err) {
      console.warn(
        "⚠️ Fetch failed, falling back to basic anchor download.",
        err
      );
      // Fallback (may fail silently if CORS is blocked)
      const fallback = document.createElement("a");
      fallback.href = url;
      fallback.download = filename;
      document.body.appendChild(fallback);
      fallback.click();
      document.body.removeChild(fallback);
    } finally {
      setDownloading(false);
      onEnd?.();
    }
  };

  return (
    <button
      onClick={() => handleDownload(files[0])}
      className={`flex items-center gap-2 ${className}`}
      disabled={downloading}
    >
      <DownloadIcon className="w-4 h-4 sm:w-5 sm:h-5" />
      {downloading ? "Downloading..." : "Download"}
    </button>
  );
}
