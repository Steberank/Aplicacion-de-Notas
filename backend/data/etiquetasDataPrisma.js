import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const obtenerTodasLasEtiquetas = async () => {
  try {
    const etiquetas = await prisma.etiqueta.findMany({
      orderBy: { texto: 'asc' }
    });

    return etiquetas.map(etiqueta => ({
      id: etiqueta.id,
      texto: etiqueta.texto,
      color: etiqueta.color,
      creadoEn: etiqueta.creadoEn
    }));
  } catch (error) {
    console.error('Error al obtener etiquetas:', error);
    throw error;
  }
};

export const crearEtiqueta = async (datosEtiqueta) => {
  try {
    const { texto, color } = datosEtiqueta;

    const etiquetaExistente = await prisma.etiqueta.findFirst({
      where: { texto: texto.trim() }
    });

    if (etiquetaExistente) {
      throw new Error('Ya existe una etiqueta con ese texto');
    }

    const etiqueta = await prisma.etiqueta.create({
      data: {
        texto: texto.trim(),
        color: color
      }
    });

    return {
      id: etiqueta.id,
      texto: etiqueta.texto,
      color: etiqueta.color,
      creadoEn: etiqueta.creadoEn
    };
  } catch (error) {
    console.error('Error al crear etiqueta:', error);
    throw error;
  }
};

export const eliminarEtiqueta = async (id) => {
  try {
    const etiqueta = await prisma.etiqueta.findUnique({
      where: { id }
    });

    if (!etiqueta) return null;

    await prisma.notaEtiqueta.deleteMany({
      where: { etiquetaId: id }
    });

    await prisma.etiqueta.delete({
      where: { id }
    });

    return true;
  } catch (error) {
    console.error('Error al eliminar etiqueta:', error);
    throw error;
  }
};

export default {
  obtenerTodasLasEtiquetas,
  crearEtiqueta,
  eliminarEtiqueta
};
