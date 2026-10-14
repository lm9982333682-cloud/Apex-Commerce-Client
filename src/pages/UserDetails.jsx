
import { useEffect, useState } from "react";
import { Link, useParams } from "react-router";
import { ArrowLeft, UserRound, Mail, Phone, CalendarDays, ShieldCheck, ShoppingBag, MapPin, Save, } from "lucide-react";

import PageHeader from "../components/PageHeader";
import { getUserById, updateUserRole } from "../services/userService";

const UserDetails = () => {
  const { id } = useParams();


  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedRole, setSelectedRole] = useState("user");
  const [savingRole, setSavingRole] = useState(false);




  useEffect(() => {
    let isMounted = true;

    const fetchUser = async () => {
      try {
        setLoading(true);
        setError("");

        const response = await getUserById(id);

        if (!response?.data) {
          throw new Error("User details not found.");
        }

        if (isMounted) {
          setUser(response.data);
          setSelectedRole(response.data.role || "user");
        }
      } catch (err) {
        if (isMounted) {
          setUser(null);
          setError(err.response?.data?.message || err.message || "Failed to fetch user details.");
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    if (id) {
      fetchUser();
    } else {
      setError("User ID is missing.");
      setLoading(false);
    }

    return () => {
      isMounted = false;
    };
  }, [id]);

  const formatDate = (date) => {
    if (!date) return "Not available";

    const parsedDate = new Date(date);

    if (Number.isNaN(parsedDate.getTime())) {
      return "Not available";
    }

    return parsedDate.toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "long",
      year: "numeric",
    });
  };

  const getInitials = (name = "") =>
    name.trim().split(/\s+/).filter(Boolean).map((part) => part[0]).slice(0, 2).join("").toUpperCase() || "U";

  const getRoleLabel = (role) => {
    const roles = {
      user: "Customer",
      seller: "Seller",
      admin: "Admin",
    };

    return roles[role] || role || "Not available";
  };

  const getRoleStyle = (role) => {
    const styles = {
      admin: "bg-purple-500/10 text-purple-600",
      seller: "bg-blue-500/10 text-blue-600",
      user: "bg-green-500/10 text-green-600",
    };

    return styles[role] || "bg-[var(--bg)] text-[var(--text)]";
  };


  const handleRoleUpdate = async () => {
    if (!user || selectedRole === user.role) {
      toast.info("Please select a different role.");
      return;
    }

    try {
      setSavingRole(true);

      const response = await updateUserRole(user._id, selectedRole);

      const updatedUser = response?.data ?? response;

      if (!updatedUser?._id) {
        throw new Error("Invalid response from server.");
      }

      setUser(updatedUser);
      setSelectedRole(updatedUser.role);

      toast.success("User role updated successfully.");
    } catch (err) {
      toast.error(err.response?.data?.message || err.message || "Failed to update user role.");
    } finally {
      setSavingRole(false);
    }
  };




  if (loading) {
    return (
      <div className="space-y-6">
        <Link
          to="/users"
          className="inline-flex items-center gap-2 text-sm text-[var(--muted)] hover:text-[var(--primary)]"
        >
          <ArrowLeft size={17} />
          Back to Users
        </Link>

        <PageHeader
          title="User Details"
          description="Loading user information..."
        />

        <div className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] px-6 py-16 text-center">
          <p className="text-sm text-[var(--muted)]">
            Please wait, fetching user details...
          </p>
        </div>
      </div>
    );
  }

  if (error || !user) {
    return (
      <div className="space-y-5">
        <Link
          to="/users"
          className="inline-flex items-center gap-2 text-sm text-[var(--primary)]"
        >
          <ArrowLeft size={17} />
          Back to Users
        </Link>

        <div className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] px-6 py-16 text-center">
          <UserRound
            size={40}
            className="mx-auto mb-3 text-[var(--muted)]"
          />

          <h2 className="text-xl font-semibold text-[var(--text)]">
            User not found
          </h2>

          <p className="mt-2 break-words text-sm text-[var(--muted)]">
            {error || "No user found with this ID."}
          </p>

          <button
            type="button"
            onClick={() => window.location.reload()}
            className="mt-5 rounded-lg bg-[var(--primary)] px-4 py-2 text-sm font-medium text-white"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  const roleLabel = getRoleLabel(user.role);

  return (
    <div className="space-y-6">
      <Link
        to="/users"
        className="inline-flex items-center gap-2 text-sm text-[var(--muted)] transition hover:text-[var(--primary)]"
      >
        <ArrowLeft size={17} />
        Back to Users
      </Link>

      <PageHeader
        title="User Details"
        description="View registered user account information."
      />

      {/* User Profile */}
      <section className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-5 sm:p-7">
        <div className="flex flex-col gap-5 sm:flex-row sm:items-center">
          <div className="flex h-20 w-20 shrink-0 items-center justify-center rounded-2xl bg-[var(--primary)]/15 text-2xl font-bold text-[var(--primary)]">
            {getInitials(user.name)}
          </div>

          <div className="min-w-0 flex-1">
            <h2 className="text-xl font-semibold text-[var(--text)]">
              {user.name}
            </h2>

            <p className="mt-1 break-all text-sm text-[var(--muted)]">
              {user.email}
            </p>

            <div className="mt-3 flex flex-wrap items-center gap-2">
              <span
                className={`rounded-full px-3 py-1 text-xs font-medium ${getRoleStyle(user.role)}`}
              >
                {roleLabel}
              </span>

              <span className="rounded-full border border-[var(--border)] px-3 py-1 text-xs text-[var(--muted)]">
                Account status: Not available
              </span>
            </div>
          </div>

          <div className="rounded-xl bg-[var(--bg)] px-4 py-3">
            <p className="text-xs text-[var(--muted)]">User ID</p>
            <p className="mt-1 max-w-48 break-all text-sm font-medium text-[var(--text)]">
              {user._id}
            </p>
          </div>
        </div>
      </section>

      {/* Role Management */}
<section className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-5 sm:p-7">
  <div className="flex items-center gap-3">
    <div className="rounded-lg bg-[var(--primary)]/10 p-2">
      <ShieldCheck
        size={21}
        className="text-[var(--primary)]"
      />
    </div>

    <div>
      <h2 className="font-semibold text-[var(--text)]">
        Role Management
      </h2>
      <p className="mt-1 text-sm text-[var(--muted)]">
        Change this user's account role.
      </p>
    </div>
  </div>

  <div className="mt-5 flex flex-col gap-4 sm:flex-row sm:items-end">
    <div className="flex-1">
      <label
        htmlFor="user-role"
        className="mb-2 block text-sm font-medium text-[var(--text)]"
      >
        Select Role
      </label>

      <select
        id="user-role"
        value={selectedRole}
        onChange={(event) => setSelectedRole(event.target.value)}
        disabled={savingRole}
        className="w-full rounded-lg border border-[var(--border)] bg-[var(--bg)] px-3 py-2.5 text-sm text-[var(--text)] outline-none focus:border-[var(--primary)] disabled:opacity-60"
      >
        <option value="user">Customer</option>
        <option value="seller">Seller</option>
        <option value="admin">Admin</option>
      </select>
    </div>

    <button
      type="button"
      onClick={handleRoleUpdate}
      disabled={savingRole || selectedRole === user.role}
      className="inline-flex items-center justify-center gap-2 rounded-lg bg-[var(--primary)] px-5 py-2.5 text-sm font-medium text-white transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
    >
      <Save size={16} />
      {savingRole ? "Saving..." : "Save Role"}
    </button>
  </div>

  <p className="mt-3 text-xs text-[var(--muted)]">
    Current role: {getRoleLabel(user.role)}
  </p>
</section>





      {/* Statistics */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
        <div className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-5">
          <div className="flex items-center justify-between">
            <p className="text-sm text-[var(--muted)]">Total Orders</p>
            <ShoppingBag
              size={20}
              className="text-[var(--primary)]"
            />
          </div>

          <p className="mt-3 text-xl font-bold text-[var(--text)]">
            Not available
          </p>

          <p className="mt-1 text-xs text-[var(--muted)]">
            Order statistics are not connected yet.
          </p>
        </div>

        <div className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-5">
          <div className="flex items-center justify-between">
            <p className="text-sm text-[var(--muted)]">Total Spent</p>
            <ShieldCheck
              size={20}
              className="text-[var(--primary)]"
            />
          </div>

          <p className="mt-3 text-xl font-bold text-[var(--text)]">
            Not available
          </p>

          <p className="mt-1 text-xs text-[var(--muted)]">
            Spending statistics are not connected yet.
          </p>
        </div>

        <div className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-5 sm:col-span-2 xl:col-span-1">
          <div className="flex items-center justify-between">
            <p className="text-sm text-[var(--muted)]">Member Since</p>
            <CalendarDays
              size={20}
              className="text-[var(--primary)]"
            />
          </div>

          <p className="mt-3 text-lg font-bold text-[var(--text)]">
            {formatDate(user.createdAt)}
          </p>
        </div>
      </div>

      {/* Account Information */}
      <section className="rounded-2xl border border-[var(--border)] bg-[var(--surface)]">
        <div className="border-b border-[var(--border)] p-5">
          <h2 className="font-semibold text-[var(--text)]">
            Account Information
          </h2>

          <p className="mt-1 text-sm text-[var(--muted)]">
            Information retrieved from the database
          </p>
        </div>

        <div className="grid grid-cols-1 gap-6 p-5 md:grid-cols-2">
          <div className="flex items-start gap-3">
            <div className="rounded-lg bg-[var(--bg)] p-2">
              <UserRound
                size={19}
                className="text-[var(--primary)]"
              />
            </div>

            <div className="min-w-0">
              <p className="text-xs text-[var(--muted)]">Full Name</p>
              <p className="mt-1 break-words font-medium text-[var(--text)]">
                {user.name || "Not available"}
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <div className="rounded-lg bg-[var(--bg)] p-2">
              <Mail size={19} className="text-[var(--primary)]" />
            </div>

            <div className="min-w-0">
              <p className="text-xs text-[var(--muted)]">Email Address</p>
              <p className="mt-1 break-all font-medium text-[var(--text)]">
                {user.email || "Not available"}
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <div className="rounded-lg bg-[var(--bg)] p-2">
              <Phone size={19} className="text-[var(--primary)]" />
            </div>

            <div>
              <p className="text-xs text-[var(--muted)]">Phone Number</p>
              <p className="mt-1 font-medium text-[var(--text)]">
                Not available
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <div className="rounded-lg bg-[var(--bg)] p-2">
              <MapPin size={19} className="text-[var(--primary)]" />
            </div>

            <div>
              <p className="text-xs text-[var(--muted)]">Address</p>
              <p className="mt-1 text-sm text-[var(--text)]">
                Not available
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <div className="rounded-lg bg-[var(--bg)] p-2">
              <ShieldCheck
                size={19}
                className="text-[var(--primary)]"
              />
            </div>

            <div>
              <p className="text-xs text-[var(--muted)]">Account Role</p>
              <p className="mt-1 font-medium text-[var(--text)]">
                {roleLabel}
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <div className="rounded-lg bg-[var(--bg)] p-2">
              <CalendarDays
                size={19}
                className="text-[var(--primary)]"
              />
            </div>

            <div>
              <p className="text-xs text-[var(--muted)]">
                Registration Date
              </p>
              <p className="mt-1 font-medium text-[var(--text)]">
                {formatDate(user.createdAt)}
              </p>
            </div>
          </div>
        </div>
      </section>




    </div>
  );
};

export default UserDetails;
