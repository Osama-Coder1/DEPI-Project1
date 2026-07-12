import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { LuUser, LuLock, LuMail } from "react-icons/lu";

export default function Login() {
  const [isLogin, setIsLogin] = useState(true);
  const [form, setForm] = useState({ email: "", password: "", name: "" });
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    navigate("/");
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-bg-primary p-5">
      <div className="bg-bg-card border border-border rounded-xl w-full max-w-[400px] p-8">
        <div className="text-center mb-6">
          <h1 className="text-xl font-bold text-accent-blue">Command Center</h1>
          <p className="text-sm text-text-muted mt-1">
            {isLogin ? "Sign in to your account" : "Create a new account"}
          </p>
        </div>

        <form onSubmit={handleSubmit}>
          {!isLogin && (
            <div className="mb-4">
              <label className="block text-xs font-medium text-text-muted mb-1.5">
                Full Name
              </label>
              <div className="relative">
                <LuUser
                  size={16}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted"
                />
                <input
                  type="text"
                  className="w-full pl-9 pr-3.5 py-2.5 bg-bg-secondary border border-border rounded-lg text-sm text-text-primary placeholder-text-muted focus:outline-none focus:border-accent-blue"
                  placeholder="Your name"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                />
              </div>
            </div>
          )}
          <div className="mb-4">
            <label className="block text-xs font-medium text-text-muted mb-1.5">
              Email
            </label>
            <div className="relative">
              <LuMail
                size={16}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted"
              />
              <input
                type="email"
                className="w-full pl-9 pr-3.5 py-2.5 bg-bg-secondary border border-border rounded-lg text-sm text-text-primary placeholder-text-muted focus:outline-none focus:border-accent-blue"
                placeholder="you@example.com"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
              />
            </div>
          </div>
          <div className="mb-5">
            <label className="block text-xs font-medium text-text-muted mb-1.5">
              Password
            </label>
            <div className="relative">
              <LuLock
                size={16}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted"
              />
              <input
                type="password"
                className="w-full pl-9 pr-3.5 py-2.5 bg-bg-secondary border border-border rounded-lg text-sm text-text-primary placeholder-text-muted focus:outline-none focus:border-accent-blue"
                placeholder="••••••••"
                value={form.password}
                onChange={(e) =>
                  setForm({ ...form, password: e.target.value })
                }
              />
            </div>
          </div>
          <button
            type="submit"
            className="w-full py-2.5 bg-gradient-to-r from-accent-blue to-blue-600 text-white rounded-lg text-sm font-semibold cursor-pointer transition-all hover:-translate-y-0.5 hover:shadow-[0_4px_12px_rgba(59,130,246,0.3)]"
          >
            {isLogin ? "Sign In" : "Sign Up"}
          </button>
        </form>

        <div className="text-center mt-4">
          <span className="text-sm text-text-muted">
            {isLogin ? "Don't have an account? " : "Already have an account? "}
          </span>
          <button
            onClick={() => setIsLogin(!isLogin)}
            className="bg-transparent border-none text-accent-blue cursor-pointer text-sm font-medium"
          >
            {isLogin ? "Sign Up" : "Sign In"}
          </button>
        </div>
      </div>
    </div>
  );
}
