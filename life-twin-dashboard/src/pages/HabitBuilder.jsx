import Header from "../components/layout/Header";
import { useOutletContext } from "react-router-dom";

export default function HabitBuilder() {
  const { toggleSidebar } = useOutletContext();
  return (
    <div>
      <Header title="Habit Builder" subtitle="Build better habits" onMenuToggle={toggleSidebar} />
      <div className="bg-bg-card border border-border rounded-xl p-10 text-center">
        <p className="text-text-muted text-lg">Coming Soon — Habit Builder Module</p>
      </div>
    </div>
  );
}
