import { useState, useEffect } from "react";
import { useOutletContext, useNavigate } from "react-router-dom";
import { onAuthStateChanged } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { auth, db } from "../services/firebase";
import Header from "../components/layout/Header";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import { Doughnut } from "react-chartjs-2";
import {
  LuCalendarDays,
  LuRuler,
  LuWeight,
  LuDumbbell,
  LuWallet,
  LuListTodo,
  LuArrowRight,
  LuUser,
  LuClock,
} from "react-icons/lu";

ChartJS.register(ArcElement, Tooltip, Legend);

function calcBMI(weightKg, heightCm) {
  if (!weightKg || !heightCm) return null;
  const heightM = heightCm / 100;
  return weightKg / (heightM * heightM);
}

export default function Dashboard() {
  const { toggleSidebar } = useOutletContext();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState(null);
  const [fitness, setFitness] = useState(null);
  const [finance, setFinance] = useState(null);
  const [todos, setTodos] = useState(null);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (user) => {
      if (user) {
        const [profileSnap, fitnessSnap, financeSnap, todosSnap] = await Promise.all([
          getDoc(doc(db, "users", user.uid)),
          getDoc(doc(db, "fitness", user.uid)),
          getDoc(doc(db, "finance", user.uid)),
          getDoc(doc(db, "todos", user.uid)),
        ]);
        if (profileSnap.exists()) setProfile(profileSnap.data());
        if (fitnessSnap.exists()) setFitness(fitnessSnap.data());
        if (financeSnap.exists()) setFinance(financeSnap.data());
        if (todosSnap.exists()) setTodos(todosSnap.data());
      }
      setLoading(false);
    });
    return () => unsub();
  }, []);

  if (loading) {
    return (
      <div className="px-6 lg:px-10 space-y-8">
        <Header title="Dashboard" subtitle="Life Twin Dashboard" onMenuToggle={toggleSidebar} />
        <p className="text-text-muted">Loading...</p>
      </div>
    );
  }

  const firstName = profile?.name ? profile.name.split(" ")[0] : "there";
  const bmi = fitness ? calcBMI(Number(fitness.weight), Number(fitness.height)) : null;
  const calories = fitness?.weight ? Math.round(Number(fitness.weight) * 29.3) : null;
  const workoutsDone = fitness?.workoutPlan?.filter((w) => w.done).length || 0;
  const workoutsTotal = fitness?.workoutPlan?.length || 0;

  const totalIncome = (finance?.transactions || [])
    .filter((t) => t.type === "income")
    .reduce((sum, t) => sum + t.amount, 0);
  const totalExpense = (finance?.transactions || [])
    .filter((t) => t.type === "expense")
    .reduce((sum, t) => sum + t.amount, 0);
  const balance = totalIncome - totalExpense;

  const allTasks = todos?.tasks || [];
  const pendingTasks = allTasks.filter((t) => !t.completed);
  const completedTasks = allTasks.filter((t) => t.completed);
  const tasksTotal = allTasks.length;

  const financeChartData = {
    labels: ["Income", "Expenses"],
    datasets: [
      {
        data: [totalIncome, totalExpense],
        backgroundColor: ["#22c55e", "#ef4444"],
        borderWidth: 0,
      },
    ],
  };

  const tasksChartData = {
    labels: ["Completed", "Remaining"],
    datasets: [
      {
        data: [completedTasks.length, pendingTasks.length],
        backgroundColor: ["#22c55e", "#f97316"],
        borderWidth: 0,
      },
    ],
  };

  const fitnessChartData = {
    labels: ["Done", "Remaining"],
    datasets: [
      {
        data: [workoutsDone, Math.max(workoutsTotal - workoutsDone, 0)],
        backgroundColor: ["#8b5cf6", "#e2e8f0"],
        borderWidth: 0,
      },
    ],
  };

  return (
    <div className="px-6 lg:px-10 space-y-8">
      <Header title="Dashboard" subtitle="Life Twin Dashboard" onMenuToggle={toggleSidebar} />

      {/* Welcome Banner */}
      <div className="glass-card p-6 flex flex-col md:flex-row md:items-center gap-6">
        <div className="flex items-center gap-4">
          {profile?.photo ? (
            <img
              src={profile.photo}
              alt={profile.name}
              className="w-20 h-20 rounded-full object-cover ring-4 ring-white shadow-lg"
            />
          ) : (
            <div className="w-20 h-20 rounded-full bg-bg-page border border-border flex items-center justify-center shadow-inner">
              <LuUser size={32} className="text-text-muted" />
            </div>
          )}
          <div>
            <h2 className="text-2xl font-bold text-text-primary tracking-tight">
              Welcome, {firstName}! 👋
            </h2>
            {profile?.work && (
              <p className="text-sm text-text-secondary mt-1">{profile.work}</p>
            )}
          </div>
        </div>

        <div className="flex gap-3 md:ml-auto flex-wrap">
          {profile?.age && (
            <div className="flex items-center gap-2 bg-bg-page/70 rounded-xl px-4 py-2.5 border border-border/60">
              <LuCalendarDays size={16} className="text-blue" />
              <div>
                <div className="text-[0.65rem] text-text-muted">Age</div>
                <div className="text-sm font-semibold text-text-primary">{profile.age} Years</div>
              </div>
            </div>
          )}
          {profile?.height && (
            <div className="flex items-center gap-2 bg-bg-page/70 rounded-xl px-4 py-2.5 border border-border/60">
              <LuRuler size={16} className="text-blue" />
              <div>
                <div className="text-[0.65rem] text-text-muted">Height</div>
                <div className="text-sm font-semibold text-text-primary">{profile.height} cm</div>
              </div>
            </div>
          )}
          {profile?.weight && (
            <div className="flex items-center gap-2 bg-bg-page/70 rounded-xl px-4 py-2.5 border border-border/60">
              <LuWeight size={16} className="text-purple" />
              <div>
                <div className="text-[0.65rem] text-text-muted">Weight</div>
                <div className="text-sm font-semibold text-text-primary">{profile.weight} kg</div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Fitness Card - Full Width */}
      <div className="glass-card p-8">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-11 h-11 rounded-xl bg-purple/15 flex items-center justify-center">
            <LuDumbbell size={22} className="text-purple" />
          </div>
          <span className="text-xl font-bold text-text-primary tracking-tight">Fitness Tracker</span>
        </div>

        <div className="flex flex-col lg:flex-row gap-8 items-center">
          <div className="w-full lg:w-56 h-56 shrink-0 relative flex items-center justify-center">
            {workoutsTotal > 0 ? (
              <>
                <Doughnut
                  data={fitnessChartData}
                  options={{ plugins: { legend: { display: false } }, cutout: "70%" }}
                />
                <div className="absolute flex flex-col items-center">
                  <span className="text-2xl font-bold text-text-primary">
                    {workoutsDone}/{workoutsTotal}
                  </span>
                  <span className="text-xs text-text-muted">Workouts</span>
                </div>
              </>
            ) : (
              <div className="text-sm text-text-muted text-center">No workout data yet</div>
            )}
          </div>
          <div className="grid grid-cols-2 gap-6 flex-1 w-full">
            <div className="bg-bg-page/70 border border-border/60 rounded-2xl p-5 transition-all duration-200 hover:shadow-md hover:-translate-y-0.5">
              <div className="text-xs text-text-muted mb-1">Current Weight</div>
              <div className="text-2xl font-bold text-text-primary">{fitness?.weight || "--"} kg</div>
            </div>
            <div className="bg-bg-page/70 border border-border/60 rounded-2xl p-5 transition-all duration-200 hover:shadow-md hover:-translate-y-0.5">
              <div className="text-xs text-text-muted mb-1">BMI</div>
              <div className="text-2xl font-bold text-text-primary">{bmi ? bmi.toFixed(1) : "--"}</div>
            </div>
            <div className="bg-bg-page/70 border border-border/60 rounded-2xl p-5 transition-all duration-200 hover:shadow-md hover:-translate-y-0.5">
              <div className="text-xs text-text-muted mb-1">Calorie Needs</div>
              <div className="text-2xl font-bold text-text-primary">{calories || "--"} kcal</div>
            </div>
            <div className="bg-bg-page/70 border border-border/60 rounded-2xl p-5 transition-all duration-200 hover:shadow-md hover:-translate-y-0.5">
              <div className="text-xs text-text-muted mb-1">Workouts Done</div>
              <div className="text-2xl font-bold text-text-primary">{workoutsDone}/{workoutsTotal}</div>
            </div>
          </div>
        </div>

        <button
          onClick={() => navigate("/fitness")}
          className="mt-6 w-full py-3.5 bg-gradient-to-r from-purple to-purple/80 text-white rounded-2xl text-base font-semibold cursor-pointer flex items-center justify-center gap-2 transition-all duration-200 hover:shadow-lg hover:shadow-purple/30 hover:-translate-y-0.5"
        >
          Open Fitness Tracker <LuArrowRight size={18} />
        </button>
      </div>

      {/* Finance Card - Full Width */}
      <div className="glass-card p-8">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-11 h-11 rounded-xl bg-green/15 flex items-center justify-center">
            <LuWallet size={22} className="text-green" />
          </div>
          <span className="text-xl font-bold text-text-primary tracking-tight">Finance Tracker</span>
        </div>

        <div className="flex flex-col lg:flex-row gap-8 items-center">
          <div className="w-full lg:w-56 h-56 shrink-0 relative flex items-center justify-center">
            {totalIncome > 0 || totalExpense > 0 ? (
              <>
                <Doughnut
                  data={financeChartData}
                  options={{ plugins: { legend: { display: false } }, cutout: "70%" }}
                />
                <div className="absolute flex flex-col items-center">
                  <span className="text-xl font-bold text-text-primary">${balance.toFixed(0)}</span>
                  <span className="text-xs text-text-muted">Balance</span>
                </div>
              </>
            ) : (
              <div className="text-sm text-text-muted text-center">No finance data yet</div>
            )}
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 flex-1 w-full">
            <div className="bg-bg-page/70 border border-border/60 rounded-2xl p-5 transition-all duration-200 hover:shadow-md hover:-translate-y-0.5">
              <div className="text-xs text-text-muted mb-1">Balance</div>
              <div className="text-2xl font-bold text-blue">${balance.toFixed(2)}</div>
            </div>
            <div className="bg-bg-page/70 border border-border/60 rounded-2xl p-5 transition-all duration-200 hover:shadow-md hover:-translate-y-0.5">
              <div className="text-xs text-text-muted mb-1">Total Income</div>
              <div className="text-2xl font-bold text-green">${totalIncome.toFixed(2)}</div>
            </div>
            <div className="bg-bg-page/70 border border-border/60 rounded-2xl p-5 transition-all duration-200 hover:shadow-md hover:-translate-y-0.5">
              <div className="text-xs text-text-muted mb-1">Total Expenses</div>
              <div className="text-2xl font-bold text-red">${totalExpense.toFixed(2)}</div>
            </div>
          </div>
        </div>

        <button
          onClick={() => navigate("/finance")}
          className="mt-6 w-full py-3.5 bg-gradient-to-r from-green to-green-dark text-white rounded-2xl text-base font-semibold cursor-pointer flex items-center justify-center gap-2 transition-all duration-200 hover:shadow-lg hover:shadow-green/30 hover:-translate-y-0.5"
        >
          Open Finance Tracker <LuArrowRight size={18} />
        </button>
      </div>

      {/* To-Do Card - Full Width */}
      <div className="glass-card p-8">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-11 h-11 rounded-xl bg-blue/15 flex items-center justify-center">
            <LuListTodo size={22} className="text-blue" />
          </div>
          <span className="text-xl font-bold text-text-primary tracking-tight">To-Do List</span>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          <div className="w-full lg:w-56 h-56 shrink-0 relative flex items-center justify-center mx-auto">
            {tasksTotal > 0 ? (
              <>
                <Doughnut
                  data={tasksChartData}
                  options={{ plugins: { legend: { display: false } }, cutout: "70%" }}
                />
                <div className="absolute flex flex-col items-center">
                  <span className="text-2xl font-bold text-text-primary">
                    {completedTasks.length}/{tasksTotal}
                  </span>
                  <span className="text-xs text-text-muted">Completed</span>
                </div>
              </>
            ) : (
              <div className="text-sm text-text-muted text-center">No tasks yet</div>
            )}
          </div>

          <div className="flex-1 space-y-5">
            {pendingTasks.length > 0 && (
              <div>
                <div className="text-xs font-semibold uppercase tracking-wide text-text-muted mb-2">
                  Pending ({pendingTasks.length})
                </div>
                <div className="flex flex-col gap-2">
                  {pendingTasks.map((t) => (
                    <div
                      key={t.id}
                      className="flex items-center gap-3 bg-bg-page/70 border border-border/60 rounded-xl px-4 py-3 transition-all duration-200 hover:bg-bg-page hover:shadow-sm"
                    >
                      <LuClock size={14} className="text-orange shrink-0" />
                      <span className="text-sm text-text-primary flex-1">{t.title}</span>
                      <span className="text-xs text-text-muted">{t.dueDate}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {completedTasks.length > 0 && (
              <div>
                <div className="text-xs font-semibold uppercase tracking-wide text-text-muted mb-2">
                  Completed ({completedTasks.length})
                </div>
                <div className="flex flex-col gap-2">
                  {completedTasks.map((t) => (
                    <div
                      key={t.id}
                      className="flex items-center gap-3 bg-bg-page/70 border border-border/60 rounded-xl px-4 py-3 transition-all duration-200 hover:bg-bg-page hover:shadow-sm"
                    >
                      <div className="w-3.5 h-3.5 rounded-full bg-green shrink-0" />
                      <span className="text-sm text-text-muted line-through flex-1">{t.title}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {tasksTotal === 0 && (
              <p className="text-sm text-text-muted">No tasks added yet.</p>
            )}
          </div>
        </div>

        <button
          onClick={() => navigate("/todo")}
          className="mt-6 w-full py-3.5 bg-gradient-to-r from-blue to-blue-dark text-white rounded-2xl text-base font-semibold cursor-pointer flex items-center justify-center gap-2 transition-all duration-200 hover:shadow-lg hover:shadow-blue/30 hover:-translate-y-0.5"
        >
          Open To-Do List <LuArrowRight size={18} />
        </button>
      </div>
    </div>
  );
}