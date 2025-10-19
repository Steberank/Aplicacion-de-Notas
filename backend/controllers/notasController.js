import * as notasData from '../data/notasDataPrisma.js';
export const obtenerNotas = async (req, res) => {
  try {
    const notas = await notasData.obtenerTodasLasNotas();
    res.json(notas);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const obtenerNotaPorId = async (req, res) => {
  try {
    const { id } = req.params;
    const nota = await notasData.obtenerNotaPorId(parseInt(id));
    
    if (!nota) {
      return res.status(404).json({ error: 'Nota no encontrada' });
    }
    
    res.json(nota);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const crearNota = async (req, res) => {
  try {
    const nuevaNota = await notasData.crearNota(req.body);
    res.status(201).json(nuevaNota);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

export const actualizarNota = async (req, res) => {
  try {
    const { id } = req.params;
    const notaActualizada = await notasData.actualizarNota(parseInt(id), req.body);
    
    if (!notaActualizada) {
      return res.status(404).json({ error: 'Nota no encontrada' });
    }
    
    res.json(notaActualizada);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

export const eliminarNota = async (req, res) => {
  try {
    const { id } = req.params;
    const resultado = await notasData.eliminarNota(parseInt(id));
    
    if (!resultado) {
      return res.status(404).json({ error: 'Nota no encontrada' });
    }
    
    res.json({ message: 'Nota eliminada correctamente' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const toggleFijarNota = async (req, res) => {
  try {
    const { id } = req.params;
    const nota = await notasData.toggleFijarNota(parseInt(id));
    
    if (!nota) {
      return res.status(404).json({ error: 'Nota no encontrada' });
    }
    
    res.json(nota);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const toggleArchivarNota = async (req, res) => {
  try {
    const { id } = req.params;
    const nota = await notasData.toggleArchivarNota(parseInt(id));
    
    if (!nota) {
      return res.status(404).json({ error: 'Nota no encontrada' });
    }
    
    res.json(nota);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const anadirEtiquetaANota = async (req, res) => {
  try {
    const { id } = req.params;
    const { etiquetaId } = req.body;
    
    const nota = await notasData.anadirEtiquetaANota(parseInt(id), parseInt(etiquetaId));
    
    if (!nota) {
      return res.status(404).json({ error: 'Nota no encontrada' });
    }
    
    res.json(nota);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

export const eliminarEtiquetaDeNota = async (req, res) => {
  try {
    const { id, etiquetaId } = req.params;
    
    const nota = await notasData.eliminarEtiquetaDeNota(parseInt(id), parseInt(etiquetaId));
    
    if (!nota) {
      return res.status(404).json({ error: 'Nota no encontrada' });
    }
    
    res.json(nota);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

export const cambiarColorNota = async (req, res) => {
  try {
    const { id } = req.params;
    const { color } = req.body;
    
    const nota = await notasData.cambiarColorNota(parseInt(id), color);
    
    if (!nota) {
      return res.status(404).json({ error: 'Nota no encontrada' });
    }
    
    res.json(nota);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

