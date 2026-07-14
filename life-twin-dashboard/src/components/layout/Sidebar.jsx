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
          className="fixed inset-0 bg-black/40 z-40 lg:hidden"
          onClick={onClose}
        />
      )}
      <aside
        className={`fixed top-0 left-0 bottom-0 bg-bg-card border-r border-border z-50 flex flex-col transition-all duration-300 ${
          collapsed ? "w-[72px]" : "w-[280px]"
        } ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        } lg:translate-x-0`}
      >
        <div className="px-4 py-5 border-b border-border flex items-center justify-between">
          {!collapsed && (
            <div className="min-w-0">
              <h1 className="text-lg font-bold text-text-primary truncate">
                Life Twin Dashboard
              </h1>
            </div>
          )}
          <button
            onClick={onToggleCollapse}
            className="w-8 h-8 rounded-lg flex items-center justify-center text-text-muted hover:text-text-primary hover:bg-bg-page transition-colors cursor-pointer shrink-0"
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
                `flex items-center gap-4 rounded-xl text-xl font-semibold transition-colors mb-3 ${
                  collapsed ? "justify-center px-3 py-5" : "px-5 py-5"
                } ${
                  isActive
                    ? "bg-blue text-white"
                    : "text-text-secondary hover:bg-bg-page hover:text-text-primary"
                }`
              }
              onClick={onClose}
              title={item.label}
            >
              <item.icon size={28} className="shrink-0" />
              {!collapsed && <span className="truncate">{item.label}</span>}
            </NavLink>
          ))}
        </nav>

        {!collapsed && (
          <div className="px-5 py-5 border-t border-border">
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
                className="w-9 h-9 rounded-full object-cover shrink-0"
              />
            ) : (
              <div className="w-9 h-9 rounded-full bg-blue flex items-center justify-center text-xs font-semibold text-white shrink-0">
                {userName ? userName.charAt(0).toUpperCase() : "U"}
              </div>
            )}
            {!collapsed && (
              <div className="min-w-0">
                <div className="text-sm font-semibold text-text-primary truncate">
                  {userName || "Loading..."}
                </div>
                <div className="text-[0.65rem] text-green-dark">
                  Premium Member
                </div>
              </div>
            )}
          </div>
          <button
            className={`flex items-center gap-2 text-sm text-text-muted hover:text-red transition-colors bg-transparent border-none cursor-pointer ${
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