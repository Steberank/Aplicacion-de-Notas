import etiquetasData from '../data/etiquetasDataPrisma.js';

export const obtenerTodasLasEtiquetas = async (req, res) => {
  try {
    const etiquetas = await etiquetasData.obtenerTodasLasEtiquetas();
    res.json(etiquetas);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const crearEtiqueta = async (req, res) => {
  try {
    const { texto, color } = req.body;

    if (!texto || !color) {
      return res.status(400).json({ error: 'Texto y color son requeridos' });
    }

    const etiqueta = await etiquetasData.crearEtiqueta({ texto, color });
    res.status(201).json(etiqueta);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

export const eliminarEtiqueta = async (req, res) => {
  try {
    const { id } = req.params;

    const eliminada = await etiquetasData.eliminarEtiqueta(parseInt(id));

    if (!eliminada) {
      return res.status(404).json({ error: 'Etiqueta no encontrada' });
    }

    res.json({ message: 'Etiqueta eliminada correctamente', id: parseInt(id) });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

export default {
  obtenerTodasLasEtiquetas,
  crearEtiqueta,
  eliminarEtiqueta
};
