import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getPerfilUsuario, updatePerfilUsuario } from "@/services/users.service";
import type { PerfilUsuario as OriginalPerfilUsuario } from "@/services/users.service";
import { toast } from "sonner";
import MobileMenu from "../components/MobileMenu";
import { Loader } from "lucide-react";

type PerfilUsuario = OriginalPerfilUsuario & { [key: string]: unknown };

export default function EditarPerfilCliente() {
  const [form, setForm] = useState<PerfilUsuario>({
    primer_nombre: "",
    segundo_nombre: "",
    primer_apellido: "",
    segundo_apellido: "",
    telefono: "",
    direccion: "",
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    getPerfilUsuario()
      .then((data) => {
        setForm({
          primer_nombre: data.primer_nombre ?? "",
          segundo_nombre: data.segundo_nombre ?? "",
          primer_apellido: data.primer_apellido ?? "",
          segundo_apellido: data.segundo_apellido ?? "",
          telefono: data.telefono ?? "",
          direccion: data.direccion ?? "",
        });
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // Limpia el payload para que solo se manden los campos con valores válidos
  const limpiarPayload = (obj: Record<string, unknown>) => {
    const limpio: Record<string, string> = {};
    Object.entries(obj).forEach(([k, v]) => {
      if (v !== undefined && v !== null && v !== "") limpio[k] = v as string;
    });
    return limpio;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      const payload = limpiarPayload(form);
      console.log("Payload limpio:", payload); // <- Puedes ver en consola exactamente lo que se envía
      await updatePerfilUsuario(payload);
      toast.success("Perfil actualizado correctamente");
      setTimeout(() => {
        navigate("/home");
      }, 1200);
    } catch (err) {
      toast.error("Error al actualizar perfil");
    } finally {
      setSaving(false);
    }
  };

  if (loading)
    return (
      <div className="flex min-h-screen flex-col justify-center items-center bg-zinc-950">
        <Loader className="animate-spin w-8 h-8 text-cyan-400 mb-6" />
        <span className="text-cyan-200">Cargando perfil...</span>
        <MobileMenu />
      </div>
    );

  return (
    <div className="min-h-screen bg-zinc-950 pb-20">
      <MobileMenu />
      <div className="max-w-md mx-auto mt-8 bg-white rounded-xl shadow p-6">
        <h1 className="text-cyan-600 font-bold text-2xl mb-4 text-center">
          Editar Perfil
        </h1>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <input name="primer_nombre" value={form.primer_nombre || ""} onChange={handleChange} placeholder="Primer nombre" className="p-3 rounded bg-gray-100"/>
          <input name="segundo_nombre" value={form.segundo_nombre || ""} onChange={handleChange} placeholder="Segundo nombre" className="p-3 rounded bg-gray-100"/>
          <input name="primer_apellido" value={form.primer_apellido || ""} onChange={handleChange} placeholder="Primer apellido" className="p-3 rounded bg-gray-100"/>
          <input name="segundo_apellido" value={form.segundo_apellido || ""} onChange={handleChange} placeholder="Segundo apellido" className="p-3 rounded bg-gray-100"/>
          <input name="telefono" value={form.telefono || ""} onChange={handleChange} placeholder="Teléfono" className="p-3 rounded bg-gray-100"/>
          <input name="direccion" value={form.direccion || ""} onChange={handleChange} placeholder="Dirección" className="p-3 rounded bg-gray-100"/>
          <button type="submit" disabled={saving} className="bg-cyan-500 hover:bg-cyan-600 text-white font-bold py-3 rounded">
            {saving ? "Guardando..." : "Guardar cambios"}
          </button>
        </form>
      </div>
    </div>
  );
}
