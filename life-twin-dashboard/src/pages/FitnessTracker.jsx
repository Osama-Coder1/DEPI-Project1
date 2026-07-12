import Header from "../components/layout/Header";
import { useOutletContext } from "react-router-dom";

export default function FitnessTracker() {
  const { toggleSidebar } = useOutletContext();
  return (
    <div>
      <Header title="Fitness Tracker" subtitle="Track your health goals" onMenuToggle={toggleSidebar} />
      <div className="bg-bg-card border border-border rounded-xl p-10 text-center">
        <p className="text-text-muted text-lg">Coming Soon — Fitness Tracker Module</p>
      </div>
    </div>
  );
}
