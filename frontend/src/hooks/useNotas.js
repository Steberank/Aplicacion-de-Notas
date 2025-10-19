import { useState, useEffect } from 'react';
import { obtenerNotas } from '../services/notesService';
import { obtenerTodasLasEtiquetas } from '../services/etiquetasService';

export const useNotas = () => {
  const [notas, setNotas] = useState([]);
  const [etiquetas, setEtiquetas] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState(null);


  useEffect(() => {
    cargarNotas();
  }, []);

  const cargarNotas = async () => {
    try {
      setCargando(true);
      setError(null);
      
      const [notasObtenidas, etiquetasObtenidas] = await Promise.all([
        obtenerNotas(),
        obtenerTodasLasEtiquetas()
      ]);
      
      setNotas(notasObtenidas);
      setEtiquetas(etiquetasObtenidas);
      
    } catch (err) {
      setError(err.message);
      console.error('Error al cargar datos:', err);
    } finally {
      setCargando(false);
    }
  };

  const recargarDatos = async () => {
    await cargarNotas();
  };
  const notasFijadas = notas.filter(nota => nota.estaFijado && !nota.estaArchivado);
  const notasNoFijadas = notas.filter(nota => !nota.estaFijado && !nota.estaArchivado);
  const notasArchivadas = notas.filter(nota => nota.estaArchivado);

  return {
    notas,
    etiquetas,
    cargando,
    error,
    notasFijadas,
    notasNoFijadas,
    notasArchivadas,
    cargarNotas,
    recargarDatos
  };
};