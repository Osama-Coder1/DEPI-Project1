import Header from "../components/layout/Header";
import { useOutletContext } from "react-router-dom";

export default function PersonalFinance() {
  const { toggleSidebar } = useOutletContext();
  return (
    <div>
      <Header title="Personal Finance" subtitle="Manage your finances" onMenuToggle={toggleSidebar} />
      <div className="bg-bg-card border border-border rounded-xl p-10 text-center">
        <p className="text-text-muted text-lg">Coming Soon — Personal Finance Module</p>
      </div>
    </div>
  );
}
