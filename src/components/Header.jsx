
import { useEffect, useState } from "react";
import { Search, Bell, Sun, Moon, Menu, ChevronDown, Settings, LogOut, UserRound, } from "lucide-react";
import { Link, useNavigate } from "react-router";
import { useDispatch, useSelector } from "react-redux";
import ConfirmModal from "./ConfirmModal";
import api from "../services/api";
import { logout } from "../store/features/auth/authSlice.js";
import { toast } from "react-toastify";

const Header = ({ onMenuClick }) => {
  const [isDark, setIsDark] = useState(() => localStorage.getItem("theme") === "dark");

  const [showProfile, setShowProfile] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [isLogout, setIsLogout] = useState(false);

  const { user } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    document.documentElement.classList.toggle("dark", isDark);

    localStorage.setItem("theme", isDark ? "dark" : "light");
  }, [isDark]);

  const toggleTheme = () => setIsDark((prev) => !prev);

  const handleLogout = async () => {
    try {
      const res = await api.post("/auth/logout");
      toast.success(res.data.message);

    } catch (error) {
      console.error(
        "Logout API error:",
        error.response?.data || error.message
      );
    } finally {
      // Clear Redux authentication state
      dispatch(logout());

      setIsLogout(false);
      setShowProfile(false);

      // Redirect to login page
      navigate("/login", { replace: true });
    }
  };

  return (
    <header className="sticky top-0 z-30 flex h-[76px] items-center justify-between gap-4 border-b border-[var(--border)] bg-[var(--surface)] px-4 sm:px-6 lg:px-8">
      <div className="flex min-w-0 flex-1 items-center gap-3">
        <button
          type="button"
          onClick={onMenuClick}
          className="rounded-lg p-2 text-[var(--text-secondary)] hover:bg-[var(--surface-subtle)] lg:hidden"
          aria-label="Open sidebar"
        >
          <Menu size={22} />
        </button>

        <div className="flex w-full max-w-[420px] items-center gap-3 rounded-xl border border-[var(--border)] bg-[var(--surface-subtle)] px-3 py-2.5">
          <Search size={19} className="shrink-0 text-[var(--text-muted)]" />

          <input
            type="search"
            placeholder="Search anything..."
            className="w-full min-w-0 border-none bg-transparent text-sm text-[var(--text-primary)] outline-none placeholder:text-[var(--text-muted)]"
          />

          <kbd className="hidden shrink-0 rounded border border-[var(--border)] px-1.5 py-0.5 text-xs text-[var(--text-muted)] sm:block">
            /
          </kbd>
        </div>
      </div>

      <div className="flex shrink-0 items-center gap-2 sm:gap-4">
        <button
          type="button"
          onClick={toggleTheme}
          title={isDark ? "Switch to light mode" : "Switch to dark mode"}
          aria-label="Toggle theme"
          className="rounded-xl p-2.5 text-[var(--text-secondary)] hover:bg-[var(--surface-subtle)]"
        >
          {isDark ? <Sun size={20} /> : <Moon size={20} />}
        </button>

        <div className="relative">
          <button
            type="button"
            onClick={() => setShowNotifications((prev) => !prev)}
            aria-label="Notifications"
            className="relative rounded-xl p-2.5 text-[var(--text-secondary)] hover:bg-[var(--surface-subtle)]"
          >
            <Bell size={20} />
            <span className="absolute right-2 top-2 h-2 w-2 rounded-full bg-[var(--danger)] ring-2 ring-[var(--surface)]" />
          </button>

          {showNotifications && (
            <div className="absolute right-0 top-12 z-50 w-64 rounded-xl border border-[var(--border)] bg-[var(--surface)] p-4 shadow-[var(--shadow)]">
              <h3 className="font-semibold text-[var(--text-primary)]">
                Notifications
              </h3>
              <p className="mt-2 text-sm text-[var(--text-muted)]">
                You are all caught up!
              </p>
            </div>
          )}
        </div>

        <div className="hidden h-9 w-px bg-[var(--border)] sm:block" />

        <div className="relative">
          <button
            type="button"
            onClick={() => setShowProfile((prev) => !prev)}
            className="flex items-center gap-2 rounded-xl p-1.5 hover:bg-[var(--surface-subtle)] sm:gap-3"
            aria-label="Admin profile menu"
            aria-expanded={showProfile}
          >
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[var(--primary-light)] text-2xl font-bold capitalize text-[var(--primary)]">
              {user?.name?.charAt(0) || "U"}
            </div>

            <div className="hidden text-left sm:block">
              <p className="text-sm font-semibold text-[var(--text-primary)]">
                {user?.name || "User"}
              </p>
              <p className="text-xs capitalize text-[var(--text-muted)]">
                {user?.role || "User"}
              </p>
            </div>

            <ChevronDown
              size={16}
              className="hidden text-[var(--text-muted)] sm:block"
            />
          </button>

          {showProfile && (
            <div className="absolute right-0 top-14 z-50 w-52 overflow-hidden rounded-xl border border-[var(--border)] bg-[var(--surface)] py-2 shadow-[var(--shadow)]">
              <Link
                to="/profile"
                onClick={() => setShowProfile(false)}
                className="flex items-center gap-3 px-4 py-3 text-sm text-[var(--text-secondary)] hover:bg-[var(--surface-subtle)]"
              >
                <UserRound size={17} />
                My Profile
              </Link>

              <Link
                to="/settings"
                onClick={() => setShowProfile(false)}
                className="flex items-center gap-3 px-4 py-3 text-sm text-[var(--text-secondary)] hover:bg-[var(--surface-subtle)]"
              >
                <Settings size={17} />
                Settings
              </Link>

              <div className="my-1 border-t border-[var(--border)]" />

              <button
                type="button"
                onClick={() => {
                  setShowProfile(false);
                  setIsLogout(true);
                }}
                className="flex w-full items-center gap-3 px-4 py-3 text-sm text-[var(--danger)] hover:bg-[var(--danger-bg)]"
              >
                <LogOut size={17} />
                Sign Out
              </button>
            </div>
          )}
        </div>
      </div>

      <ConfirmModal
        isOpen={isLogout}
        title="Sign Out"
        message="Are you sure you want to sign out of your account?"
        confirmText="Sign Out"
        variant="danger"
        onConfirm={handleLogout}
        onCancel={() => setIsLogout(false)}
      />
    </header>
  );
};

export default Header;