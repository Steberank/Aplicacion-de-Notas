import express from 'express';
import * as notasController from '../controllers/notasController.js';

const router = express.Router();
router.get('/', notasController.obtenerNotas);

router.get('/:id', notasController.obtenerNotaPorId);

router.post('/', notasController.crearNota);

router.put('/:id', notasController.actualizarNota);

router.delete('/:id', notasController.eliminarNota);

router.patch('/:id/fijar', notasController.toggleFijarNota);

router.patch('/:id/archivar', notasController.toggleArchivarNota);

router.post('/:id/etiquetas', notasController.anadirEtiquetaANota);

router.delete('/:id/etiquetas/:etiquetaId', notasController.eliminarEtiquetaDeNota);

router.patch('/:id/cambiar-color', notasController.cambiarColorNota);

export default router;

