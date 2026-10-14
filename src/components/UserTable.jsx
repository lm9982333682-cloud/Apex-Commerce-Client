
import { Link } from "react-router";
import {
  Eye,
  Pencil,
  Trash2,
  UserRound,
} from "lucide-react";
import StatusBadge from "./StatusBadge";

const UserTable = ({
  users = [],
  onEdit,
  onDelete,
}) => {
  const formatDate = (date) => {
    if (!date) return "N/A";

    const parsedDate = new Date(date);

    if (Number.isNaN(parsedDate.getTime())) {
      return "N/A";
    }

    return new Intl.DateTimeFormat("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    }).format(parsedDate);
  };

  return (
    <div className="w-full overflow-hidden rounded-2xl border border-[var(--border)] bg-[var(--surface)] shadow-[var(--shadow)]">
      <div className="w-full overflow-x-auto">
        <table className="w-full min-w-[850px] text-left">
          <thead className="bg-[var(--surface-subtle)]">
            <tr>
              {[
                "User",
                "Role",
                "Joined Date",
                "Status",
                "Actions",
              ].map((heading) => (
                <th
                  key={heading}
                  className="whitespace-nowrap px-5 py-4 text-xs font-semibold uppercase tracking-wider text-[var(--text-muted)]"
                >
                  {heading}
                </th>
              ))}
            </tr>
          </thead>

          <tbody className="divide-y divide-[var(--border)]">
            {users.length > 0 ? (
              users.map((user) => {
                const userId = user._id ?? user.id;
                const userName = user.name ?? "Unnamed User";
                const userEmail = user.email ?? "No email";
                const role = user.role ?? "User";
                const status = user.status ?? "Active";

                const avatar =
                  user.avatar ??
                  user.profileImage ??
                  user.image;

                return (
                  <tr
                    key={userId}
                    className="transition-colors hover:bg-[var(--surface-subtle)]"
                  >
                    {/* User Details */}
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-3">
                        <div className="flex h-11 w-11 shrink-0 items-center justify-center overflow-hidden rounded-full bg-[var(--primary-light)] text-[var(--primary)]">
                          {avatar ? (
                            <img
                              src={avatar}
                              alt={userName}
                              loading="lazy"
                              className="h-full w-full object-cover"
                            />
                          ) : (
                            <UserRound size={21} />
                          )}
                        </div>

                        <div className="min-w-0">
                          <p className="max-w-[220px] truncate text-sm font-semibold text-[var(--text-primary)]">
                            {userName}
                          </p>

                          <p className="mt-1 max-w-[220px] truncate text-xs text-[var(--text-muted)]">
                            {userEmail}
                          </p>
                        </div>
                      </div>
                    </td>

                    {/* Role */}
                    <td className="whitespace-nowrap px-5 py-4">
                      <span className="inline-flex rounded-lg bg-[var(--primary-light)] px-3 py-1.5 text-xs font-semibold capitalize text-[var(--primary)]">
                        {role}
                      </span>
                    </td>

                    {/* Joined Date */}
                    <td className="whitespace-nowrap px-5 py-4 text-sm text-[var(--text-secondary)]">
                      {formatDate(user.createdAt ?? user.joinedAt)}
                    </td>

                    {/* Status */}
                    <td className="px-5 py-4">
                      <StatusBadge status={status} />
                    </td>

                    {/* Actions */}
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-1">
                        <Link
                          to={`/users/${userId}`}
                          title="View user"
                          aria-label={`View ${userName}`}
                          className="rounded-lg p-2 text-[var(--text-secondary)] transition-colors hover:bg-[var(--info-bg)] hover:text-[var(--info)]"
                        >
                          <Eye size={17} />
                        </Link>

                        <button
                          type="button"
                          title="Edit user"
                          aria-label={`Edit ${userName}`}
                          onClick={() => onEdit?.(user)}
                          className="rounded-lg p-2 text-[var(--text-secondary)] transition-colors hover:bg-[var(--primary-light)] hover:text-[var(--primary)]"
                        >
                          <Pencil size={17} />
                        </button>

                        <button
                          type="button"
                          title="Delete user"
                          aria-label={`Delete ${userName}`}
                          onClick={() => onDelete?.(user)}
                          className="rounded-lg p-2 text-[var(--text-secondary)] transition-colors hover:bg-[var(--danger-bg)] hover:text-[var(--danger)]"
                        >
                          <Trash2 size={17} />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })
            ) : (
              <tr>
                <td
                  colSpan={5}
                  className="px-5 py-12 text-center text-sm text-[var(--text-muted)]"
                >
                  No users found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default UserTable;
