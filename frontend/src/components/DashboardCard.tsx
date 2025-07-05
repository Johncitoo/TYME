// src/components/DashboardCard.tsx
import type { ReactNode } from "react";

interface DashboardCardProps {
  icon: ReactNode;
  title: string;
  children: ReactNode;
}

export default function DashboardCard({ icon, title, children }: DashboardCardProps) {
  return (
    <div className="w-full bg-zinc-900 border border-zinc-800 rounded-xl p-4 flex flex-col gap-2 shadow-sm">
      <div className="flex items-center gap-2 mb-1">
        <span className="text-cyan-400">{icon}</span>
        <span className="font-bold text-zinc-100">{title}</span>
      </div>
      <div className="text-zinc-400 text-sm">{children}</div>
    </div>
  );
}
