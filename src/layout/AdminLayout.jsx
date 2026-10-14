
import { useState } from "react";
import { Outlet } from "react-router";
import { X } from "lucide-react";
import Sidebar from "../components/Sidebar";
import Header from "../components/Header";

const AdminLayout = () => {
  const [collapsed, setCollapsed] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const closeMobileMenu = () => setMobileMenuOpen(false);

  return (
    <div className="min-h-screen bg-[var(--bg-main)] text-[var(--text-primary)]">
      <div className="flex min-h-screen">
        {/* Desktop Sidebar */}
        <div className="sticky top-0 hidden h-screen shrink-0 lg:block">
          <Sidebar
            collapsed={collapsed}
            onToggle={() => setCollapsed((prev) => !prev)}
          />
        </div>

        {/* Mobile Sidebar Overlay */}
        {mobileMenuOpen && (
          <div className="fixed inset-0 z-50 lg:hidden">
            <button
              type="button"
              onClick={closeMobileMenu}
              aria-label="Close sidebar overlay"
              className="absolute inset-0 h-full w-full bg-black/50"
            />

            <div className="absolute inset-y-0 left-0 z-10 h-full">
              <div className="absolute right-2 top-3 z-20">
                <button
                  type="button"
                  onClick={closeMobileMenu}
                  aria-label="Close sidebar"
                  className="rounded-lg bg-[var(--surface)] p-2 text-[var(--text-primary)] shadow-[var(--shadow)]"
                >
                  <X size={20} />
                </button>
              </div>

              <Sidebar onNavigate={closeMobileMenu} />
            </div>
          </div>
        )}

        {/* Main Content */}
        <div className="min-w-0 flex-1">
          <Header onMenuClick={() => setMobileMenuOpen(true)} />

          <main className="min-h-[calc(100vh-76px)] p-4 sm:p-6 lg:p-8">
            <Outlet />
          </main>
        </div>
      </div>
    </div>
  );
};

export default AdminLayout;
