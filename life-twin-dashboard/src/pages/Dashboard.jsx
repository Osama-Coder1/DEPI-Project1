import Header from "../components/layout/Header";
import { useOutletContext } from "react-router-dom";
import {
  LuHourglass,
  LuTrendingUp,
  LuTriangleAlert,
  LuQuote,
  LuCreditCard,
  LuDumbbell,
  LuTrophy,
} from "react-icons/lu";

export default function Dashboard() {
  const { toggleSidebar } = useOutletContext();

  return (
    <div className="px-6 lg:px-10 space-y-8">
      <Header
        title="Dashboard"
        subtitle="Command Center"
        onMenuToggle={toggleSidebar}
      />

      {/* Top Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
        {/* Life Timeline */}
        <div className="bg-bg-card border border-border rounded-xl p-5 hover:border-accent-blue transition-colors">
          <div className="flex items-center justify-between mb-4">
            <span className="text-xs font-semibold uppercase tracking-wide text-text-muted">
              Life Timeline
            </span>
            <LuHourglass className="text-text-muted" />
          </div>
          <div className="flex items-baseline gap-4">
            <div>
              <span className="text-3xl font-bold">28</span>
              <span className="text-sm text-text-muted ml-1">Years</span>
            </div>
            <div>
              <span className="text-2xl font-semibold">4</span>
              <span className="text-sm text-text-muted ml-1">Months</span>
            </div>
          </div>
          <div className="flex gap-4 mt-1 text-sm text-text-secondary">
            <span>
              <strong>12</strong> Days
            </span>
            <span>
              <strong>08</strong> Hours
            </span>
          </div>
        </div>

        {/* Net Worth */}
        <div className="bg-bg-card border border-border rounded-xl p-5 hover:border-accent-blue transition-colors">
          <div className="flex items-center justify-between mb-4">
            <span className="text-xs font-semibold uppercase tracking-wide text-text-muted">
              Net Worth
            </span>
            <LuTrendingUp className="text-accent-green" />
          </div>
          <div className="text-3xl font-bold">$12,450.00</div>
          <div className="text-accent-green text-sm mt-1">+2.4% vs last month</div>
        </div>

        {/* Critical Focus */}
        <div className="bg-bg-card border border-border rounded-xl p-5 hover:border-accent-blue transition-colors">
          <div className="flex items-center justify-between mb-4">
            <span className="text-xs font-semibold uppercase tracking-wide text-text-muted">
              Critical Focus
            </span>
            <LuTriangleAlert className="text-accent-orange" />
          </div>
          <div className="text-3xl font-bold">05</div>
          <div className="mt-3">
            <div className="h-1 bg-border rounded-full overflow-hidden">
              <div className="w-[60%] h-full bg-accent-orange rounded-full" />
            </div>
            <div className="text-right text-xs text-text-muted mt-1">
              Tasks Remaining
            </div>
          </div>
        </div>
      </div>

      {/* Middle Row */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-5">
        {/* Quote */}
        <div className="xl:col-span-2 bg-bg-card border border-border rounded-xl p-8 flex flex-col justify-center hover:border-accent-blue transition-colors">
          <LuQuote
            size={48}
            className="text-text-muted/30 mb-4"
          />
          <blockquote className="text-2xl lg:text-3xl font-bold italic leading-snug mb-4">
            &quot;Precision is the foundation of freedom.&quot;
          </blockquote>
          <div className="text-sm text-text-muted">
            —— MARCUS AURELIUS (ADAPTED)
          </div>
        </div>

        {/* Habit Consistency */}
        <div className="bg-bg-card border border-border rounded-xl p-5 hover:border-accent-blue transition-colors">
          <div className="flex items-center justify-between mb-4">
            <span className="text-base font-semibold">Habit Consistency</span>
            <span className="text-text-muted cursor-pointer text-lg">···</span>
          </div>
          <div className="text-center py-5">
            <div className="w-[140px] h-[140px] rounded-full border-[8px] border-border border-t-accent-orange border-r-accent-green border-b-accent-cyan mx-auto flex items-center justify-center flex-col">
              <span className="text-2xl font-bold">74%</span>
              <span className="text-xs text-text-muted">AVG.</span>
            </div>
            <div className="flex justify-center gap-6 mt-5">
              <div className="flex items-center gap-2 text-sm">
                <div className="w-2 h-2 rounded-full bg-accent-cyan" />
                Focus
              </div>
              <div className="flex items-center gap-2 text-sm">
                <div className="w-2 h-2 rounded-full bg-accent-green" />
                Health
              </div>
              <div className="flex items-center gap-2 text-sm">
                <div className="w-2 h-2 rounded-full bg-accent-orange" />
                Study
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        {/* Recent Logs */}
        <div className="bg-bg-card border border-border rounded-xl p-5 hover:border-accent-blue transition-colors">
          <div className="flex items-center justify-between mb-5">
            <span className="text-base font-semibold">Recent Logs</span>
            <span className="text-sm text-accent-blue cursor-pointer">
              View All
            </span>
          </div>
          <div className="flex flex-col gap-4">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-lg bg-accent-blue/15 flex items-center justify-center text-accent-blue shrink-0">
                <LuCreditCard size={16} />
              </div>
              <div className="flex-1">
                <div className="text-sm font-medium">
                  Subscription payment: Cloud Services
                </div>
                <div className="text-xs text-text-muted">
                  2 hours ago • <span className="text-accent-red">-$12.99</span>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-lg bg-accent-green/15 flex items-center justify-center text-accent-green shrink-0">
                <LuDumbbell size={16} />
              </div>
              <div className="flex-1">
                <div className="text-sm font-medium">
                  Workout Completed: Upper Body A
                </div>
                <div className="text-xs text-text-muted">
                  5 hours ago •{" "}
                  <span className="text-accent-green">+450 XP</span>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-lg bg-accent-purple/15 flex items-center justify-center text-accent-purple shrink-0">
                <LuTrophy size={16} />
              </div>
              <div className="flex-1">
                <div className="text-sm font-medium">
                  Milestone: Read 50 pages
                </div>
                <div className="text-xs text-text-muted">
                  Yesterday • Productivity Streak
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Current Environment */}
        <div className="bg-bg-card border border-border rounded-xl p-5 hover:border-accent-blue transition-colors">
          <div className="mb-4">
            <span className="text-xs text-text-muted">Current Environment</span>
          </div>
          <div className="flex justify-between items-start">
            <div>
              <div className="text-xl font-bold">San Francisco, CA</div>
              <div className="text-sm text-text-muted">
                Cloudy • 12:42 PM
              </div>
            </div>
            <div className="text-right">
              <div className="text-3xl font-bold">68°F</div>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3 mt-5">
            <div className="bg-bg-secondary rounded-lg p-3">
              <div className="text-xs text-text-muted mb-1">AIR QUALITY</div>
              <div className="text-accent-green font-semibold">
                Optimal (24)
              </div>
            </div>
            <div className="bg-bg-secondary rounded-lg p-3">
              <div className="text-xs text-text-muted mb-1">FOCUS SCORE</div>
              <div className="text-accent-cyan font-semibold">High (88)</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
