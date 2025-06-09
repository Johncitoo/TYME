// src/pages/Attendance.tsx
import React, { useState } from "react";

interface AsistenciaPorFecha {
  fecha: string;
  presente: boolean;
}
interface Alumno {
  id: number;
  nombre: string;
  asistencia: AsistenciaPorFecha[];
}

const fechasDeAsistencia = [
  '2024-05-20', '2024-05-21', '2024-05-22',
  '2024-05-23', '2024-05-24', '2024-05-25', '2024-05-26', '2024-05-27'
];

const Attendance: React.FC = () => {
  const [alumnos, setAlumnos] = useState<Alumno[]>([
    { id: 1, nombre: 'Juan Pérez', asistencia: fechasDeAsistencia.map(fecha => ({ fecha, presente: false })) },
    { id: 2, nombre: 'María García', asistencia: fechasDeAsistencia.map(fecha => ({ fecha, presente: false })) },
    { id: 3, nombre: 'Carlos Ruiz', asistencia: fechasDeAsistencia.map(fecha => ({ fecha, presente: false })) },
    { id: 4, nombre: 'Ana López', asistencia: fechasDeAsistencia.map(fecha => ({ fecha, presente: false })) },
  ]);

  const handleCheckboxChange = (alumnoId: number, fecha: string) => {
    setAlumnos(prevAlumnos =>
      prevAlumnos.map(alumno => {
        if (alumno.id === alumnoId) {
          return {
            ...alumno,
            asistencia: alumno.asistencia.map(item =>
              item.fecha === fecha ? { ...item, presente: !item.presente } : item
            ),
          };
        }
        return alumno;
      })
    );
  };

  return (
    <div className="p-8 flex-1 flex flex-col">
      <div className="bg-green-50 p-6 rounded-lg shadow flex-1">
        <h2 className="text-2xl font-semibold text-green-800 mb-6">Registrar Asistencia por Fecha</h2>
        <div className="flex items-center justify-between p-2 mb-2 bg-green-100 rounded-md shadow-sm">
          <div className="w-48 text-left font-bold text-green-800">Alumno</div>
          <div className="flex flex-grow justify-around">
            {fechasDeAsistencia.map(fecha => (
              <span key={fecha} className="text-sm font-bold text-green-700 w-24 text-center">
                {new Date(fecha).toLocaleDateString('es-ES', { month: 'short', day: 'numeric' })}
              </span>
            ))}
          </div>
        </div>
        <ul className="space-y-3">
          {alumnos.map(alumno => (
            <li
              key={alumno.id}
              className="flex items-center justify-between p-3 border border-green-200 rounded-lg bg-white shadow-sm"
            >
              <div className="w-48 text-left font-medium text-gray-800">
                {alumno.nombre}
              </div>
              <div className="flex flex-grow justify-around items-center">
                {fechasDeAsistencia.map(fecha => {
                  const asistenciaDelDia = alumno.asistencia.find(item => item.fecha === fecha);
                  return (
                    <div key={fecha} className="w-24 flex justify-center">
                      <input
                        type="checkbox"
                        checked={asistenciaDelDia?.presente || false}
                        onChange={() => handleCheckboxChange(alumno.id, fecha)}
                        className="form-checkbox h-5 w-5 text-green-600 rounded-md cursor-pointer focus:ring-green-500"
                      />
                    </div>
                  );
                })}
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default Attendance;
