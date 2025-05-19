// src/components/SidebarItem.tsx
import React from 'react'

interface SidebarItemProps {
  icon: React.ReactNode
  label: string
}

export function SidebarItem({ icon, label }: SidebarItemProps) {
  return (
    <div className="flex items-center gap-4 hover:bg-white/10 p-2 rounded-md cursor-pointer">
      <div>{icon}</div>
      <span>{label}</span>
    </div>
  )
}
