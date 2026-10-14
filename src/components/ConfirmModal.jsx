
import { AlertTriangle, X } from "lucide-react";

const ConfirmModal = ({
  isOpen,
  title = "Are you sure?",
  message = "This action cannot be undone.",
  confirmText = "Confirm",
  cancelText = "Cancel",
  onConfirm,
  onCancel,
  variant = "danger",
  loading = false,
}) => {
  if (!isOpen) return null;

  const isDanger = variant === "danger";

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 p-4"
      onClick={onCancel}
    >
      <div
        role="alertdialog"
        aria-modal="true"
        aria-labelledby="confirm-modal-title"
        aria-describedby="confirm-modal-message"
        className="w-full max-w-md rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-6 shadow-[var(--shadow)]"
        onClick={(event) => event.stopPropagation()}
      >
        {/* Close Button */}
        <div className="flex items-start justify-between gap-4">
          <div
            className={`flex h-12 w-12 items-center justify-center rounded-xl ${
              isDanger
                ? "bg-[var(--danger-bg)] text-[var(--danger)]"
                : "bg-[var(--primary-light)] text-[var(--primary)]"
            }`}
          >
            <AlertTriangle size={24} />
          </div>

          <button
            type="button"
            onClick={onCancel}
            disabled={loading}
            aria-label="Close confirmation modal"
            className="rounded-lg p-2 text-[var(--text-muted)] hover:bg-[var(--surface-subtle)]"
          >
            <X size={20} />
          </button>
        </div>

        {/* Content */}
        <h2
          id="confirm-modal-title"
          className="mt-5 text-xl font-bold text-[var(--text-primary)]"
        >
          {title}
        </h2>

        <p
          id="confirm-modal-message"
          className="mt-2 text-sm leading-6 text-[var(--text-secondary)]"
        >
          {message}
        </p>

        {/* Actions */}
        <div className="mt-6 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
          <button
            type="button"
            onClick={onCancel}
            disabled={loading}
            className="rounded-xl border border-[var(--border)] px-4 py-2.5 text-sm font-semibold text-[var(--text-secondary)] transition-colors hover:bg-[var(--surface-subtle)]"
          >
            {cancelText}
          </button>

          <button
            type="button"
            onClick={onConfirm}
            disabled={loading}
            className={`rounded-xl px-4 py-2.5 text-sm font-semibold text-white transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60 ${
              isDanger
                ? "bg-[var(--danger)]"
                : "bg-[var(--primary)]"
            }`}
          >
            {loading ? "Please wait..." : confirmText}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmModal;
