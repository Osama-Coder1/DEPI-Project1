import { useState } from "react";
import Header from "../components/layout/Header";
import { useOutletContext } from "react-router-dom";
import {
  LuPlus,
  LuSearch,
  LuFilter,
  LuCheck,
  LuClock,
  LuArchive,
} from "react-icons/lu";

const initialTasks = [
  {
    id: 1,
    title: "Finalize Q4 Financial Report",
    dueDate: "Today, 5:00 PM",
    urgency: "urgent",
    category: "Finance",
    completed: false,
  },
  {
    id: 2,
    title: "Review Developer API Documentation",
    dueDate: "Oct 26, 10:00 AM",
    urgency: "medium",
    category: "Projects",
    completed: false,
  },
  {
    id: 3,
    title: "Client Feedback Implementation",
    dueDate: "Tomorrow, 9:00 AM",
    urgency: "urgent",
    category: "Design",
    completed: false,
  },
  {
    id: 4,
    title: "Restock Desk Supplies",
    dueDate: "Oct 30, 2:00 PM",
    urgency: "low",
    category: "Personal",
    completed: false,
  },
];

const categories = ["Work", "Personal", "Study"];

const urgencyStyles = {
  urgent: "bg-accent-red/15 text-accent-red",
  medium: "bg-accent-orange/15 text-accent-orange",
  low: "bg-accent-green/15 text-accent-green",
};

const urgencyBorders = {
  urgent: "border-l-accent-red",
  medium: "border-l-accent-orange",
  low: "border-l-accent-green",
};

