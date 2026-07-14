import { useState, useEffect } from "react";
import { useOutletContext } from "react-router-dom";
import { onAuthStateChanged } from "firebase/auth";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { auth, db } from "../services/firebase";
import Header from "../components/layout/Header";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import { Doughnut } from "react-chartjs-2";
import {
  LuPlus,
  LuTrash2,
  LuWallet,
  LuTrendingUp,
  LuTrendingDown,
} from "react-icons/lu";

ChartJS.register(ArcElement, Tooltip, Legend);

const categories = ["Food", "Bills", "Entertainment", "Transport", "Other"];

const categoryColors = {
  Food: "#f97316",
  Bills: "#3b82f6",
  Entertainment: "#8b5cf6",
  Transport: "#06b6d4",
  Other: "#94a3b8",
};

export default function PersonalFinance() {
  const { toggleSidebar } = useOutletContext();
  const [uid, setUid] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [transactions, setTransactions] = useState([]);
  const [form, setForm] = useState({
    type: "expense",
    amount: "",
    category: "Food",
    description: "",
  });

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (user) => {
      if (user) {
        setUid(user.uid);
        const ref = doc(db, "finance", user.uid);
        const snap = await getDoc(ref);
        if (snap.exists() && snap.data().transactions) {
          setTransactions(snap.data().transactions);
        }
      }
      setLoading(false);
    });
    return () => unsub();
  }, []);

  const saveToFirestore = async (updated) => {
    if (!uid) return;
    setSaving(true);
    try {
      await setDoc(doc(db, "finance", uid), { transactions: updated }, { merge: true });
    } catch (err) {
      console.error(err);
    } finally {
      setSaving(false);
    }
  };

  const addTransaction = (e) => {
    e.preventDefault();
    const amt = Number(form.amount);
    if (!amt || amt <= 0) return;
    const updated = [
      {
        id: Date.now(),
        type: form.type,
        amount: amt,
        category: form.type === "income" ? "Income" : form.category,
        description: form.description || (form.type === "income" ? "Income" : form.category),
        date: new Date().toISOString(),
      },
      ...transactions,
    ];
    setTransactions(updated);
    saveToFirestore(updated);
    setForm({ type: "expense", amount: "", category: "Food", description: "" });
  };

  const removeTransaction = (id) => {
    const updated = transactions.filter((t) => t.id !== id);
    setTransactions(updated);
    saveToFirestore(updated);
  };

  const totalIncome = transactions
    .filter((t) => t.type === "income")
    .reduce((sum, t) => sum + t.amount, 0);

  const totalExpense = transactions
    .filter((t) => t.type === "expense")
    .reduce((sum, t) => sum + t.amount, 0);

  const balance = totalIncome - totalExpense;

  const expenseByCategory = categories
    .map((cat) => ({
      category: cat,
      total: transactions
        .filter((t) => t.type === "expense" && t.category === cat)
        .reduce((sum, t) => sum + t.amount, 0),
    }))
    .filter((c) => c.total > 0);

  const chartData = {
    labels: expenseByCategory.map((c) => c.category),
    datasets: [
      {
        data: expenseByCategory.map((c) => c.total),
        backgroundColor: expenseByCategory.map((c) => categoryColors[c.category]),
        borderWidth: 0,
      },
    ],
  };

  if (loading) {
    return (
      <div>
        <Header title="Personal Finance" subtitle="Manage your finances" onMenuToggle={toggleSidebar} />
        <p className="text-text-muted">Loading...</p>
      </div>
    );
  }

  return (
    <div>
      <Header
        title="Personal Finance"
        subtitle="Manage your finances"
        onMenuToggle={toggleSidebar}
      />

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-5">
        <div className="bg-bg-card border border-border rounded-xl p-5">
          <div className="flex items-center gap-2 mb-3">
            <LuWallet className="text-blue" />
            <span className="text-xs font-semibold uppercase tracking-wide text-text-muted">
              Balance
            </span>
          </div>
          <div className="text-3xl font-bold text-text-primary">
            ${balance.toFixed(2)}
          </div>
        </div>
        <div className="bg-bg-card border border-border rounded-xl p-5">
          <div className="flex items-center gap-2 mb-3">
            <LuTrendingUp className="text-green" />
            <span className="text-xs font-semibold uppercase tracking-wide text-text-muted">
              Total Income
            </span>
          </div>
          <div className="text-3xl font-bold text-green">
            ${totalIncome.toFixed(2)}
          </div>
        </div>
        <div className="bg-bg-card border border-border rounded-xl p-5">
          <div className="flex items-center gap-2 mb-3">
            <LuTrendingDown className="text-red" />
            <span className="text-xs font-semibold uppercase tracking-wide text-text-muted">
              Total Expenses
            </span>
          </div>
          <div className="text-3xl font-bold text-red">
            ${totalExpense.toFixed(2)}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 mb-5">
        {/* Add Transaction Form */}
        <div className="bg-bg-card border border-border rounded-xl p-5">
          <div className="flex items-center gap-2 mb-5">
            <LuPlus className="text-blue" />
            <span className="text-base font-semibold text-text-primary">
              Add Transaction
            </span>
          </div>
          <form onSubmit={addTransaction}>
            <div className="flex gap-2 mb-4">
              <button
                type="button"
                onClick={() => setForm({ ...form, type: "expense" })}
                className={`flex-1 py-2 rounded-lg text-sm font-semibold cursor-pointer border ${
                  form.type === "expense"
                    ? "bg-red text-white border-red"
                    : "border-border text-text-secondary"
                }`}
              >
                Expense
              </button>
              <button
                type="button"
                onClick={() => setForm({ ...form, type: "income" })}
                className={`flex-1 py-2 rounded-lg text-sm font-semibold cursor-pointer border ${
                  form.type === "income"
                    ? "bg-green text-white border-green"
                    : "border-border text-text-secondary"
                }`}
              >
                Income
              </button>
            </div>

            <div className="mb-4">
              <label className="block text-xs font-medium text-text-muted mb-1.5">
                Amount ($)
              </label>
              <input
                type="number"
                step="0.01"
                className="w-full px-3.5 py-2.5 bg-bg-page border border-border rounded-lg text-sm text-text-primary focus:outline-none focus:border-blue"
                placeholder="e.g. 50"
                value={form.amount}
                onChange={(e) => setForm({ ...form, amount: e.target.value })}
              />
            </div>

            {form.type === "expense" && (
              <div className="mb-4">
                <label className="block text-xs font-medium text-text-muted mb-1.5">
                  Category
                </label>
                <select
                  className="w-full px-3.5 py-2.5 bg-bg-page border border-border rounded-lg text-sm text-text-primary focus:outline-none focus:border-blue"
                  value={form.category}
                  onChange={(e) => setForm({ ...form, category: e.target.value })}
                >
                  {categories.map((cat) => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
              </div>
            )}

            <div className="mb-5">
              <label className="block text-xs font-medium text-text-muted mb-1.5">
                Description (Optional)
              </label>
              <input
                type="text"
                className="w-full px-3.5 py-2.5 bg-bg-page border border-border rounded-lg text-sm text-text-primary focus:outline-none focus:border-blue"
                placeholder="e.g. Grocery shopping"
                value={form.description}
                onChange={(e) => setForm({ ...form, description: e.target.value })}
              />
            </div>

            <button
              type="submit"
              className="w-full py-2.5 bg-blue text-white rounded-lg text-sm font-semibold cursor-pointer hover:bg-blue-dark"
            >
              Add Transaction
            </button>
            {saving && (
              <p className="text-xs text-text-muted mt-2 text-center">Saving...</p>
            )}
          </form>
        </div>

        {/* Expense Breakdown Chart */}
        <div className="bg-bg-card border border-border rounded-xl p-5">
          <div className="text-base font-semibold text-text-primary mb-5">
            Expense Breakdown
          </div>
          {expenseByCategory.length === 0 ? (
            <div className="h-full flex items-center justify-center text-text-muted text-sm py-10">
              No expenses recorded yet
            </div>
          ) : (
            <div className="flex flex-col items-center">
              <div className="w-[200px] h-[200px] mb-4">
                <Doughnut
                  data={chartData}
                  options={{
                    plugins: { legend: { display: false } },
                    cutout: "65%",
                  }}
                />
              </div>
              <div className="flex flex-wrap justify-center gap-3">
                {expenseByCategory.map((c) => (
                  <div key={c.category} className="flex items-center gap-1.5 text-xs">
                    <div
                      className="w-2.5 h-2.5 rounded-full"
                      style={{ backgroundColor: categoryColors[c.category] }}
                    />
                    <span className="text-text-secondary">
                      {c.category} {((c.total / totalExpense) * 100).toFixed(0)}%
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Recent Transactions */}
      <div className="bg-bg-card border border-border rounded-xl p-5">
        <div className="text-base font-semibold text-text-primary mb-5">
          Recent Transactions
        </div>
        {transactions.length === 0 ? (
          <p className="text-text-muted text-sm">No transactions yet</p>
        ) : (
          <div className="flex flex-col gap-2">
            {transactions.map((t) => (
              <div
                key={t.id}
                className="flex items-center gap-3 px-4 py-3 rounded-lg bg-bg-page"
              >
                <div
                  className={`w-9 h-9 rounded-lg flex items-center justify-center shrink-0 ${
                    t.type === "income" ? "bg-green/15 text-green" : "bg-red/15 text-red"
                  }`}
                >
                  {t.type === "income" ? <LuTrendingUp size={16} /> : <LuTrendingDown size={16} />}
                </div>
                <div className="flex-1">
                  <div className="text-sm font-medium text-text-primary">
                    {t.description}
                  </div>
                  <div className="text-xs text-text-muted">
                    {t.category} • {new Date(t.date).toLocaleDateString()}
                  </div>
                </div>
                <span
                  className={`text-sm font-semibold ${
                    t.type === "income" ? "text-green" : "text-red"
                  }`}
                >
                  {t.type === "income" ? "+" : "-"}${t.amount.toFixed(2)}
                </span>
                <button
                  onClick={() => removeTransaction(t.id)}
                  className="text-text-muted hover:text-red cursor-pointer bg-transparent border-none"
                >
                  <LuTrash2 size={16} />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}