import React from 'react';
import type { FC, FormEvent } from 'react';
import { useState } from 'react';
// Importa la imagen desde el código para asegurar la ruta
import bgImg from '../assets/DSC01698.jpg';

const MobileLogin: FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    // lógica de autenticación
  };

  return (
    <div
      className="relative min-h-screen bg-cover bg-center"
      style={{ backgroundImage: `url(${bgImg})` }}
    >
      {/* overlay semitransparente */}
      <div className="absolute inset-0 bg-black bg-opacity-40" />

      {/* card */}
      <div className="relative flex flex-col items-center justify-center min-h-screen px-4">
        <div className="w-full max-w-xs bg-white bg-opacity-90 rounded-2xl p-6 space-y-6">
          {/* Logo */}
          <div className="text-center">
            <img src="/img/tyme-logo.png" alt="TYME" className="mx-auto w-32 h-auto" />
            <p className="text-primary text-lg mt-2">Gimnasio integral</p>
            <p className="text-primary text-sm">Tu espacio fitness</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <input
              type="email"
              placeholder="Correo"
              value={email}
              onChange={e => setEmail(e.target.value)}
              className="w-full px-4 py-2 rounded-full bg-white text-gray-800 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-primary"
            />
            <input
              type="password"
              placeholder="Contraseña"
              value={password}
              onChange={e => setPassword(e.target.value)}
              className="w-full px-4 py-2 rounded-full bg-white text-gray-800 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-primary"
            />
            <button
              type="submit"
              className="w-full py-2 rounded-full bg-primary text-white font-medium hover:bg-primary/90 transition"
            >
              INICIAR SESIÓN
            </button>
          </form>

          <div className="text-center">
            <button className="text-sm text-primary hover:underline">CREAR CUENTA</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MobileLogin;


