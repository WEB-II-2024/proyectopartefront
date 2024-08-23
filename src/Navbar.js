import React from 'react';

function Navbar({ setPage }) {
  return (
    <nav className="navbar">
      <h1>Tributación</h1>
      <ul>
        <li>
          <button onClick={() => setPage('registro')}>
            Registrar contribuyente
          </button>
        </li>
        <li>
          <button onClick={() => setPage('home')}>Inicio</button>
        </li>
        <li>
          <button onClick={() => setPage('login')}>Iniciar Sesión</button>
        </li>
        <li>
          <button onClick={() => setPage('descargar')}>Descargar firma</button>
        </li>
        <li>
          <button onClick={() => setPage('createUser')}>Crear usuario</button>
        </li>
      </ul>
    </nav>
  );
}

export default Navbar;
