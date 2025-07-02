// src/components/EliminarClaseForm.tsx
import React, { useEffect, useState } from "react";
import axios from "axios";
import dayjs from "dayjs";
import { Loader, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button"; // Usa tu botón shadcn

type Clase = {
  id_clase: number;
  nombre: string;
  fecha_clase: string;
  hora_inicio: string;
  hora_fin: string;
};

export default function EliminarClaseForm() {
  const [clases, setClases] = useState<Clase[]>([]);
  const [selected, setSelected] = useState<number[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    fetchClases();
  }, []);

  const fetchClases = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      const res = await axios.get("http://localhost:3000/clase", {
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      });
      setClases(res.data);
    } catch {
      toast.error("Error al cargar clases.");
      setClases([]);
    }
    setLoading(false);
  };

  const handleSelect = (id: number) => {
    setSelected((prev) =>
      prev.includes(id) ? prev.filter((cid) => cid !== id) : [...prev, id]
    );
  };

  const handleEliminar = async () => {
    if (selected.length === 0) {
      toast.warning("Selecciona al menos una clase.");
      return;
    }
    if (!window.confirm("¿Seguro que quieres eliminar las clases seleccionadas?")) return;
    setDeleting(true);
    try {
      const token = localStorage.getItem("token");
      await Promise.all(
        selected.map((id) =>
          axios.delete(`http://localhost:3000/clase/${id}`, {
            headers: token ? { Authorization: `Bearer ${token}` } : {},
          })
        )
      );
      toast.success("Clases eliminadas correctamente.");
      setSelected([]);
      fetchClases();
    } catch {
      toast.error("Error al eliminar clases.");
    }
    setDeleting(false);
  };

  return (
    <div className="bg-white rounded-xl shadow p-6 mt-10">
      <h2 className="text-xl font-bold text-red-600 mb-4">Eliminar clases</h2>
      {loading ? (
        <div className="flex items-center justify-center h-20">
          <Loader className="w-8 h-8 animate-spin text-red-600" />
        </div>
      ) : (
        <>
          <ul className="flex flex-col gap-2 max-h-96 overflow-auto">
            {clases.length === 0 && (
              <div className="text-gray-400 text-center my-5">No hay clases disponibles.</div>
            )}
            {clases.map((clase) => (
              <li
                key={clase.id_clase}
                className="flex items-center justify-between bg-gray-50 px-3 py-2 rounded-lg border border-gray-200"
              >
                <label className="flex items-center gap-2 cursor-pointer w-full">
                  <input
                    type="checkbox"
                    checked={selected.includes(clase.id_clase)}
                    onChange={() => handleSelect(clase.id_clase)}
                    className="w-5 h-5 accent-red-500"
                  />
                  <span className="text-sm font-semibold">
                    {clase.nombre} — {dayjs(clase.fecha_clase).format("DD/MM/YYYY")} {clase.hora_inicio}-{clase.hora_fin}
                  </span>
                </label>
              </li>
            ))}
          </ul>
          <Button
            onClick={handleEliminar}
            disabled={deleting || selected.length === 0}
            className="mt-6 w-full flex items-center justify-center gap-2 bg-red-600 hover:bg-red-700 text-white font-bold py-3 rounded-xl text-lg transition disabled:opacity-60 disabled:cursor-not-allowed"
            variant="destructive"
            size="lg"
          >
            <Trash2 className="w-5 h-5" />
            {deleting ? "Eliminando..." : `Eliminar seleccionadas`}
          </Button>
        </>
      )}
    </div>
  );
}