export default function TodoList() {
  const { toggleSidebar } = useOutletContext();
  const [tasks, setTasks] = useState(initialTasks);
  const [activeTab, setActiveTab] = useState("pending");
  const [newTask, setNewTask] = useState({
    title: "",
    dueDate: "",
    urgency: "low",
    category: "",
  });

  const toggleTask = (id) => {
    setTasks(
      tasks.map((t) => (t.id === id ? { ...t, completed: !t.completed } : t))
    );
  };

  const addTask = (e) => {
    e.preventDefault();
    if (!newTask.title.trim()) return;
    setTasks([
      ...tasks,
      {
        id: Date.now(),
        ...newTask,
        completed: false,
      },
    ]);
    setNewTask({ title: "", dueDate: "", urgency: "low", category: "" });
  };

  const filteredTasks = tasks.filter((t) => {
    if (activeTab === "pending") return !t.completed;
    if (activeTab === "completed") return t.completed;
    return false;
  });

  const pendingCount = tasks.filter((t) => !t.completed).length;

  return (
    <div>
      <Header
        title="To-Do List"
        subtitle={
          new Date().toLocaleTimeString() +
          " • " +
          new Date().toLocaleDateString()
        }
        onMenuToggle={toggleSidebar}
      />

      <div className="flex flex-col xl:flex-row gap-6">
        {/* Left: New Task Form */}
        <div className="w-full xl:w-[360px] shrink-0">
          <div className="bg-bg-card border border-border rounded-xl p-5 mb-5">
            <div className="flex items-center gap-2 mb-5">
              <LuPlus size={18} />
              <span className="text-base font-semibold">New Task</span>
            </div>
            <form onSubmit={addTask}>
              <div className="mb-4">
                <label className="block text-xs font-medium text-text-muted mb-1.5">
                  Task Title
                </label>
                <input
                  type="text"
                  placeholder="What needs to be done?"
                  className="w-full px-3.5 py-2.5 bg-bg-secondary border border-border rounded-lg text-sm text-text-primary placeholder-text-muted focus:outline-none focus:border-accent-blue"
                  value={newTask.title}
                  onChange={(e) =>
                    setNewTask({ ...newTask, title: e.target.value })
                  }
                />
              </div>
              <div className="flex gap-3 mb-4">
                <div className="flex-1">
                  <label className="block text-xs font-medium text-text-muted mb-1.5">
                    Due Date
                  </label>
                  <input
                    type="date"
                    className="w-full px-3.5 py-2.5 bg-bg-secondary border border-border rounded-lg text-sm text-text-primary focus:outline-none focus:border-accent-blue"
                    value={newTask.dueDate}
                    onChange={(e) =>
                      setNewTask({ ...newTask, dueDate: e.target.value })
                    }
                  />
                </div>
                <div className="flex-1">
                  <label className="block text-xs font-medium text-text-muted mb-1.5">
                    Urgency
                  </label>
                  <select
                    className="w-full px-3.5 py-2.5 bg-bg-secondary border border-border rounded-lg text-sm text-text-primary focus:outline-none focus:border-accent-blue"
                    value={newTask.urgency}
                    onChange={(e) =>
                      setNewTask({ ...newTask, urgency: e.target.value })
                    }
                  >
                    <option value="low">Low</option>
                    <option value="medium">Medium</option>
                    <option value="urgent">Urgent</option>
                  </select>
                </div>
              </div>
              <div className="mb-5">
                <label className="block text-xs font-medium text-text-muted mb-1.5">
                  Category (Optional)
                </label>
                <div className="flex gap-2">
                  {categories.map((cat) => (
                    <button
                      key={cat}
                      type="button"
                      className={`px-3.5 py-1.5 rounded-lg text-xs font-medium border cursor-pointer transition-all ${
                        newTask.category === cat
                          ? "bg-accent-blue text-white border-accent-blue"
                          : "border-border text-text-secondary hover:bg-bg-card hover:text-text-primary"
                      }`}
                      onClick={() =>
                        setNewTask({
                          ...newTask,
                          category: newTask.category === cat ? "" : cat,
                        })
                      }
                    >
                      {cat}
                    </button>
                  ))}
                </div>
              </div>
              <button
                type="submit"
                className="w-full py-2.5 bg-gradient-to-r from-accent-blue to-blue-600 text-white rounded-lg text-sm font-semibold cursor-pointer transition-all hover:-translate-y-0.5 hover:shadow-[0_4px_12px_rgba(59,130,246,0.3)]"
              >
                🚀 Create Task
              </button>
            </form>
          </div>

          <div className="bg-bg-card border border-border rounded-xl p-5">
            <div className="text-xs font-semibold uppercase tracking-wide text-text-muted mb-3">
              FOCUS INSIGHT
            </div>
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-bold">84%</span>
              <span className="text-accent-green text-sm">+12%</span>
            </div>
            <div className="flex justify-between text-xs text-text-muted mb-2">
              <span>Efficiency Score</span>
              <span>vs last week</span>
            </div>
            <div className="h-1.5 bg-border rounded-full overflow-hidden">
              <div className="w-[84%] h-full bg-accent-green rounded-full" />
            </div>
          </div>
        </div>

        {/* Right: Task List */}
        <div className="flex-1">
          <div className="flex items-center justify-between mb-4">
            <div className="flex gap-1">
              {[
                { key: "pending", label: `Pending Tasks (${pendingCount})`, icon: LuClock },
                { key: "completed", label: "Completed", icon: LuCheck },
                { key: "archived", label: "Archived", icon: LuArchive },
              ].map((tab) => (
                <button
                  key={tab.key}
                  onClick={() => setActiveTab(tab.key)}
                  className={`flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-medium cursor-pointer transition-all border-none ${
                    activeTab === tab.key
                      ? "bg-accent-blue text-white"
                      : "bg-transparent text-text-muted hover:text-text-primary"
                  }`}
                >
                  <tab.icon size={14} />
                  {tab.label}
                </button>
              ))}
            </div>
            <div className="flex gap-2">
              <button className="w-9 h-9 rounded-lg border border-border bg-bg-card text-text-secondary flex items-center justify-center cursor-pointer hover:bg-bg-card-hover hover:text-text-primary">
                <LuFilter size={16} />
              </button>
              <button className="w-9 h-9 rounded-lg border border-border bg-bg-card text-text-secondary flex items-center justify-center cursor-pointer hover:bg-bg-card-hover hover:text-text-primary">
                <LuSearch size={16} />
              </button>
            </div>
          </div>

          <div className="flex flex-col gap-3">
            {filteredTasks.map((task) => (
              <div
                key={task.id}
                className={`bg-bg-card border border-border rounded-xl px-5 py-4 flex items-center gap-4 border-l-[3px] ${urgencyBorders[task.urgency]} hover:border-accent-blue transition-colors`}
              >
                <input
                  type="checkbox"
                  checked={task.completed}
                  onChange={() => toggleTask(task.id)}
                  className="w-5 h-5 rounded cursor-pointer accent-accent-green shrink-0"
                />
                <div className="flex-1">
                  <div
                    className={`text-[0.95rem] font-medium mb-1 ${
                      task.completed
                        ? "line-through opacity-50"
                        : ""
                    }`}
                  >
                    {task.title}
                  </div>
                  <div className="flex items-center gap-3 text-xs text-text-muted">
                    <span className="flex items-center gap-1">
                      <LuClock size={12} /> {task.dueDate}
                    </span>
                    <span className="flex items-center gap-1">
                      📁 {task.category}
                    </span>
                  </div>
                </div>
                <span
                  className={`px-2 py-0.5 rounded text-[0.7rem] font-semibold uppercase ${urgencyStyles[task.urgency]}`}
                >
                  {task.urgency}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
