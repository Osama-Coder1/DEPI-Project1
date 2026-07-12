import { LuBell, LuSettings, LuMenu } from "react-icons/lu";

export default function Header({ title, subtitle, onMenuToggle }) {
  return (
    <div className="flex items-center justify-between mb-6">
      <div className="flex items-center gap-3">
        <button
          className="w-10 h-10 rounded-lg border border-border bg-bg-card text-text-secondary flex items-center justify-center cursor-pointer hover:bg-bg-card-hover hover:text-text-primary lg:hidden"
          onClick={onMenuToggle}
        >
          <LuMenu />
        </button>
        <div>
          <h2 className="text-2xl font-bold">{title}</h2>
          {subtitle && (
            <p className="text-sm text-text-muted">{subtitle}</p>
          )}
        </div>
      </div>
      <div className="flex items-center gap-3">
        <button className="w-10 h-10 rounded-lg border border-border bg-bg-card text-text-secondary flex items-center justify-center cursor-pointer hover:bg-bg-card-hover hover:text-text-primary">
          <LuBell />
        </button>
        <button className="w-10 h-10 rounded-lg border border-border bg-bg-card text-text-secondary flex items-center justify-center cursor-pointer hover:bg-bg-card-hover hover:text-text-primary">
          <LuSettings />
        </button>
        <div className="w-9 h-9 rounded-full bg-gradient-to-br from-accent-blue to-accent-purple flex items-center justify-center text-xs font-semibold">
          U
        </div>
      </div>
    </div>
  );
}
