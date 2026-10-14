
import { Plus } from "lucide-react";

const PageHeader = ({
  title,
  description,
  actionLabel,
  onAction,
  actionIcon: ActionIcon = Plus,
  children,
}) => {
  return (
    <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
      {/* Title Section */}
      <div className="min-w-0">
        <h1 className="text-2xl font-bold tracking-tight text-[var(--text-primary)] sm:text-3xl">
          {title}
        </h1>

        {description && (
          <p className="mt-2 text-sm leading-6 text-[var(--text-muted)] sm:text-base">
            {description}
          </p>
        )}
      </div>

      {/* Action Section */}
      <div className="flex shrink-0 flex-wrap items-center gap-3">
        {children}

        {actionLabel && (
          <button
            type="button"
            onClick={onAction}
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-[var(--primary)] px-4 py-2.5 text-sm font-semibold text-white shadow-[var(--shadow)] transition-opacity hover:opacity-90"
          >
            <ActionIcon size={18} />
            {actionLabel}
          </button>
        )}
      </div>
    </div>
  );
};

export default PageHeader;
