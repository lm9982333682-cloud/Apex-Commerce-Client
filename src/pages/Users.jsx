import { useCallback, useEffect, useMemo, useState } from "react";
import { Link } from "react-router";
import { Users as UsersIcon, UserCheck, UserPlus, ShieldCheck, Eye, RotateCcw, } from "lucide-react";
import { toast } from "react-toastify";

import PageHeader from "../components/PageHeader";
import StatCard from "../components/StatCard";
import SearchBar from "../components/SearchBar";
import Pagination from "../components/Pagination";
import Loader from "../components/Loader";

import { getAllUsers, getUserStats, } from "../services/userService";

const ITEMS_PER_PAGE = 8;

const ROLE_LABELS = {
  user: "Customer",
  seller: "Seller",
  admin: "Admin",
};

const Users = () => {
  const [users, setUsers] = useState([]);
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState("All");
  const [currentPage, setCurrentPage] = useState(1);
  const [isLoading, setIsLoading] = useState(true);

  const [stats, setStats] = useState({
    totalUsers: 0,
    customerUsers: 0,
    sellerUsers: 0,
    adminUsers: 0,
  });

  const [pagination, setPagination] = useState({
    totalUsers: 0,
    totalPages: 1,
    currentPage: 1,
  });

  const fetchUsers = useCallback(async (page = 1, searchValue = "") => {
    try {
      setIsLoading(true);

      const response = await getAllUsers({
        page,
        limit: ITEMS_PER_PAGE,
        search: searchValue.trim(),
      });

      const usersData =
        response?.data?.users ??
        response?.users ??
        (Array.isArray(response?.data) ? response.data : null);

      if (!Array.isArray(usersData)) {
        throw new Error("Invalid users response from server.");
      }

      const paginationData = response?.data?.pagination;

      setUsers(usersData);

      setPagination({
        totalUsers: paginationData?.totalUsers ?? usersData.length,
        totalPages: Math.max(1, paginationData?.totalPages ?? 1),
        currentPage: paginationData?.currentPage ?? page,
      });

      setCurrentPage(paginationData?.currentPage ?? page);
    } catch (error) {
      console.error("Fetch users error:", error.response?.data || error);

      toast.error(
        error.response?.data?.message ||
        error.message ||
        "Failed to fetch users."
      );
    } finally {
      setIsLoading(false);
    }
  }, []);

  const fetchStats = useCallback(async () => {
    try {
      const response = await getUserStats();

      const statsData = response?.data ?? response;

      setStats({
        totalUsers: statsData?.totalUsers ?? 0,
        customerUsers: statsData?.customerUsers ?? 0,
        sellerUsers: statsData?.sellerUsers ?? 0,
        adminUsers: statsData?.adminUsers ?? 0,
      });
    } catch (error) {
      console.error("Fetch user stats error:", error.response?.data || error);

      toast.error(
        error.response?.data?.message ||
        "Failed to fetch user statistics."
      );
    }
  }, []);

  // Initial data
  useEffect(() => {
    fetchUsers(1, "");
    fetchStats();
  }, [fetchUsers, fetchStats]);

  // Backend search with debounce
  useEffect(() => {
    const timer = setTimeout(() => {
      fetchUsers(1, search);
    }, 350);

    return () => clearTimeout(timer);
  }, [search, fetchUsers]);

  // Role filter applies to the fetched page.
  const filteredUsers = useMemo(() => {
    return users.filter((user) => {
      return roleFilter === "All" || user.role === roleFilter;
    });
  }, [users, roleFilter]);

  const formatDate = (date) => {
    if (!date) return "N/A";

    const parsedDate = new Date(date);

    if (Number.isNaN(parsedDate.getTime())) {
      return "N/A";
    }

    return parsedDate.toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  const getInitials = (name = "User") =>
    name
      .trim()
      .split(/\s+/)
      .filter(Boolean)
      .map((part) => part[0])
      .slice(0, 2)
      .join("")
      .toUpperCase() || "U";

  const handleSearch = (value) => {
    setSearch(value);
    setCurrentPage(1);
  };

  const handleRoleChange = (value) => {
    setRoleFilter(value);
    setCurrentPage(1);
  };

  const handlePageChange = (page) => {
    fetchUsers(page, search);
  };

  const handleReset = () => {
    setSearch("");
    setRoleFilter("All");
    setCurrentPage(1);

    // Fetch immediately instead of waiting for the debounce.
    fetchUsers(1, "");
  };

  const hasActiveFilters =
    search.trim() !== "" || roleFilter !== "All";

  if (isLoading && users.length === 0) {
    return <Loader message="Loading users..." />;
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Users"
        description="Manage customers, sellers and admin accounts."
      />

      {/* Summary Cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard
          title="Total Users"
          value={stats.totalUsers}
          icon={UsersIcon}
          trend="All registered accounts"
        />

        <StatCard
          title="Customers"
          value={stats.customerUsers}
          icon={UserCheck}
          trend="All registered customers"
        />

        <StatCard
          title="Sellers"
          value={stats.sellerUsers}
          icon={UserPlus}
          trend="All registered sellers"
        />

        <StatCard
          title="Administrators"
          value={stats.adminUsers}
          icon={ShieldCheck}
          trend="All registered admins"
        />
      </div>

      {/* Users Table */}
      <section className="overflow-hidden rounded-2xl border border-[var(--border)] bg-[var(--surface)]">
        <div className="flex flex-col gap-4 border-b border-[var(--border)] p-5">
          <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
            <div>
              <h2 className="text-lg font-semibold text-[var(--text)]">
                All Users
              </h2>

              <p className="mt-1 text-sm text-[var(--muted)]">
                {filteredUsers.length} users displayed
                {" "}({pagination.totalUsers} matching search)
              </p>
            </div>

            {hasActiveFilters && (
              <button
                type="button"
                onClick={handleReset}
                className="inline-flex items-center justify-center gap-2 rounded-lg border border-[var(--border)] px-3 py-2 text-sm text-[var(--text)] transition hover:bg-[var(--bg)]"
              >
                <RotateCcw size={15} />
                Reset Filters
              </button>
            )}
          </div>

          {/* Search and Role Filter */}
          <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
            <SearchBar
              value={search}
              onChange={handleSearch}
             placeholder="Search name or email..."
            />

            <select
              value={roleFilter}
              onChange={(event) => handleRoleChange(event.target.value)}
              className="w-full rounded-lg border border-[var(--border)] bg-[var(--bg)] px-3 py-2.5 text-sm text-[var(--text)] outline-none focus:border-[var(--primary)]"
            >
              <option value="All">All Roles</option>
              <option value="user">Customer</option>
              <option value="seller">Seller</option>
              <option value="admin">Admin</option>
            </select>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full min-w-[800px] text-left">
            <thead className="bg-[var(--bg)]">
              <tr className="text-xs uppercase tracking-wider text-[var(--muted)]">
                <th className="px-5 py-4 font-medium">User</th>
                <th className="px-5 py-4 font-medium">User ID</th>
                <th className="px-5 py-4 font-medium">Role</th>
                <th className="px-5 py-4 font-medium">Joined Date</th>
                <th className="px-5 py-4 text-right font-medium">
                  Action
                </th>
              </tr>
            </thead>

            <tbody className="divide-y divide-[var(--border)]">
              {filteredUsers.map((user) => (
                <tr
                  key={user._id}
                  className="transition hover:bg-[var(--bg)]"
                >
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-3">
                      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[var(--primary)]/15 text-sm font-semibold text-[var(--primary)]">
                        {getInitials(user.name)}
                      </div>

                      <div className="min-w-0">
                        <p className="font-medium text-[var(--text)]">
                          {user.name || "Unknown User"}
                        </p>

                        <p className="mt-1 break-all text-xs text-[var(--muted)]">
                          {user.email || "N/A"}
                        </p>
                      </div>
                    </div>
                  </td>

                  <td className="px-5 py-4 text-sm text-[var(--muted)]">
                    <span className="block max-w-48 break-all">
                      {user._id}
                    </span>
                  </td>

                  <td className="px-5 py-4">
                    <span className="inline-flex rounded-full border border-[var(--border)] px-2.5 py-1 text-xs font-medium text-[var(--text)]">
                      {ROLE_LABELS[user.role] || user.role || "N/A"}
                    </span>
                  </td>

                  <td className="whitespace-nowrap px-5 py-4 text-sm text-[var(--muted)]">
                    {formatDate(user.createdAt)}
                  </td>

                  <td className="px-5 py-4 text-right">
                    <Link
                      to={`/users/${user._id}`}
                      title="View user details"
                      aria-label={`View ${user.name || "user"} details`}
                      className="inline-flex items-center justify-center rounded-lg border border-[var(--border)] p-2 text-[var(--muted)] transition hover:border-[var(--primary)] hover:text-[var(--primary)]"
                    >
                      <Eye size={17} />
                    </Link>
                  </td>
                </tr>
              ))}

              {filteredUsers.length === 0 && (
                <tr>
                  <td colSpan={5} className="px-5 py-12 text-center">
                    <div className="mx-auto flex max-w-sm flex-col items-center">
                      <UsersIcon
                        size={34}
                        className="mb-3 text-[var(--muted)]"
                      />

                      <h3 className="font-semibold text-[var(--text)]">
                        No users found
                      </h3>

                      <p className="mt-1 text-sm text-[var(--muted)]">
                        Try changing your search or role filter.
                      </p>

                      <button
                        type="button"
                        onClick={handleReset}
                        className="mt-4 rounded-lg bg-[var(--primary)] px-4 py-2 text-sm font-medium text-white"
                      >
                        Clear Filters
                      </button>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {roleFilter === "All" && !search.trim() && (
          <div className="border-t border-[var(--border)] p-4">
            <Pagination
              currentPage={currentPage}
              totalPages={pagination.totalPages}
              onPageChange={handlePageChange}
              totalItems={pagination.totalUsers}
              itemsPerPage={ITEMS_PER_PAGE}
            />
          </div>
        )}

        {isLoading && users.length > 0 && (
          <p className="border-t border-[var(--border)] px-5 py-3 text-sm text-[var(--muted)]">
            Loading users...
          </p>
        )}
      </section>
    </div>
  );
};

export default Users;