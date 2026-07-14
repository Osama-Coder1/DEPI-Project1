import { useState, useEffect } from "react";
import { useOutletContext } from "react-router-dom";
import { onAuthStateChanged } from "firebase/auth";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { auth, db } from "../services/firebase";
import Header from "../components/layout/Header";
import {
  LuDumbbell,
  LuPlus,
  LuTrash2,
  LuCalculator,
} from "react-icons/lu";

const defaultWorkoutPlan = [
  { id: 1, day: "Monday", activity: "Chest & Triceps", done: true },
  { id: 2, day: "Tuesday", activity: "Cardio & Abs", done: true },
  { id: 3, day: "Wednesday", activity: "Back & Biceps", done: true },
];

function calcBMI(weightKg, heightCm) {
  const heightM = heightCm / 100;
  return weightKg / (heightM * heightM);
}

function bmiCategory(bmi) {
  if (bmi < 18.5) return { label: "Underweight", color: "text-cyan" };
  if (bmi < 25) return { label: "Normal", color: "text-green" };
  if (bmi < 30) return { label: "Overweight", color: "text-orange" };
  return { label: "Obese", color: "text-red" };
}

function calcMacros(weightKg, calories) {
  const protein = Math.round(weightKg * 1.6);
  const fat = Math.round((calories * 0.28) / 9);
  const carbs = Math.round((calories - protein * 4 - fat * 9) / 4);
  return { protein, carbs, fat };
}

