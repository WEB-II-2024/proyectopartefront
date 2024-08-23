import React, { useState, useEffect } from 'react';
import Navbar from './Navbar';
import TaxpayerForm from './TaxpayerForm';
import DownloadSignature from './downloadSignature';
import CreateUser from './createUser';
import { jwtDecode } from 'jwt-decode';



function Home() {
  const [userName, setUserName] = useState('');

  useEffect(() => {
    const token = localStorage.getItem('authToken');
    if (token) {
      try {
        const decoded = jwtDecode(token);
        setUserName(decoded.username); // Ajusta esto según el nombre del campo en tu token
      } catch (error) {
        console.error('Error decoding token:', error);
      }
    }
  }, []);
  return (
    <div className="container">
      <h1>Tributación</h1>
      <p>Hola, {userName || 'Usuario'}</p>
    </div>
  );
}

function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [color, setColor] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch('http://localhost:5001/bank/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password }),
      });

      const data = await response.json();

      if (response.ok) {
        console.log('Authentication successful:', data.username);
        setColor('green');
        setError('Autenticación exitosa.');
        localStorage.setItem('authToken', data.token);
        window.location.href = 'profile';
        
      } else {
        setColor('red');
        setError(data.message);
      }
    } catch (error) {
      setColor('red');
      setError('Error de autenticación');
      console.error('Error during login:', error);
    }
  };

  return (
    <div className="container">
      <h1>Iniciar Sesión</h1>
      {error && <p style={{ color: color }}>{error}</p>}
      <form onSubmit={handleSubmit}>
        <div>
          <label>Usuario:</label>
          <input
            type="text"
            name="username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
        </div>
        <div>
          <label>Contraseña:</label>
          <input
            type="password"
            name="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
        <button type="submit">Iniciar Sesión</button>
      </form>
    </div>
  );
}

function App() {
  const [page, setPage] = useState('home');

  return (
    <div>
      <Navbar setPage={setPage} />
      {page === 'home' && <Home />}
      {page === 'login' && <Login />}
      {page === 'registro' && <TaxpayerForm />}
      {page === 'descargar' && <DownloadSignature />}
      {page === 'createUser' && <CreateUser />}
    </div>
  );
}

export default App;
