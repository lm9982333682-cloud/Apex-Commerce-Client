
const StatusBadge = ({ status }) => {
  const statusStyles = {
    active: "bg-[var(--success-bg)] text-[var(--success)]",
    completed: "bg-[var(--success-bg)] text-[var(--success)]",
    delivered: "bg-[var(--success-bg)] text-[var(--success)]",

    pending: "bg-[var(--warning-bg)] text-[var(--warning)]",
    processing: "bg-[var(--info-bg)] text-[var(--info)]",

    inactive: "bg-[var(--surface-subtle)] text-[var(--text-muted)]",
    cancelled: "bg-[var(--danger-bg)] text-[var(--danger)]",
    failed: "bg-[var(--danger-bg)] text-[var(--danger)]",
  };

  const normalizedStatus = String(status ?? "")
    .trim()
    .toLowerCase();

  const badgeStyle =
    statusStyles[normalizedStatus] ??
    "bg-[var(--surface-subtle)] text-[var(--text-secondary)]";

  const formattedStatus = normalizedStatus
    ? normalizedStatus.charAt(0).toUpperCase() +
      normalizedStatus.slice(1)
    : "Unknown";

  return (
    <span
      className={`inline-flex items-center gap-2 whitespace-nowrap rounded-full px-3 py-1 text-xs font-semibold ${badgeStyle}`}
    >
      <span className="h-1.5 w-1.5 rounded-full bg-current" />

      {formattedStatus}
    </span>
  );
};

export default StatusBadge;
