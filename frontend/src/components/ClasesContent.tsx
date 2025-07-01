import React, { useEffect, useState } from 'react';
import axios from 'axios';

interface Clase {
  id_clase: number;
  nombre: string;
  descripcion: string;
  fecha: string;
  duracion: number;
  cupo_maximo: number;
}

const ClasesContent: React.FC = () => {
  const [clases, setClases] = useState<Clase[]>([]);

  useEffect(() => {
    const fetchClases = async () => {
  try {
    const token = localStorage.getItem('token');
    const response = await axios.get('http://localhost:3000/clase', {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    console.log('Clases:', response.data);
    // set state aquí si corresponde

  } catch (error) {
    console.error('Error al obtener clases:', error);
  }
};

   


    fetchClases();
  }, []);

  return (
    <div>
      <h2>Clases Registradas</h2>
      {clases.length === 0 ? (
        <p>No hay clases registradas</p>
      ) : (
        clases.map(clase => (
          <div key={clase.id_clase}>
            <h3>{clase.nombre}</h3>
            <p>{clase.descripcion}</p>
          </div>
        ))
      )}
    </div>
  );
};

export default ClasesContent;
