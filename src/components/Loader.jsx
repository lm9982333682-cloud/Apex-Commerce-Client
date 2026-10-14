
import { LoaderCircle } from "lucide-react";

const Loader = ({
  message = "Loading...",
  fullScreen = false,
  size = "md",
}) => {
  const spinnerSize = {
    sm: 18,
    md: 28,
    lg: 40,
  };

  const iconSize = spinnerSize[size] ?? spinnerSize.md;

  return (
    <div
      role="status"
      aria-live="polite"
      className={`flex flex-col items-center justify-center gap-3 ${
        fullScreen
          ? "min-h-screen bg-[var(--bg-main)]"
          : "w-full py-12"
      }`}
    >
      <LoaderCircle
        size={iconSize}
        className="animate-spin text-[var(--primary)]"
        aria-hidden="true"
      />

      <p className="text-sm font-medium text-[var(--text-secondary)]">
        {message}
      </p>
    </div>
  );
};

export default Loader;
