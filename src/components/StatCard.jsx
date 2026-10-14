
import {
  TrendingUp,
  TrendingDown,
  DollarSign,
} from "lucide-react";

const StatCard = ({
  title,
  value,
  change,
  trend = "up",
  icon: Icon = DollarSign,
  description = "Compared to last month",
}) => {
  const isPositive = trend === "up";

  return (
    <div className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-5 shadow-[var(--shadow)] transition-transform duration-200 hover:-translate-y-1 sm:p-6">
      {/* Top Section */}
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="text-sm font-medium text-[var(--text-secondary)]">
            {title}
          </p>

          <h3 className="mt-3 break-words text-2xl font-bold tracking-tight text-[var(--text-primary)] sm:text-3xl">
            {value}
          </h3>
        </div>

        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-[var(--primary-light)] text-[var(--primary)]">
          <Icon size={23} />
        </div>
      </div>

      {/* Bottom Section */}
      <div className="mt-5 flex flex-wrap items-center gap-2">
        {change !== undefined && change !== null && (
          <span
            className={`inline-flex items-center gap-1 rounded-lg px-2 py-1 text-xs font-semibold ${
              isPositive
                ? "bg-[var(--success-bg)] text-[var(--success)]"
                : "bg-[var(--danger-bg)] text-[var(--danger)]"
            }`}
          >
            {isPositive ? (
              <TrendingUp size={14} />
            ) : (
              <TrendingDown size={14} />
            )}

            {change}
          </span>
        )}

        <p className="text-xs leading-5 text-[var(--text-muted)]">
          {description}
        </p>
      </div>
    </div>
  );
};

export default StatCard;
