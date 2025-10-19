const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

export const obtenerTodasLasEtiquetas = async () => {
  const response = await fetch(`${API_URL}/etiquetas`);
  if (!response.ok) throw new Error('Error al obtener etiquetas');
  return await response.json();
};

export const crearEtiqueta = async (datosEtiqueta) => {
  const response = await fetch(`${API_URL}/etiquetas`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(datosEtiqueta),
  });
  if (!response.ok) throw new Error('Error al crear etiqueta');
  return await response.json();
};

export const eliminarEtiqueta = async (id) => {
  const response = await fetch(`${API_URL}/etiquetas/${id}`, {
    method: 'DELETE',
  });
  if (!response.ok) throw new Error('Error al eliminar etiqueta');
  return await response.json();
};
