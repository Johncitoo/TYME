export function AdminHeader() {
  return (
    <header className="bg-tyme text-white p-4 flex justify-between items-center shadow-md">
      <h1 className="text-xl font-semibold">Panel de Administración</h1>
      <button className="bg-white text-tyme font-semibold py-2 px-4 rounded-md hover:bg-gray-100 transition">
        Cerrar sesión
      </button>
    </header>
  )
}
