import prisma from '../config/prisma.js';
export const obtenerTodasLasNotas = async () => {
  try {
    const notas = await prisma.nota.findMany({
      include: {
        etiquetas: {
          include: {
            etiqueta: true
          }
        }
      },
      orderBy: [
        { estaFijado: 'desc' },
        { editadoEn: 'desc' }
      ]
    });

    return notas.map(nota => ({
      id: nota.id,
      titulo: nota.titulo,
      contenido: nota.contenido,
      color: nota.color,
      estaArchivado: nota.estaArchivado,
      estaFijado: nota.estaFijado,
      etiquetas: nota.etiquetas.map(ne => ({
        id: ne.etiqueta.id,
        texto: ne.etiqueta.texto,
        color: ne.etiqueta.color
      })),
      creadoEn: nota.creadoEn,
      editadoEn: nota.editadoEn
    }));
  } catch (error) {
    console.error('Error al obtener notas:', error);
    throw error;
  }
};

export const obtenerNotaPorId = async (id) => {
  try {
    const nota = await prisma.nota.findUnique({
      where: { id },
      include: {
        etiquetas: {
          include: {
            etiqueta: true
          }
        }
      }
    });

    if (!nota) return null;

    return {
      id: nota.id,
      titulo: nota.titulo,
      contenido: nota.contenido,
      color: nota.color,
      estaArchivado: nota.estaArchivado,
      estaFijado: nota.estaFijado,
      etiquetas: nota.etiquetas.map(ne => ({
        id: ne.etiqueta.id,
        texto: ne.etiqueta.texto,
        color: ne.etiqueta.color
      })),
      creadoEn: nota.creadoEn,
      editadoEn: nota.editadoEn
    };
  } catch (error) {
    console.error('Error al obtener nota por ID:', error);
    throw error;
  }
};

export const crearNota = async (datosNota) => {
  try {
    const { etiquetas = [], ...datosNotaSinEtiquetas } = datosNota;

    const nota = await prisma.nota.create({
      data: {
        titulo: datosNotaSinEtiquetas.titulo || '',
        contenido: datosNotaSinEtiquetas.contenido || '',
        color: datosNotaSinEtiquetas.color || '#FFE4B5',
        estaArchivado: datosNotaSinEtiquetas.estaArchivado || false,
        estaFijado: datosNotaSinEtiquetas.estaFijado || false
      }
    });

    if (etiquetas.length > 0) {
      await prisma.notaEtiqueta.createMany({
        data: etiquetas.map(etiqueta => ({
          notaId: nota.id,
          etiquetaId: etiqueta.id
        }))
      });
    }

    return await obtenerNotaPorId(nota.id);
  } catch (error) {
    console.error('Error al crear nota:', error);
    throw error;
  }
};

export const actualizarNota = async (id, datosActualizados) => {
  try {
    const { etiquetas, ...datosSinEtiquetas } = datosActualizados;

    const nota = await prisma.nota.update({
      where: { id },
      data: {
        titulo: datosSinEtiquetas.titulo,
        contenido: datosSinEtiquetas.contenido,
        color: datosSinEtiquetas.color,
        estaArchivado: datosSinEtiquetas.estaArchivado,
        estaFijado: datosSinEtiquetas.estaFijado
      }
    });

    if (etiquetas !== undefined) {
      await prisma.notaEtiqueta.deleteMany({
        where: { notaId: id }
      });

      if (etiquetas.length > 0) {
        await prisma.notaEtiqueta.createMany({
          data: etiquetas.map(etiqueta => ({
            notaId: id,
            etiquetaId: etiqueta.id
          }))
        });
      }
    }

    return await obtenerNotaPorId(id);
  } catch (error) {
    console.error('Error al actualizar nota:', error);
    throw error;
  }
};

export const eliminarNota = async (id) => {
  try {
    await prisma.nota.delete({
      where: { id }
    });
    return true;
  } catch (error) {
    console.error('Error al eliminar nota:', error);
    throw error;
  }
};

export const toggleFijarNota = async (id) => {
  try {
    const nota = await prisma.nota.findUnique({
      where: { id }
    });

    if (!nota) return null;

    const notaActualizada = await prisma.nota.update({
      where: { id },
      data: { estaFijado: !nota.estaFijado }
    });

    return await obtenerNotaPorId(id);
  } catch (error) {
    console.error('Error al fijar/desfijar nota:', error);
    throw error;
  }
};

export const toggleArchivarNota = async (id) => {
  try {
    const nota = await prisma.nota.findUnique({
      where: { id }
    });

    if (!nota) return null;

    const notaActualizada = await prisma.nota.update({
      where: { id },
      data: { estaArchivado: !nota.estaArchivado }
    });

    return await obtenerNotaPorId(id);
  } catch (error) {
    console.error('Error al archivar/desarchivar nota:', error);
    throw error;
  }
};

export const anadirEtiquetaANota = async (notaId, etiquetaId) => {
  try {
    const nota = await prisma.nota.findUnique({
      where: { id: notaId }
    });

    if (!nota) return null;

    const etiqueta = await prisma.etiqueta.findUnique({
      where: { id: etiquetaId }
    });

    if (!etiqueta) {
      throw new Error('Etiqueta no encontrada');
    }

    const relacionExistente = await prisma.notaEtiqueta.findUnique({
      where: {
        notaId_etiquetaId: {
          notaId: notaId,
          etiquetaId: etiquetaId
        }
      }
    });

    if (relacionExistente) {
      throw new Error('La etiqueta ya está asignada a esta nota');
    }

    await prisma.notaEtiqueta.create({
      data: {
        notaId: notaId,
        etiquetaId: etiquetaId
      }
    });

    return await obtenerNotaPorId(notaId);
  } catch (error) {
    console.error('Error al añadir etiqueta a nota:', error);
    throw error;
  }
};

export const eliminarEtiquetaDeNota = async (notaId, etiquetaId) => {
  try {
    const nota = await prisma.nota.findUnique({
      where: { id: notaId }
    });

    if (!nota) return null;

    await prisma.notaEtiqueta.delete({
      where: {
        notaId_etiquetaId: {
          notaId: notaId,
          etiquetaId: etiquetaId
        }
      }
    });

    return await obtenerNotaPorId(notaId);
  } catch (error) {
    console.error('Error al eliminar etiqueta de nota:', error);
    throw error;
  }
};

export const cambiarColorNota = async (id, color) => {
  try {
    const nota = await prisma.nota.findUnique({
      where: { id }
    });

    if (!nota) return null;

    await prisma.nota.update({
      where: { id },
      data: { color }
    });

    return await obtenerNotaPorId(id);
  } catch (error) {
    console.error('Error al cambiar color de nota:', error);
    throw error;
  }
};
