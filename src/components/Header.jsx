
import { useEffect, useState } from "react";
import {
  Search,
  Bell,
  Sun,
  Moon,
  Menu,
  ChevronDown,
  Settings,
  LogOut,
  UserRound,
} from "lucide-react";
import { Link } from "react-router";

const Header = ({ onMenuClick }) => {
  const [isDark, setIsDark] = useState(
    () => document.documentElement.classList.contains("dark")
  );

  const [showProfile, setShowProfile] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);

  useEffect(() => {
    document.documentElement.classList.toggle("dark", isDark);
  }, [isDark]);

  const toggleTheme = () => setIsDark((prev) => !prev);

  return (
    <header className="sticky top-0 z-30 flex h-[76px] items-center justify-between gap-4 border-b border-[var(--border)] bg-[var(--surface)] px-4 sm:px-6 lg:px-8">
      {/* Left Section */}
      <div className="flex min-w-0 flex-1 items-center gap-3">
        <button
          type="button"
          onClick={onMenuClick}
          className="rounded-lg p-2 text-[var(--text-secondary)] hover:bg-[var(--surface-subtle)] lg:hidden"
          aria-label="Open sidebar"
        >
          <Menu size={22} />
        </button>

        {/* Search */}
        <div className="flex w-full max-w-[420px] items-center gap-3 rounded-xl border border-[var(--border)] bg-[var(--surface-subtle)] px-3 py-2.5">
          <Search
            size={19}
            className="shrink-0 text-[var(--text-muted)]"
          />

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

      {/* Right Section */}
      <div className="flex shrink-0 items-center gap-2 sm:gap-4">
        {/* Theme Toggle */}
        <button
          type="button"
          onClick={toggleTheme}
          title={isDark ? "Switch to light mode" : "Switch to dark mode"}
          aria-label="Toggle theme"
          className="rounded-xl p-2.5 text-[var(--text-secondary)] transition-colors hover:bg-[var(--surface-subtle)]"
        >
          {isDark ? <Sun size={20} /> : <Moon size={20} />}
        </button>

        {/* Notifications */}
        <div className="relative">
          <button
            type="button"
            onClick={() => setShowNotifications((prev) => !prev)}
            aria-label="Notifications"
            className="relative rounded-xl p-2.5 text-[var(--text-secondary)] transition-colors hover:bg-[var(--surface-subtle)]"
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

        {/* Divider */}
        <div className="hidden h-9 w-px bg-[var(--border)] sm:block" />

        {/* Admin Profile */}
        <div className="relative">
          <button
            type="button"
            onClick={() => setShowProfile((prev) => !prev)}
            className="flex items-center gap-2 rounded-xl p-1.5 transition-colors hover:bg-[var(--surface-subtle)] sm:gap-3"
            aria-label="Admin profile menu"
            aria-expanded={showProfile}
          >
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[var(--primary-light)] text-sm font-bold text-[var(--primary)]">
              AD
            </div>

            <div className="hidden text-left sm:block">
              <p className="text-sm font-semibold text-[var(--text-primary)]">
                Admin User
              </p>

              <p className="text-xs text-[var(--text-muted)]">
                Super Admin
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
                to="/profile"
                onClick={() => setShowProfile(false)}
                className="flex items-center gap-3 px-4 py-3 text-sm text-[var(--text-secondary)] hover:bg-[var(--surface-subtle)]"
              >
                <Settings size={17} />
                Settings
              </Link>

              <div className="my-1 border-t border-[var(--border)]" />

              <button
                type="button"
                onClick={() => setShowProfile(false)}
                className="flex w-full items-center gap-3 px-4 py-3 text-sm text-[var(--danger)] hover:bg-[var(--danger-bg)]"
              >
                <LogOut size={17} />
                Sign Out
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
