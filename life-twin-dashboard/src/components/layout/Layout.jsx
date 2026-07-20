import { useState } from "react";
import { Outlet } from "react-router-dom";
import Sidebar from "./Sidebar";

export default function Layout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [collapsed, setCollapsed] = useState(false);

  return (
    <div className="app-bg min-h-screen">
      <Sidebar
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        collapsed={collapsed}
        onToggleCollapse={() => setCollapsed((prev) => !prev)}
      />
      <main
        className="min-h-screen transition-[padding] duration-300 ease-in-out relative z-10"
        style={{ paddingLeft: collapsed ? "72px" : "260px" }}
      >
        <div className="app-content p-6 lg:p-8 animate-fade-in-up">
          <Outlet
            context={{ toggleSidebar: () => setSidebarOpen((prev) => !prev) }}
          />
        </div>
      </main>
    </div>
  );
}