import React, { useState } from 'react';
import axios from 'axios';

const TaxpayerForm = () => {
  const [formData, setFormData] = useState({
    name: '',
    type: '',
    id_number: '',
    address: '',
    email: '',
    digital_signature: ''
  });

  const [file, setFile] = useState(null); // Estado para almacenar el archivo

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleFileChange = (e) => {
    setFile(e.target.files[0]); // Almacenar el archivo en el estado
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formDataToSend = new FormData();
    formDataToSend.append('name', formData.name);
    formDataToSend.append('type', formData.type);
    formDataToSend.append('id_number', formData.id_number);
    formDataToSend.append('address', formData.address);
    formDataToSend.append('email', formData.email);
    formDataToSend.append('digital_signature', formData.digital_signature);
    formDataToSend.append('publicKeyFile', file); // Añadir el archivo al FormData

    try {
      const response = await axios.post('http://localhost:5000/contribuyente', formDataToSend, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      alert('Contribuyente registrado exitosamente');
    } catch (error) {
      console.error('Error al registrar contribuyente:', error);
      alert('Error al registrar contribuyente');
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <label>
        Nombre:
        <input type="text" name="name" value={formData.name} onChange={handleChange} required />
      </label>
      <br />
      <label>
        Tipo:
        <input type="text" name="type" value={formData.type} onChange={handleChange} required />
      </label>
      <br />
      <label>
        Número de Identificación:
        <input type="text" name="id_number" value={formData.id_number} onChange={handleChange} required />
      </label>
      <br />
      <label>
        Dirección:
        <input type="text" name="address" value={formData.address} onChange={handleChange} required />
      </label>
      <br />
      <label>
        Correo Electrónico:
        <input type="email" name="email" value={formData.email} onChange={handleChange} required />
      </label>
      <br />
      <label>
        Firma Digital:
        <input type="text" name="digital_signature" value={formData.digital_signature} onChange={handleChange} required />
      </label>
      <br />
      <label>
        Archivo de Clave Pública:
        <input type="file" name="publicKeyFile" onChange={handleFileChange} required />
      </label>
      <br />
      <button type="submit">Registrar Contribuyente</button>
    </form>
  );
};

export default TaxpayerForm;
