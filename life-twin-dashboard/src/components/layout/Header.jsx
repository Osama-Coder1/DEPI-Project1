import { LuBell, LuSettings, LuMenu } from "react-icons/lu";

export default function Header({ title, subtitle, onMenuToggle }) {
  return (
    <div className="flex items-center justify-between mb-8">
      <div className="flex items-center gap-3">
        <button
          className="w-10 h-10 rounded-xl border border-border bg-bg-card/80 backdrop-blur text-text-secondary flex items-center justify-center cursor-pointer transition-all duration-200 hover:bg-white hover:text-text-primary hover:shadow-md lg:hidden"
          onClick={onMenuToggle}
        >
          <LuMenu />
        </button>
        <div>
          <h2 className="text-2xl font-bold text-text-primary tracking-tight">{title}</h2>
          {subtitle && (
            <p className="text-sm text-text-muted mt-0.5">{subtitle}</p>
          )}
        </div>
      </div>
      <div className="flex items-center gap-3">
        <button className="w-10 h-10 rounded-xl border border-border bg-bg-card/80 backdrop-blur text-text-secondary flex items-center justify-center cursor-pointer transition-all duration-200 hover:bg-white hover:text-text-primary hover:shadow-md hover:-translate-y-0.5">
          <LuBell size={18} />
        </button>
        <button className="w-10 h-10 rounded-xl border border-border bg-bg-card/80 backdrop-blur text-text-secondary flex items-center justify-center cursor-pointer transition-all duration-200 hover:bg-white hover:text-text-primary hover:shadow-md hover:-translate-y-0.5">
          <LuSettings size={18} />
        </button>
        <div className="w-9 h-9 rounded-full bg-gradient-to-br from-blue to-purple flex items-center justify-center text-xs font-semibold text-white shadow-md">
          U
        </div>
      </div>
    </div>
  );
}