import { useState } from "react"
import { Input } from "@/components/ui/input"
import { Label } from "../components/ui/label"
import { Button } from "@/components/ui/button"

export default function CreateUser() {
  const [form, setForm] = useState({
    first_name: "",
    middle_name: "",
    last_name: "",
    second_last_name: "",
    email: "",
    password: "",
    rut: "",
    phone: "",
    user_type: "",  // id_tipo_usuario
    gender: "",      // id_genero
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    console.log("Creating user:", form)

    // Here will go the POST request to the backend
  }

  return (
    <div className="max-w-2xl mx-auto mt-10 bg-white p-6 rounded-xl shadow-md">
      <h2 className="text-2xl font-bold text-tyme mb-6">Crear Nuevo Usuario</h2>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <Label>Primer Nombre</Label>
            <Input name="first_name" value={form.first_name} onChange={handleChange} required />
          </div>
          <div>
            <Label>Segundo Nombre</Label>
            <Input name="middle_name" value={form.middle_name} onChange={handleChange} />
          </div>
          <div>
            <Label>Apellido Paterno</Label>
            <Input name="last_name" value={form.last_name} onChange={handleChange} required />
          </div>
          <div>
            <Label>Apellido Materno</Label>
            <Input name="second_last_name" value={form.second_last_name} onChange={handleChange} />
          </div>
          <div>
            <Label>Correo Electronico</Label>
            <Input type="email" name="email" value={form.email} onChange={handleChange} required />
          </div>
          <div>
            <Label>Contraseña</Label>
            <Input type="password" name="password" value={form.password} onChange={handleChange} required />
          </div>
          <div>
            <Label>Rut</Label>
            <Input name="rut" value={form.rut} onChange={handleChange} placeholder="12345678-9" required />
          </div>
          <div>
            <Label>Telefono</Label>
            <Input name="phone" value={form.phone} onChange={handleChange} />
          </div>
          <div>
            <Label>Tipo de Usuario</Label>
            <select name="user_type" value={form.user_type} onChange={handleChange} className="w-full border rounded-md px-3 py-2">
              <option value="">Seleccionar</option>
              <option value="1">Cliente</option>
              <option value="2">Entrenador</option>
            </select>
          </div>
          <div>
            <Label>Genero</Label>
            <select name="gender" value={form.gender} onChange={handleChange} className="w-full border rounded-md px-3 py-2">
              <option value="">Seleccionar</option>
              <option value="1">Hombre</option>
              <option value="2">Mujer</option>
              <option value="3">Otro</option>
            </select>
          </div>
        </div>

        <Button type="submit" className="mt-6 bg-tyme text-white hover:bg-[#5ab3d0]">
          Crear Usuario
        </Button>
      </form>
    </div>
  )
}
