import React, { useState, useEffect } from "react";
import axios from "axios";
import dayjs from "dayjs";
import { Button } from "@/components/ui/button";
import { Trash2, Loader } from "lucide-react";
import { toast } from "sonner";

type Clase = {
  id_clase: number;
  nombre: string;
  fecha_clase: string;
  hora_inicio: string;
  hora_fin: string;
};

export default function EliminarClasesFuturas({ onEliminadas }: { onEliminadas?: () => void }) {
  const [show, setShow] = useState(false);
  const [clases, setClases] = useState<Clase[]>([]);
  const [selected, setSelected] = useState<number[]>([]);
  const [loading, setLoading] = useState(false);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    if (show) fetchClasesFuturas();
    // eslint-disable-next-line
  }, [show]);

  const fetchClasesFuturas = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      const res = await axios.get("http://localhost:3000/clase", {
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      });
      // Solo clases futuras o de hoy
      const hoy = dayjs().startOf("day");
      const futuras = res.data.filter(
        (c: any) => dayjs(c.fecha_clase).isSame(hoy) || dayjs(c.fecha_clase).isAfter(hoy)
      );
      setClases(futuras);
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
      fetchClasesFuturas();
      onEliminadas?.();
    } catch {
      toast.error("Error al eliminar clases.");
    }
    setDeleting(false);
  };

  return (
    <div className="my-8">
      <Button
        onClick={() => setShow((s) => !s)}
        className="bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-6 rounded-xl mb-4"
        type="button"
      >
        <Trash2 className="w-5 h-5 mr-2" />
        Eliminar clases
      </Button>
      {show && (
        <div className="p-4 rounded-xl bg-red-50 border border-red-200 mt-2">
          <h3 className="text-lg font-bold text-red-600 mb-2">
            Eliminar clases futuras
          </h3>
          {loading ? (
            <div className="flex items-center justify-center h-16">
              <Loader className="animate-spin w-6 h-6 text-red-500" />
            </div>
          ) : clases.length === 0 ? (
            <div className="text-gray-500 text-center">No hay clases futuras.</div>
          ) : (
            <>
              <ul className="flex flex-col gap-2 max-h-64 overflow-auto">
                {clases.map((clase) => (
                  <li key={clase.id_clase} className="flex items-center gap-2 bg-white border rounded p-2">
                    <input
                      type="checkbox"
                      checked={selected.includes(clase.id_clase)}
                      onChange={() => handleSelect(clase.id_clase)}
                      className="w-5 h-5 accent-red-500"
                    />
                    <span className="text-sm">
                      <b>{clase.nombre}</b> — {dayjs(clase.fecha_clase).format("DD/MM/YYYY")} {clase.hora_inicio}-{clase.hora_fin}
                    </span>
                  </li>
                ))}
              </ul>
              <Button
                onClick={handleEliminar}
                disabled={deleting || selected.length === 0}
                className="mt-4 w-full bg-red-600 hover:bg-red-700 text-white font-bold py-2 rounded-xl transition disabled:opacity-60"
                type="button"
              >
                {deleting ? "Eliminando..." : `Eliminar seleccionadas`}
              </Button>
            </>
          )}
        </div>
      )}
    </div>
  );
}
