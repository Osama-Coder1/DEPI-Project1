import { useState, useEffect } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { onAuthStateChanged } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { auth, db } from "../../services/firebase";
import {
  LuLayoutDashboard,
  LuListTodo,
  LuDumbbell,
  LuWallet,
  LuLogOut,
  LuPanelLeftClose,
  LuPanelLeftOpen,
  LuQuote,
} from "react-icons/lu";

const navItems = [
  { to: "/", label: "Dashboard", icon: LuLayoutDashboard },
  { to: "/todo", label: "To-Do List", icon: LuListTodo },
  { to: "/fitness", label: "Fitness Tracker", icon: LuDumbbell },
  { to: "/finance", label: "Personal Finance", icon: LuWallet },
];

export default function Sidebar({ isOpen, onClose, collapsed, onToggleCollapse }) {
  const navigate = useNavigate();
  const [userName, setUserName] = useState("");
  const [userPhoto, setUserPhoto] = useState(null);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (user) => {
      if (user) {
        const snap = await getDoc(doc(db, "users", user.uid));
        if (snap.exists()) {
          setUserName(snap.data().name || user.email);
          setUserPhoto(snap.data().photo || null);
        } else {
          setUserName(user.email);
        }
      }
    });
    return () => unsub();
  }, []);

  return (
    <>
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40 lg:hidden"
          onClick={onClose}
        />
      )}
      <aside
        className={`fixed top-0 left-0 bottom-0 bg-white/90 backdrop-blur-xl border-r border-border z-50 flex flex-col transition-all duration-300 shadow-[4px_0_24px_-8px_rgba(30,41,59,0.08)] ${
          collapsed ? "w-[72px]" : "w-[280px]"
        } ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        } lg:translate-x-0`}
      >
        <div className="px-4 py-5 border-b border-border flex items-center justify-between">
          {!collapsed && (
            <div className="min-w-0">
              <h1 className="text-lg font-bold text-text-primary truncate tracking-tight">
                Life Twin Dashboard
              </h1>
            </div>
          )}
          <button
            onClick={onToggleCollapse}
            className="w-8 h-8 rounded-lg flex items-center justify-center text-text-muted hover:text-text-primary hover:bg-bg-page transition-all duration-200 cursor-pointer shrink-0"
            title={collapsed ? "Expand sidebar" : "Collapse sidebar"}
          >
            {collapsed ? <LuPanelLeftOpen size={18} /> : <LuPanelLeftClose size={18} />}
          </button>
        </div>

        <nav className="flex-1 py-6 px-3 overflow-y-auto">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.to === "/"}
              className={({ isActive }) =>
                `flex items-center gap-4 rounded-xl text-[0.95rem] font-semibold transition-all duration-200 mb-2 ${
                  collapsed ? "justify-center px-3 py-4" : "px-5 py-4"
                } ${
                  isActive
                    ? "bg-gradient-to-r from-blue to-blue-dark text-white shadow-lg shadow-blue/25"
                    : "text-text-secondary hover:bg-bg-page hover:text-text-primary hover:translate-x-0.5"
                }`
              }
              onClick={onClose}
              title={item.label}
            >
              <item.icon size={22} className="shrink-0" />
              {!collapsed && <span className="truncate">{item.label}</span>}
            </NavLink>
          ))}
        </nav>

        {!collapsed && (
          <div className="mx-3 mb-3 px-5 py-5 rounded-2xl bg-bg-page/70 border border-border">
            <LuQuote size={20} className="text-text-muted/40 mb-2" />
            <blockquote className="text-sm font-medium italic text-text-secondary leading-snug mb-1">
              "Precision is the foundation of freedom."
            </blockquote>
            <div className="text-xs text-text-muted">— Marcus Aurelius</div>
          </div>
        )}

        <div className="p-3 border-t border-border">
          <div className={`flex items-center gap-3 mb-3 ${collapsed ? "justify-center" : "px-1"}`}>
            {userPhoto ? (
              <img
                src={userPhoto}
                alt={userName}
                className="w-9 h-9 rounded-full object-cover shrink-0 ring-2 ring-white shadow-md"
              />
            ) : (
              <div className="w-9 h-9 rounded-full bg-gradient-to-br from-blue to-purple flex items-center justify-center text-xs font-semibold text-white shrink-0 shadow-md">
                {userName ? userName.charAt(0).toUpperCase() : "U"}
              </div>
            )}
            {!collapsed && (
              <div className="min-w-0">
                <div className="text-sm font-semibold text-text-primary truncate">
                  {userName || "Loading..."}
                </div>
                <div className="text-[0.65rem] text-green-dark font-medium">
                  Premium Member
                </div>
              </div>
            )}
          </div>
          <button
            className={`flex items-center gap-2 text-sm text-text-muted hover:text-red transition-colors duration-200 bg-transparent border-none cursor-pointer ${
              collapsed ? "justify-center w-full py-2" : "w-full px-1 py-2"
            }`}
            onClick={() => navigate("/login")}
            title="Logout"
          >
            <LuLogOut className="shrink-0" size={18} />
            {!collapsed && <span>Logout</span>}
          </button>
        </div>
      </aside>
    </>
  );
}