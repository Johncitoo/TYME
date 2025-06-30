import { useEffect, useState } from "react";
import { Calendar } from "@/components/ui/calendar"; // shadcn/ui
import { getClasesDisponibles, inscribirAsistencia, getAsistenciasCliente } from "@/services/class.service";
import { Button } from "@/components/ui/button";
import { Loader } from "lucide-react";
import { toast } from "sonner";           // <---- ¡AGREGA ESTE!
import dayjs from "dayjs";                // instala con npm i dayjs


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
  clase: { id_clase: number };
};

export default function ClasesCliente() {
  const [clases, setClases] = useState<Clase[]>([]);
  const [asistencias, setAsistencias] = useState<Asistencia[]>([]);
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchClases();
    fetchAsistencias();
  }, []);

  const fetchClases = async () => {
    setLoading(true);
    const data = await getClasesDisponibles(); // GET /clase
    setClases(data);
    setLoading(false);
  };

  const fetchAsistencias = async () => {
    try {
      const data = await getAsistenciasCliente(); // GET /asistencia/mis-asistencias
      setAsistencias(data);
    } catch {
      setAsistencias([]);
    }
  };

  // Fechas únicas de clases para marcar en el calendario
  const fechasConClase = clases.map((c) => dayjs(c.fecha_clase).format("YYYY-MM-DD"));

  // Clases para el día seleccionado
  const clasesFiltradas = clases.filter(
    (c) => dayjs(c.fecha_clase).format("YYYY-MM-DD") === dayjs(selectedDate).format("YYYY-MM-DD")
  );

  const handleInscribir = async (id_clase: number) => {
    try {
      await inscribirAsistencia({ id_clase });
      toast.success("¡Inscrito correctamente!");
      fetchAsistencias();
      fetchClases(); // Para actualizar cupos si quieres mostrar el cupo restante
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Error al inscribirse");
    }
  };

  const estaInscrito = (id_clase: number) =>
    asistencias.some((a) => a.clase.id_clase === id_clase);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-zinc-950">
      <h1 className="text-2xl font-bold mb-4 text-cyan-300">Clases Disponibles</h1>

      {/* Calendario arriba */}
      <div className="mb-6">
        <Calendar
          mode="single"
          selected={selectedDate}
          onSelect={setSelectedDate}
          modifiers={{
            // Resalta los días con clase
            marked: (date) => fechasConClase.includes(dayjs(date).format("YYYY-MM-DD")),
          }}
          modifiersClassNames={{
            marked: "bg-cyan-500 text-white",
          }}
          className="rounded-xl border"
        />
      </div>

      {/* Lista de clases para el día */}
      <div className="w-full max-w-lg">
        <h2 className="text-lg font-semibold text-cyan-200 mb-3 text-center">
          {selectedDate ? `Clases para ${dayjs(selectedDate).format("DD/MM/YYYY")}` : "Seleccione una fecha"}
        </h2>

        {loading ? (
          <div className="flex justify-center items-center">
            <Loader className="animate-spin w-8 h-8 text-cyan-400" />
          </div>
        ) : clasesFiltradas.length === 0 ? (
          <div className="text-zinc-400 text-center">No hay clases para este día.</div>
        ) : (
          <ul className="space-y-4">
            {clasesFiltradas.map((clase) => (
              <li key={clase.id_clase} className="bg-zinc-800 rounded-2xl p-4 shadow-lg flex flex-col gap-1">
                <div className="flex flex-col sm:flex-row justify-between items-center">
                  <span className="font-bold text-cyan-400 text-xl">{clase.nombre}</span>
                  <span className="text-sm text-zinc-300">{clase.hora_inicio} - {clase.hora_fin}</span>
                </div>
                <div className="text-zinc-300">{clase.descripcion}</div>
                <div className="text-zinc-400 text-xs">
                  Entrenador: {clase.entrenador?.usuario?.primer_nombre ?? "N/A"}
                </div>
                <div className="flex items-center gap-3 mt-2">
                  <span className="text-xs text-cyan-200">Cupos: {clase.cupo_maximo}</span>
                  {estaInscrito(clase.id_clase) ? (
                    <span className="text-green-400 font-semibold text-sm ml-auto">Ya inscrito</span>
                  ) : (
                    <Button
                      size="sm"
                      className="ml-auto"
                      onClick={() => handleInscribir(clase.id_clase)}
                    >
                      Inscribirse
                    </Button>
                  )}
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
