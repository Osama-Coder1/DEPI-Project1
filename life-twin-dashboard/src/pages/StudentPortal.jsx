import Header from "../components/layout/Header";
import { useOutletContext } from "react-router-dom";

export default function StudentPortal() {
  const { toggleSidebar } = useOutletContext();
  return (
    <div>
      <Header title="Student Portal" subtitle="Track your academic performance" onMenuToggle={toggleSidebar} />
      <div className="bg-bg-card border border-border rounded-xl p-10 text-center">
        <p className="text-text-muted text-lg">Coming Soon — Student Portal Module</p>
      </div>
    </div>
  );
}
