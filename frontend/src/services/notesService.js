const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
export const obtenerNotas = async () => {
  const response = await fetch(`${API_URL}/notas`);
  if (!response.ok) throw new Error('Error al obtener notas');
  return await response.json();
};

export const obtenerNotaPorId = async (id) => {
  const response = await fetch(`${API_URL}/notas/${id}`);
  if (!response.ok) throw new Error('Error al obtener nota');
  return await response.json();
};

export const crearNota = async (datosNota) => {
  const response = await fetch(`${API_URL}/notas`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(datosNota),
  });
  if (!response.ok) throw new Error('Error al crear nota');
  return await response.json();
};

export const actualizarNota = async (id, datosActualizados) => {
  const response = await fetch(`${API_URL}/notas/${id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(datosActualizados),
  });
  if (!response.ok) throw new Error('Error al actualizar nota');
  return await response.json();
};

export const eliminarNota = async (id) => {
  const response = await fetch(`${API_URL}/notas/${id}`, {
    method: 'DELETE',
  });
  if (!response.ok) throw new Error('Error al eliminar nota');
  return await response.json();
};

export const toggleFijarNota = async (id) => {
  const response = await fetch(`${API_URL}/notas/${id}/fijar`, {
    method: 'PATCH',
  });
  if (!response.ok) throw new Error('Error al fijar/desfijar nota');
  return await response.json();
};

export const toggleArchivarNota = async (id) => {
  const response = await fetch(`${API_URL}/notas/${id}/archivar`, {
    method: 'PATCH',
  });
  if (!response.ok) throw new Error('Error al archivar/desarchivar nota');
  return await response.json();
};

export const anadirEtiquetaANota = async (notaId, etiquetaId) => {
  const response = await fetch(`${API_URL}/notas/${notaId}/etiquetas`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ etiquetaId }),
  });
  if (!response.ok) throw new Error('Error al añadir etiqueta a nota');
  return await response.json();
};

export const eliminarEtiquetaDeNota = async (notaId, etiquetaId) => {
  const response = await fetch(`${API_URL}/notas/${notaId}/etiquetas/${etiquetaId}`, {
    method: 'DELETE',
  });
  if (!response.ok) throw new Error('Error al eliminar etiqueta de nota');
  return await response.json();
};

export const cambiarColorNota = async (id, color) => {
  const response = await fetch(`${API_URL}/notas/${id}/cambiar-color`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ color }),
  });
  if (!response.ok) throw new Error('Error al cambiar color de nota');
  return await response.json();
};