export default function FitnessTracker() {
  const { toggleSidebar } = useOutletContext();
  const [uid, setUid] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [weight, setWeight] = useState("");
  const [height, setHeight] = useState("");
  const [result, setResult] = useState(null);
  const [workoutPlan, setWorkoutPlan] = useState(defaultWorkoutPlan);
  const [newWorkout, setNewWorkout] = useState({ day: "", activity: "" });

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (user) => {
      if (user) {
        setUid(user.uid);
        const ref = doc(db, "fitness", user.uid);
        const snap = await getDoc(ref);
        if (snap.exists()) {
          const data = snap.data();
          if (data.weight) setWeight(data.weight);
          if (data.height) setHeight(data.height);
          if (data.workoutPlan) setWorkoutPlan(data.workoutPlan);
          if (data.weight && data.height) {
            const bmi = calcBMI(Number(data.weight), Number(data.height));
            const calories = Math.round(Number(data.weight) * 29.3);
            setResult({
              bmi,
              calories,
              ...calcMacros(Number(data.weight), calories),
            });
          }
        }
      }
      setLoading(false);
    });
    return () => unsub();
  }, []);

  const saveToFirestore = async (data) => {
    if (!uid) return;
    setSaving(true);
    try {
      await setDoc(doc(db, "fitness", uid), data, { merge: true });
    } catch (err) {
      console.error(err);
    } finally {
      setSaving(false);
    }
  };

  const handleCalculate = (e) => {
    e.preventDefault();
    const w = Number(weight);
    const h = Number(height);
    if (!w || !h) return;
    const bmi = calcBMI(w, h);
    const calories = Math.round(w * 29.3);
    const macros = calcMacros(w, calories);
    setResult({ bmi, calories, ...macros });
    saveToFirestore({ weight: w, height: h });
  };

  const addWorkout = (e) => {
    e.preventDefault();
    if (!newWorkout.day.trim() || !newWorkout.activity.trim()) return;
    const updated = [
      ...workoutPlan,
      { id: Date.now(), ...newWorkout, done: false },
    ];
    setWorkoutPlan(updated);
    setNewWorkout({ day: "", activity: "" });
    saveToFirestore({ workoutPlan: updated });
  };

  const toggleWorkout = (id) => {
    const updated = workoutPlan.map((w) =>
      w.id === id ? { ...w, done: !w.done } : w
    );
    setWorkoutPlan(updated);
    saveToFirestore({ workoutPlan: updated });
  };

  const removeWorkout = (id) => {
    const updated = workoutPlan.filter((w) => w.id !== id);
    setWorkoutPlan(updated);
    saveToFirestore({ workoutPlan: updated });
  };

  if (loading) {
    return (
      <div>
        <Header title="Fitness Tracker" subtitle="Track your health & goals" onMenuToggle={toggleSidebar} />
        <p className="text-text-muted">Loading...</p>
      </div>
    );
  }

  const category = result ? bmiCategory(result.bmi) : null;

  return (
    <div>
      <Header
        title="Fitness Tracker"
        subtitle="Track your health & goals"
        onMenuToggle={toggleSidebar}
      />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 mb-5">
        {/* BMI Calculator Form */}
        <div className="bg-bg-card border border-border rounded-xl p-5">
          <div className="flex items-center gap-2 mb-5">
            <LuCalculator className="text-green" />
            <span className="text-base font-semibold text-text-primary">
              BMI Calculator
            </span>
          </div>
          <form onSubmit={handleCalculate}>
            <div className="mb-4">
              <label className="block text-xs font-medium text-text-muted mb-1.5">
                Weight (kg)
              </label>
              <input
                type="number"
                step="0.1"
                className="w-full px-3.5 py-2.5 bg-bg-page border border-border rounded-lg text-sm text-text-primary focus:outline-none focus:border-blue"
                placeholder="e.g. 75"
                value={weight}
                onChange={(e) => setWeight(e.target.value)}
              />
            </div>
            <div className="mb-5">
              <label className="block text-xs font-medium text-text-muted mb-1.5">
                Height (cm)
              </label>
              <input
                type="number"
                step="0.1"
                className="w-full px-3.5 py-2.5 bg-bg-page border border-border rounded-lg text-sm text-text-primary focus:outline-none focus:border-blue"
                placeholder="e.g. 178"
                value={height}
                onChange={(e) => setHeight(e.target.value)}
              />
            </div>
            <button
              type="submit"
              className="w-full py-2.5 bg-green text-white rounded-lg text-sm font-semibold cursor-pointer transition-all hover:bg-green-dark"
            >
              Calculate BMI →
            </button>
            {saving && (
              <p className="text-xs text-text-muted mt-2 text-center">Saving...</p>
            )}
          </form>
        </div>

        {/* Results */}
        <div className="bg-bg-card border border-border rounded-xl p-5">
          {!result ? (
            <div className="h-full flex items-center justify-center text-text-muted text-sm">
              Enter your weight and height to see your results
            </div>
          ) : (
            <div className="flex flex-col gap-3 h-full">
              <div className="bg-bg-page rounded-lg p-4">
                <div className="flex justify-between text-sm">
                  <span className="text-text-muted">BMI</span>
                  <span className={`font-bold ${category.color}`}>
                    {result.bmi.toFixed(1)} · {category.label}
                  </span>
                </div>
              </div>
              <div className="bg-blue/10 rounded-lg p-4">
                <div className="flex justify-between text-sm">
                  <span className="text-text-muted">Calorie Needs</span>
                  <span className="font-bold text-blue">
                    {result.calories} kcal/day
                  </span>
                </div>
              </div>
              <div className="grid grid-cols-3 gap-3">
                <div className="bg-bg-page rounded-lg p-3 text-center">
                  <div className="text-xs text-text-muted mb-1">Protein</div>
                  <div className="font-bold text-purple">{result.protein}g</div>
                </div>
                <div className="bg-bg-page rounded-lg p-3 text-center">
                  <div className="text-xs text-text-muted mb-1">Carbs</div>
                  <div className="font-bold text-orange">{result.carbs}g</div>
                </div>
                <div className="bg-bg-page rounded-lg p-3 text-center">
                  <div className="text-xs text-text-muted mb-1">Fats</div>
                  <div className="font-bold text-cyan">{result.fat}g</div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Workout Plan */}
      <div className="bg-bg-card border border-border rounded-xl p-5">
        <div className="flex items-center gap-2 mb-5">
          <LuDumbbell className="text-blue" />
          <span className="text-base font-semibold text-text-primary">
            Workout Plan
          </span>
        </div>

        <form onSubmit={addWorkout} className="flex flex-col sm:flex-row gap-2 mb-5">
          <input
            type="text"
            placeholder="Day (e.g. Thursday)"
            className="flex-1 px-3.5 py-2 bg-bg-page border border-border rounded-lg text-sm text-text-primary focus:outline-none focus:border-blue"
            value={newWorkout.day}
            onChange={(e) => setNewWorkout({ ...newWorkout, day: e.target.value })}
          />
          <input
            type="text"
            placeholder="Activity (e.g. Legs & Shoulders)"
            className="flex-1 px-3.5 py-2 bg-bg-page border border-border rounded-lg text-sm text-text-primary focus:outline-none focus:border-blue"
            value={newWorkout.activity}
            onChange={(e) => setNewWorkout({ ...newWorkout, activity: e.target.value })}
          />
          <button
            type="submit"
            className="px-4 py-2 bg-blue text-white rounded-lg text-sm font-semibold flex items-center gap-1.5 justify-center hover:bg-blue-dark"
          >
            <LuPlus size={16} /> Add
          </button>
        </form>

        <div className="flex flex-col gap-2">
          {workoutPlan.map((w) => (
            <div
              key={w.id}
              className="flex items-center gap-3 px-4 py-3 rounded-lg bg-bg-page"
            >
              <input
                type="checkbox"
                checked={w.done}
                onChange={() => toggleWorkout(w.id)}
                className="w-4 h-4 accent-green cursor-pointer"
              />
              <span className="text-sm font-medium text-text-secondary w-24 shrink-0">
                {w.day}
              </span>
              <span
                className={`flex-1 text-sm ${
                  w.done ? "line-through opacity-50 text-text-muted" : "text-text-primary"
                }`}
              >
                {w.activity}
              </span>
              <button
                onClick={() => removeWorkout(w.id)}
                className="text-text-muted hover:text-red cursor-pointer bg-transparent border-none"
              >
                <LuTrash2 size={16} />
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}