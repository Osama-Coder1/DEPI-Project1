import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
} from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";
import { auth, db } from "../services/firebase";
import {
  LuEye,
  LuEyeOff,
  LuTarget,
  LuShieldCheck,
  LuTrendingUp,
  LuUser,
  LuCamera,
} from "react-icons/lu";

const features = [
  {
    icon: LuTarget,
    title: "Personalized for you",
    text: "We'll tailor everything to your goals and lifestyle.",
    color: "text-indigo-600",
  },
  {
    icon: LuShieldCheck,
    title: "Your data is secure",
    text: "We take your privacy seriously and keep your data safe.",
    color: "text-green",
  },
  {
    icon: LuTrendingUp,
    title: "All in one place",
    text: "Track your finances, fitness, tasks and more in one dashboard.",
    color: "text-cyan",
  },
];

function Field({ label, suffix, ...props }) {
  return (
    <div className="mb-10">
      <label className="block text-base font-semibold text-text-primary mb-3">
        {label}
      </label>
      <div className="relative">
        <input
          {...props}
          className="w-full px-7 py-[3.25rem] bg-bg-card border-2 border-border rounded-2xl text-lg text-text-primary placeholder-text-muted focus:outline-none focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100 transition-shadow"
        />
        {suffix && (
          <span className="absolute right-7 top-1/2 -translate-y-1/2 text-text-muted text-base">
            {suffix}
          </span>
        )}
      </div>
    </div>
  );
}

