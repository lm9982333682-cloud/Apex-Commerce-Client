
import { NavLink } from "react-router";
import {
  LayoutDashboard,
  Package,
  ShoppingCart,
  UsersRound,
  Store,
  ChevronLeft,
  UserRound,
} from "lucide-react";

const Sidebar = ({ onNavigate, collapsed = false, onToggle }) => {
  const navItems = [
    {
      name: "Dashboard",
      path: "/",
      icon: LayoutDashboard,
      end: true,
    },
    {
      name: "Products",
      path: "/products",
      icon: Package,
    },
    {
      name: "Orders",
      path: "/orders",
      icon: ShoppingCart,
    },
    {
      name: "Users",
      path: "/users",
      icon: UsersRound,
    },

    {
      name: "My Profile",
      path: "/profile",
      icon: UserRound,
    }
  ];

  return (
    <aside
      className={`relative flex h-full min-h-screen shrink-0 flex-col border-r border-[var(--border)] bg-[var(--sidebar-bg)] transition-all duration-300 ${collapsed ? "w-[76px]" : "w-[260px]"
        }`}
    >
      {/* Logo */}
      <div className="flex h-[76px] items-center gap-3 border-b border-[var(--border)] px-5">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[var(--primary)] text-white">
          <Store size={22} />
        </div>

        {!collapsed && (
          <div className="min-w-0">
            <h2 className="truncate text-lg font-bold text-[var(--text-primary)]">
              Apex Commerce
            </h2>
            <p className="text-xs text-[var(--text-muted)]">
              Admin Panel
            </p>
          </div>
        )}
      </div>

      {/* Navigation */}
      <nav className="flex-1 space-y-2 overflow-y-auto px-3 py-6">
        {!collapsed && (
          <p className="mb-4 px-3 text-xs font-semibold uppercase tracking-wider text-[var(--text-muted)]">
            Main Menu
          </p>
        )}

        {navItems.map(({ name, path, icon: Icon, end }) => (
          <NavLink
            key={path}
            to={path}
            end={end}
            title={collapsed ? name : undefined}
            onClick={onNavigate}
            className={({ isActive }) =>
              `group flex items-center gap-3 rounded-xl px-3 py-3 text-sm font-medium transition-colors ${isActive
                ? "bg-[var(--primary)] text-white shadow-[var(--shadow)]"
                : "text-[var(--text-secondary)] hover:bg-[var(--surface)] hover:text-[var(--text-primary)]"
              } ${collapsed ? "justify-center" : ""}`
            }
          >
            <Icon size={20} className="shrink-0" />

            {!collapsed && <span>{name}</span>}
          </NavLink>
        ))}
      </nav>

      {/* Collapse Button */}
      {onToggle && (
        <div className="border-t border-[var(--border)] p-3">
          <button
            type="button"
            onClick={onToggle}
            className="flex w-full items-center justify-center gap-2 rounded-xl p-3 text-sm text-[var(--text-secondary)] transition-colors hover:bg-[var(--surface)]"
            aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
          >
            <ChevronLeft
              size={18}
              className={`transition-transform ${collapsed ? "rotate-180" : ""
                }`}
            />

            {!collapsed && <span>Collapse Sidebar</span>}
          </button>
        </div>
      )}
    </aside>
  );
};

export default Sidebar;
