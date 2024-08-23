import React, { useState } from 'react';
import axios from 'axios';

const CreateUser = () => {
  const [formData, setFormData] = useState({
    username: '',
    password: '',
    idNumber: '',
    idType: '',
    email: '',
    address: ''
  });

  const [keyType, setKeyType] = useState(''); 
  const [privateKeyFile, setPrivateKeyFile] = useState(null); 

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleKeyTypeChange = (e) => {
    setKeyType(e.target.value);
  };

  const handleFileChange = (e) => {
    setPrivateKeyFile(e.target.files[0]); 
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    axios.post('http://localhost:5001/bank/register', formData)
      .then(response => {
        alert('Usuario creado.');
      })
      .catch(error => {
        console.error('Hubo algún error al crear el usuario.', error);
        alert('Error al crear al usuario.');
      });
  };

  const handleKeyDownload = (e) => {
    e.preventDefault();

    const { idNumber, idType } = formData;

    axios.get('http://localhost:5001/bank/download-key', {
      params: { idNumber, idType, keyType },
      responseType: 'blob'
    })
      .then(response => {
        const url = window.URL.createObjectURL(new Blob([response.data]));
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', 'key.pem');
        document.body.appendChild(link);
        link.click();
      })
      .catch(error => {
        console.error('Error al descargar la clave.', error);
        alert('Error al descargar la clave.');
      });
  };

  const handleGenerateSignature = (e) => {
    e.preventDefault();

    const { idNumber, idType } = formData;

    if (!privateKeyFile) {
      alert('Por favor, selecciona un archivo de clave privada (.pem).');
      return;
    }

    const formDataToSend = new FormData();
    formDataToSend.append('idNumber', idNumber);
    formDataToSend.append('idType', idType);
    formDataToSend.append('privateKeyFile', privateKeyFile); 

    axios.post('http://localhost:5001/bank/generate-signature', formDataToSend, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    })
      .then(response => {
        alert('Firma generada exitosamente.');
      })
      .catch(error => {
        console.error('Error al generar la firma.', error);
        alert('Error al generar la firma.');
      });
  };

  return (
    <>
      <form onSubmit={handleSubmit}>
        <label>
          Nombre de usuario:
          <input type="text" name="username" value={formData.username} onChange={handleChange} required />
        </label>
        <br />
        <label>
          Contraseña:
          <input type="password" name="password" value={formData.password} onChange={handleChange} required />
        </label>
        <br />
        <label>
          Número de Identificación:
          <input type="text" name="idNumber" value={formData.idNumber} onChange={handleChange} required />
        </label>
        <br />
        <label>
          Tipo de cédula:
          <input type="text" name="idType" value={formData.idType} onChange={handleChange} required />
        </label>
        <br />
        <label>
          Correo Electrónico:
          <input type="email" name="email" value={formData.email} onChange={handleChange} required />
        </label>
        <br />
        <label>
          Dirección:
          <input type="text" name="address" value={formData.address} onChange={handleChange} required />
        </label>
        <br />
        <button type="submit">Crear usuario</button>
      </form>

      <hr />
      <p>A partir de aqui necesitas insertar el ID y el tipo de cedula aunado a la informacion adicional que se solicita.</p>
      <hr />

      <form onSubmit={handleKeyDownload}>
        <label>
          Tipo de clave:
          <input type="text" name="keyType" value={keyType} onChange={handleKeyTypeChange} required />
        </label>
        <br />
        <button type="submit">Descargar Key</button>
      </form>

      <hr />

      <form onSubmit={handleGenerateSignature}>

        <label>
          Clave privada (.pem):
          <input type="file" name="privateKey" accept=".pem" onChange={handleFileChange} required />
        </label>
        <br />
        <button type="submit">Generar Firma</button>
      </form>
    </>
  );
};

export default CreateUser;
