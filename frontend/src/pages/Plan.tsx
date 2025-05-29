// src/pages/Plan.tsx
import React, { useState } from "react";

const Plan: React.FC = () => {
  const [planData, setPlanData] = useState({
    nombreDelPlan: '',
    durabilidad: '',
    cantidadAlumnos: '',
    fechaInicio: '',
    fechaTermino: '',
    descripcion: '',
    precio: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setPlanData(prevData => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Datos del plan enviados:', planData);
    alert('Plan guardado (ver consola para los datos)');
  };

  return (
    <div className="p-8 flex-1 flex flex-col">
      <div className="bg-blue-300 p-6 rounded-lg shadow flex-1">
        <h2 className="text-2xl font-bold mb-6 text-white">Crear Nuevo Plan</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* El mismo form de tu código */}
          {/* ... */}
        </form>
      </div>
    </div>
  );
};

export default Plan;
