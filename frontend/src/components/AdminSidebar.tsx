export function AdminSidebar() {
  return (
    <aside className="w-64 bg-primary text-white h-screen p-6">
      <h2 className="text-2xl font-bold mb-6">TYME</h2>
      <nav className="space-y-4">
        <div className="hover:bg-white/20 p-2 rounded-md cursor-pointer">Usuarios</div>
        <div className="hover:bg-white/20 p-2 rounded-md cursor-pointer">Rutinas</div>
        <div className="hover:bg-white/20 p-2 rounded-md cursor-pointer">Pagos</div>
      </nav>
    </aside>
  )
}
