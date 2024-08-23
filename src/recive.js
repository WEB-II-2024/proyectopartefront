import React, { useState } from 'react';
import axios from 'axios';

const DownloadSignature = () => {
  const [formData, setFormData] = useState({
    idNumber: '',
    idType: ''
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios({
        url: 'http://localhost:5001/bank/download-signature',
        method: 'GET',
        params: formData,
        responseType: 'blob' // Importante para manejar archivos binarios
      });

      // Crear un enlace temporal para descargar el archivo
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `digital-signature-${formData.idNumber}.pem`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      alert('Descarga completada.');
    } catch (error) {
      console.error('Hubo un error descargando el archivo.', error);
      alert('Error al descargar.');
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <label>
        Número de Identificación:
        <input type="text" name="idNumber" value={formData.idNumber} onChange={handleChange} required />
      </label>
      <br />
      <label>
        Tipo de Identificación:
        <input type="text" name="idType" value={formData.idType} onChange={handleChange} required />
      </label>
      <br />
      <button type="submit">Descargar firma</button>
    </form>
  );
};

export default DownloadSignature;
