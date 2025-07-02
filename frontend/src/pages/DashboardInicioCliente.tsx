import { useEffect, useState } from "react";
import { getAsistenciasCliente } from "@/services/class.service";
import { Button } from "@/components/ui/button";
import MobileMenu from "@/components/MobileMenu";
import { Loader, User } from "lucide-react";
import dayjs from "dayjs";
import "dayjs/locale/es";
import { toast } from "sonner";
import { Card } from "@/components/ui/card";

// IMPORTA TU FONDO
import FondoRutina from "../assets/rutina.jpg";

type Clase = {
  id_clase: number;
  fecha_clase: string;
  nombre: string;
  descripcion?: string;
  hora_inicio: string;
  hora_fin: string;
  cupo_maximo: number;
  entrenador: { usuario: { primer_nombre: string } };
};

type Asistencia = {
  id_asistencia: number;
  clase: Clase;
};

export default function DashboardInicioCliente() {
  const [asistencias, setAsistencias] = useState<Asistencia[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAsistencias();
    // eslint-disable-next-line
  }, []);

  const fetchAsistencias = async () => {
    setLoading(true);
    try {
      const data = await getAsistenciasCliente();
      setAsistencias(data);
    } catch (err) {
      toast.error("No se pudieron cargar tus clases.");
      setAsistencias([]);
    }
    setLoading(false);
  };

  const clasesInscritas = asistencias
    .filter((a) => !!a.clase)
    .map((a) => a.clase)
    .sort((a, b) =>
      dayjs(`${a.fecha_clase} ${a.hora_inicio}`).unix() -
      dayjs(`${b.fecha_clase} ${b.hora_inicio}`).unix()
    );

  return (
    <div className="relative min-h-screen w-full flex flex-col items-center justify-center overflow-hidden">
      {/* FONDO BLURRADO y overlay */}
      <img
        src={FondoRutina}
        alt="Fondo rutina"
        className="absolute inset-0 w-full h-full object-cover brightness-70 blur-sm scale-105 z-0"
        style={{ objectPosition: "0% 30%" }}
        draggable={false}
      />
      <div className="absolute inset-0 bg-gradient-to-br from-zinc-950/95 via-cyan-950/65 to-zinc-950/95 z-0" />
      
      {/* Menú siempre arriba del fondo */}
      <div className="relative z-20 w-full">
        <MobileMenu />
      </div>

      {/* Título destacado sobre fondo */}
      <h1 className="relative z-20 text-2xl md:text-3xl font-bold text-cyan-400 text-center mt-6 mb-2 drop-shadow-md">
        Tus Clases Inscritas
      </h1>

      {/* Contenedor del listado */}
      <div className="relative z-20 flex flex-col px-2 w-full max-w-md mx-auto">
        <Card className="bg-zinc-900/90 backdrop-blur-md p-0 border-none shadow-2xl rounded-2xl mt-1">
          <div className="flex flex-col py-6 px-3 md:px-7">
            {loading ? (
              <div className="flex justify-center items-center h-40">
                <Loader className="animate-spin w-10 h-10 text-cyan-400" />
              </div>
            ) : clasesInscritas.length === 0 ? (
              <div className="text-zinc-400 text-center mt-10 text-base">
                No tienes clases inscritas.
              </div>
            ) : (
              <ul className="flex flex-col gap-3">
                {clasesInscritas.map((clase) => (
                  <li
                    key={clase.id_clase}
                    className="rounded-2xl shadow-lg bg-zinc-900/80 p-4 flex flex-col gap-2 border border-zinc-800 backdrop-blur-[2px]"
                  >
                    <div className="flex items-center gap-3 mb-1">
                      <span className="text-cyan-400 font-bold flex items-center text-base">
                        <svg className="w-5 h-5 mr-1" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                          <rect x="3" y="4" width="18" height="18" rx="3" />
                          <path d="M16 2v4M8 2v4M3 10h18" />
                        </svg>
                        {dayjs(clase.fecha_clase).format("ddd D MMM YYYY")}
                      </span>
                      <span className="ml-auto px-2 py-1 rounded bg-cyan-950 text-cyan-400 text-xs font-semibold">
                        {clase.hora_inicio} - {clase.hora_fin}
                      </span>
                    </div>
                    <div className="font-semibold text-lg text-white">{clase.nombre}</div>
                    {clase.descripcion && (
                      <div className="text-zinc-300 text-sm mb-1">{clase.descripcion}</div>
                    )}
                    <div className="flex items-center gap-1 text-zinc-400 text-xs mb-1">
                      <User className="w-4 h-4 mr-1" />
                      {clase.entrenador?.usuario?.primer_nombre ?? "Entrenador"} • Cupos: {clase.cupo_maximo}
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </Card>
      </div>
    </div>
  );
}
