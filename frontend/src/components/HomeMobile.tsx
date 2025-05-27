import { useEffect, useState } from "react";
import api from "@/utils/api";    // ← default export
import rutinaImg from "../assets/rutina.jpg";

export default function HomeMobile() {
  const [routines, setRoutines] = useState<any[]>([]);

  useEffect(() => {
    api("/api/routines/current")  // ← llama a api()
      .then(setRoutines)
      .catch(console.error);
  }, []);

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Tu Rutina Activa</h1>
      {routines.length ? (
        routines.map((ex) => (
          <div key={ex.id_rutina_ejercicio} className="mb-2 flex items-center">
            <img src={rutinaImg} className="w-12 h-12 rounded mr-4" alt={ex.nombre} />
            <div>
              <div>Día {ex.dia} • Orden {ex.orden}</div>
              <div className="font-semibold">{ex.nombre}</div>
            </div>
          </div>
        ))
      ) : (
        <p>No hay ejercicios asignados.</p>
      )}
    </div>
  );
}