export default function Login() {
  const [isLogin, setIsLogin] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [agreed, setAgreed] = useState(true);
  const [photo, setPhoto] = useState(null);
  const navigate = useNavigate();

  const [form, setForm] = useState({
    email: "",
    password: "",
    name: "",
    work: "",
    age: "",
    height: "",
    weight: "",
    monthlyIncome: "",
  });

  const handlePhotoChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onloadend = () => setPhoto(reader.result);
    reader.readAsDataURL(file);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    if (!isLogin && !agreed) {
      setError("You must agree to the Terms of Service and Privacy Policy.");
      return;
    }
    setLoading(true);
    try {
      if (isLogin) {
        await signInWithEmailAndPassword(auth, form.email, form.password);
      } else {
        const cred = await createUserWithEmailAndPassword(auth, form.email, form.password);
        await setDoc(doc(db, "users", cred.user.uid), {
          name: form.name,
          work: form.work,
          age: form.age,
          height: form.height,
          weight: form.weight,
          monthlyIncome: form.monthlyIncome,
          photo: photo || null,
        });

        if (form.weight && form.height) {
          await setDoc(
            doc(db, "fitness", cred.user.uid),
            { weight: Number(form.weight), height: Number(form.height) },
            { merge: true }
          );
        }

        if (form.monthlyIncome) {
          await setDoc(
            doc(db, "finance", cred.user.uid),
            {
              transactions: [
                {
                  id: Date.now(),
                  type: "income",
                  amount: Number(form.monthlyIncome),
                  category: "Income",
                  description: "Monthly Income",
                  date: new Date().toISOString(),
                },
              ],
            },
            { merge: true }
          );
        }
      }
      navigate("/");
    } catch (err) {
      setError(err.message.replace("Firebase: ", ""));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-bg-page flex">
      {/* Left Panel */}
      <div className="hidden lg:flex lg:w-[40%] relative overflow-hidden flex-col p-16 xl:p-24 bg-gradient-to-br from-indigo-50 via-indigo-50 to-purple-50">
        <div className="absolute -top-24 -left-24 w-80 h-80 bg-indigo-200 rounded-full opacity-40 blur-3xl" />
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-purple-200 rounded-full translate-x-1/3 translate-y-1/3 opacity-50 blur-3xl" />
        <div className="absolute top-1/2 right-10 w-32 h-32 bg-cyan-200 rounded-full opacity-30 blur-2xl" />

        <div className="relative z-10 flex flex-col h-full">
          <span className="text-3xl font-bold text-text-primary tracking-tight mb-24">
            Life Twin
          </span>

          <h1 className="text-5xl font-bold text-text-primary leading-tight mb-8 tracking-tight whitespace-nowrap">
            {isLogin ? "Welcome Back" : "Create Your Account"}
          </h1>
          <p className="text-xl text-text-secondary leading-relaxed">
            {isLogin
              ? "Sign in to continue managing your life dashboard."
              : "Let's get to know you better so we can personalize your experience."}
          </p>

          <div className="flex flex-col mt-auto">
            <div className="flex items-start gap-5 mb-20">
              <div className="w-12 h-12 rounded-full bg-white flex items-center justify-center shrink-0 shadow-sm">
                {(() => {
                  const Icon = features[0].icon;
                  return <Icon size={21} className={features[0].color} />;
                })()}
              </div>
              <div>
                <div className="text-base font-semibold text-text-primary">{features[0].title}</div>
                <div className="text-sm text-text-muted mt-1 leading-snug">{features[0].text}</div>
              </div>
            </div>

            <div className="flex flex-col">
              {features.slice(1).map((f) => (
                <div key={f.title} className="flex items-start gap-5">
                  <div className="w-12 h-12 rounded-full bg-white flex items-center justify-center shrink-0 shadow-sm">
                    <f.icon size={21} className={f.color} />
                  </div>
                  <div>
                    <div className="text-base font-semibold text-text-primary">{f.title}</div>
                    <div className="text-sm text-text-muted mt-1 leading-snug">{f.text}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Right Panel */}
      <div className="flex-1 flex justify-center py-20 px-6 md:px-24 overflow-y-auto">
        <div className={`w-full ${isLogin ? "max-w-[560px]" : "max-w-[780px]"} my-auto`}>
          <h2 className="text-5xl font-bold text-text-primary mb-3 tracking-tight">
            {isLogin ? "Sign In" : "Create Account"}
          </h2>
          <p className="text-text-muted text-lg mb-16">
            {isLogin
              ? "Enter your credentials to access your account."
              : "Please fill in the information below to get started."}
          </p>

          {error && (
            <div className="mb-8 px-5 py-4 bg-red/10 border border-red/30 rounded-xl text-sm text-red">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit}>
            {!isLogin && (
              <>
                <div className="flex justify-center mb-10">
                  <label className="relative cursor-pointer">
                    <div className="w-28 h-28 rounded-full bg-bg-page border-2 border-border flex items-center justify-center overflow-hidden">
                      {photo ? (
                        <img src={photo} alt="Profile" className="w-full h-full object-cover" />
                      ) : (
                        <LuUser size={40} className="text-text-muted" />
                      )}
                    </div>
                    <div className="absolute bottom-0 right-0 w-9 h-9 rounded-full bg-indigo-600 border-2 border-bg-card flex items-center justify-center">
                      <LuCamera size={15} className="text-white" />
                    </div>
                    <input type="file" accept="image/*" className="hidden" onChange={handlePhotoChange} />
                  </label>
                </div>

                <Field
                  label="Full Name"
                  type="text"
                  placeholder="Enter your full name"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                />
                <Field
                  label="Work / Profession"
                  type="text"
                  placeholder="What do you do?"
                  value={form.work}
                  onChange={(e) => setForm({ ...form, work: e.target.value })}
                />
                <Field
                  label="Age"
                  type="number"
                  placeholder="Enter your age"
                  value={form.age}
                  onChange={(e) => setForm({ ...form, age: e.target.value })}
                />
                <Field
                  label="Monthly Income"
                  type="number"
                  placeholder="Enter your monthly income"
                  suffix="$"
                  value={form.monthlyIncome}
                  onChange={(e) => setForm({ ...form, monthlyIncome: e.target.value })}
                />
                <div className="grid grid-cols-2 gap-8">
                  <Field
                    label="Height"
                    type="number"
                    placeholder="Enter your height"
                    suffix="cm"
                    value={form.height}
                    onChange={(e) => setForm({ ...form, height: e.target.value })}
                  />
                  <Field
                    label="Weight"
                    type="number"
                    placeholder="Enter your weight"
                    suffix="kg"
                    value={form.weight}
                    onChange={(e) => setForm({ ...form, weight: e.target.value })}
                  />
                </div>
              </>
            )}

            <Field
              label="Email Address"
              type="email"
              placeholder="Enter your email address"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
            />

            <div className="mb-4">
              <label className="block text-base font-semibold text-text-primary mb-3">
                Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  className="w-full px-7 py-[3.25rem] bg-bg-card border-2 border-border rounded-2xl text-lg text-text-primary placeholder-text-muted focus:outline-none focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100 transition-shadow"
                  placeholder={isLogin ? "Enter your password" : "Create a password"}
                  value={form.password}
                  onChange={(e) => setForm({ ...form, password: e.target.value })}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-7 top-1/2 -translate-y-1/2 text-text-muted bg-transparent border-none cursor-pointer"
                >
                  {showPassword ? <LuEyeOff size={22} /> : <LuEye size={22} />}
                </button>
              </div>
              {!isLogin && (
                <p className="text-sm text-text-muted mt-3">
                  Use at least 8 characters with a mix of letters, numbers & symbols.
                </p>
              )}
            </div>

            {!isLogin && (
              <label className="flex items-start gap-3 mt-8 mb-10 cursor-pointer">
                <input
                  type="checkbox"
                  checked={agreed}
                  onChange={(e) => setAgreed(e.target.checked)}
                  className="mt-1 w-5 h-5 accent-indigo-600 cursor-pointer"
                />
                <span className="text-base text-text-secondary">
                  I agree to the <span className="text-indigo-600 font-medium">Terms of Service</span> and{" "}
                  <span className="text-indigo-600 font-medium">Privacy Policy</span>
                </span>
              </label>
            )}

            <button
              type="submit"
              disabled={loading}
              className={`w-full py-7 bg-indigo-600 text-white rounded-2xl text-xl font-semibold cursor-pointer transition-all hover:bg-indigo-700 hover:shadow-lg hover:shadow-indigo-600/30 disabled:opacity-60 ${isLogin ? "mt-6" : ""}`}
            >
              {loading ? "Please wait..." : isLogin ? "Sign In" : "Create Account"}
            </button>
          </form>

          <div className="text-center mt-12">
            <span className="text-base text-text-muted">
              {isLogin ? "Don't have an account? " : "Already have an account? "}
            </span>
            <button
              onClick={() => setIsLogin(!isLogin)}
              className="bg-transparent border-none text-indigo-600 cursor-pointer text-base font-semibold"
            >
              {isLogin ? "Sign Up" : "Log in"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}