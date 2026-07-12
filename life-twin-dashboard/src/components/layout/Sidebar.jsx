import { NavLink, useNavigate } from "react-router-dom";
import {
  LuLayoutDashboard,
  LuListTodo,
  LuDumbbell,
  LuRepeat,
  LuWallet,
  LuGraduationCap,
  LuLogOut,
  LuPanelLeftClose,
  LuPanelLeftOpen,
} from "react-icons/lu";

const navItems = [
  { to: "/", label: "Dashboard", icon: LuLayoutDashboard },
  { to: "/todo", label: "To-Do List", icon: LuListTodo },
  { to: "/fitness", label: "Fitness Tracker", icon: LuDumbbell },
  { to: "/habits", label: "Habit Builder", icon: LuRepeat },
  { to: "/finance", label: "Personal Finance", icon: LuWallet },
  { to: "/student", label: "Student Portal", icon: LuGraduationCap },
];

export default function Sidebar({ isOpen, onClose, collapsed, onToggleCollapse }) {
  const navigate = useNavigate();

  return (
    <>
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={onClose}
        />
      )}
      <aside
        className={`fixed top-0 left-0 bottom-0 bg-bg-secondary border-r border-border z-50 flex flex-col transition-all duration-300 ${
          collapsed ? "w-[72px]" : "w-[260px]"
        } ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        } lg:translate-x-0`}
      >
        {/* Header */}
        <div className="px-4 py-5 border-b border-border flex items-center justify-between">
          {!collapsed && (
            <div className="min-w-0">
              <h1 className="text-xl font-bold text-accent-blue truncate">
                Command Center
              </h1>
              <p className="text-[0.65rem] text-text-muted uppercase tracking-widest mt-0.5">
                Management Suite
              </p>
            </div>
          )}
          <button
            onClick={onToggleCollapse}
            className="w-8 h-8 rounded-lg flex items-center justify-center text-text-muted hover:text-text-primary hover:bg-bg-card transition-colors cursor-pointer shrink-0"
            title={collapsed ? "Expand sidebar" : "Collapse sidebar"}
          >
            {collapsed ? <LuPanelLeftOpen size={18} /> : <LuPanelLeftClose size={18} />}
          </button>
        </div>

        {/* Nav */}
        <nav className="flex-1 py-4 px-2 overflow-y-auto">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.to === "/"}
              className={({ isActive }) =>
                `flex items-center gap-3 rounded-lg text-sm font-medium transition-colors mb-1 ${
                  collapsed ? "justify-center px-2 py-3" : "px-4 py-3"
                } ${
                  isActive
                    ? "bg-accent-blue text-white"
                    : "text-text-secondary hover:bg-bg-card hover:text-text-primary"
                }`
              }
              onClick={onClose}
              title={item.label}
            >
              <item.icon className="text-lg shrink-0" />
              {!collapsed && <span className="truncate">{item.label}</span>}
            </NavLink>
          ))}
        </nav>

        {/* Footer */}
        <div className="p-3 border-t border-border">
          <div className={`flex items-center gap-3 mb-3 ${collapsed ? "justify-center" : "px-1"}`}>
            <div className="w-9 h-9 rounded-full bg-gradient-to-br from-accent-blue to-accent-purple flex items-center justify-center text-xs font-semibold shrink-0">
              U
            </div>
            {!collapsed && (
              <div className="min-w-0">
                <div className="text-sm font-semibold text-text-primary truncate">
                  User
                </div>
                <div className="text-[0.65rem] text-accent-green">
                  Premium Member
                </div>
              </div>
            )}
          </div>
          <button
            className={`flex items-center gap-2 text-sm text-text-muted hover:text-accent-red transition-colors bg-transparent border-none cursor-pointer ${
              collapsed ? "justify-center w-full py-2" : "w-full px-1 py-2"
            }`}
            onClick={() => navigate("/login")}
            title="Logout"
          >
            <LuLogOut className="shrink-0" />
            {!collapsed && <span>Logout</span>}
          </button>
        </div>
      </aside>
    </>
  );
}
