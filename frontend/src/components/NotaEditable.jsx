import { useEffect, useRef, useState, useImperativeHandle, forwardRef } from 'react';
import './NotaEditable.css';
import BotonCircular from './BotonCircular';
import BotonTexto from './BotonTexto';
import Etiqueta from './Etiqueta';
import AnadirEtiqueta_aNota from './AnadirEtiqueta_aNota';
import { eliminarEtiquetaDeNota, cambiarColorNota, crearNota, eliminarNota, toggleFijarNota, toggleArchivarNota } from '../services/notesService';
import logoPin from '../assets/logo-pin.png';
import logoPaleta from '../assets/logo-paleta.png';
import logoEtiqueta from '../assets/logo-etiqueta.png';
import logoArchivar from '../assets/logo-archivar.png';
import logoBorrar from '../assets/logo-borrar.png';

const NotaEditable = forwardRef(({ 
  id, 
  color = 'white', 
  titulo = '', 
  contenido = '', 
  estaArchivado = false, 
  estaFijado = false, 
  etiquetas = [], 
  editadoEn,
  onCerrar,
  etiquetasDisponibles = [],
  onNotaActualizada
}, ref) => {
  const textareaRef = useRef(null);
  const notaRef = useRef(null);
  const [mostrarAnadirEtiqueta, setMostrarAnadirEtiqueta] = useState(false);
  
  const [tituloLocal, setTituloLocal] = useState(titulo);
  const [contenidoLocal, setContenidoLocal] = useState(contenido);

  const handleTextareaInput = (e) => {
    e.target.style.height = 'auto';
    e.target.style.height = e.target.scrollHeight + 'px';
  };

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = textareaRef.current.scrollHeight + 'px';
    }
  }, [contenidoLocal]);
  const handleAnadirEtiqueta = () => {
    setMostrarAnadirEtiqueta(true);
  };

  // Manejar cuando se añade una etiqueta
  const handleEtiquetaAnadida = (etiqueta) => {
    // Notificar al componente padre que se actualizó la nota
    onNotaActualizada?.();
  };

  // Cerrar popup de añadir etiqueta
  const cerrarAnadirEtiqueta = () => {
    setMostrarAnadirEtiqueta(false);
  };

  // Manejar eliminación de etiqueta
  const handleEliminarEtiqueta = async (etiquetaId) => {
    if (!id) return; // Solo para notas existentes

    try {
      await eliminarEtiquetaDeNota(id, etiquetaId);
      // Notificar al componente padre que se actualizó la nota
      onNotaActualizada?.();
    } catch (error) {
      console.error('Error al eliminar etiqueta:', error);
      // Aquí podrías mostrar un toast de error
    }
  };

  // Generar color aleatorio
  const generarColorAleatorio = () => {
    const colores = [
      '#FFE4B5', // Beige
      '#D4F1F4', // Azul claro
      '#C7CEEA', // Púrpura claro
      '#FFD6A5', // Naranja claro
      '#E0E0E0', // Gris claro
      '#A8E6CF', // Verde menta
      '#FFD3B6', // Melocotón
      '#FFAAA5', // Rosa claro
      '#B5EAD7', // Verde agua
      '#FF6B6B', // Rojo claro
      '#4ECDC4', // Turquesa
      '#45B7D1', // Azul cielo
      '#96CEB4', // Verde pastel
      '#FFEAA7', // Amarillo claro
      '#DDA0DD', // Ciruela claro
      '#98D8C8', // Verde azulado
      '#F7DC6F', // Amarillo dorado
      '#BB8FCE', // Lavanda
      '#85C1E9', // Azul bebé
      '#F8C471'  // Naranja pastel
    ];
    
    return colores[Math.floor(Math.random() * colores.length)];
  };

  // Manejar cambio de color
  const handleCambiarColor = async () => {
    if (!id) return; // Solo para notas existentes

    try {
      const nuevoColor = generarColorAleatorio();
      await cambiarColorNota(id, nuevoColor);
      // Notificar al componente padre que se actualizó la nota
      onNotaActualizada?.();
    } catch (error) {
      console.error('Error al cambiar color:', error);
      // Aquí podrías mostrar un toast de error
    }
  };

  // Manejar fijar/desfijar nota
  const handleToggleFijar = async () => {
    if (!id) return; // Solo para notas existentes

    try {
      await toggleFijarNota(id);
      // Notificar al componente padre que se actualizó la nota
      onNotaActualizada?.();
    } catch (error) {
      console.error('Error al fijar/desfijar nota:', error);
      // Aquí podrías mostrar un toast de error
    }
  };

  // Manejar archivar/desarchivar nota
  const handleToggleArchivar = async () => {
    if (!id) return; // Solo para notas existentes

    try {
      await toggleArchivarNota(id);
      // Notificar al componente padre que se actualizó la nota
      onNotaActualizada?.();
    } catch (error) {
      console.error('Error al archivar/desarchivar nota:', error);
      // Aquí podrías mostrar un toast de error
    }
  };

  // Manejar eliminación de nota
  const handleBorrarNota = async () => {
    if (!id) return; // Solo para notas existentes

    try {
      await eliminarNota(id);
      // Notificar al componente padre que se eliminó la nota
      onNotaActualizada?.();
      // Cerrar la nota después de eliminarla
      onCerrar();
    } catch (error) {
      console.error('Error al eliminar nota:', error);
      // Aquí podrías mostrar un toast de error
    }
  };

  // Manejar cierre de la nota
  const handleCerrar = async () => {
    // Si es una nota nueva (sin id) y tiene contenido o título
    if (!id && (tituloLocal.trim() || contenidoLocal.trim())) {
      try {
        const nuevaNota = await crearNota({
          titulo: tituloLocal.trim() || '',
          contenido: contenidoLocal.trim() || '',
          color: color,
          estaArchivado: false,
          estaFijado: false,
          etiquetas: etiquetas
        });
        
        // Notificar al componente padre que se creó la nota
        onNotaActualizada?.();
      } catch (error) {
        console.error('Error al crear nota:', error);
        // Aquí podrías mostrar un toast de error
      }
    }
    
    // Cerrar la nota
    onCerrar();
  };

  // Exponer handleCerrar a través de la ref
  useImperativeHandle(ref, () => ({
    handleCerrar: handleCerrar
  }));

  return (
    <div ref={notaRef} className="nota" style={{ backgroundColor: color }}>
      <div className="nota-encabezado">
        <div className="nota-titulo">
          <input 
            type="text" 
            placeholder="Titulo" 
            value={tituloLocal}
            onChange={(e) => setTituloLocal(e.target.value)}
            className="input-titulo"
          />
        </div>
        {id && (
          <div className="boton-fijar">
            <BotonCircular 
              logo={logoPin}
              textoHover={estaFijado ? "Dejar de fijar la nota" : "Fijar la nota"}
              colorFondo={color}
              onClick={handleToggleFijar}
            />
          </div>
        )}
      </div>
      
      <div className="nota-cuerpo">
        <textarea 
          ref={textareaRef}
          placeholder="Crear una nota..."
          value={contenidoLocal}
          onChange={(e) => setContenidoLocal(e.target.value)}
          className="textarea-contenido"
          onInput={handleTextareaInput}
        />
      </div>
      
      {id && (
        <div className="etiquetas-editado">
          <div className="etiquetas">
            {etiquetas && etiquetas.length > 0 && etiquetas.map((etiqueta) => (
              <Etiqueta 
                key={etiqueta.id}
                id={etiqueta.id}
                texto={etiqueta.texto}
                color={etiqueta.color}
                onClick={() => handleEliminarEtiqueta(etiqueta.id)}
              />
            ))}
          </div>
          <div className="editado">
            {editadoEn && `Editado en: ${editadoEn}`}
          </div>
        </div>
      )}
      
      <div className="nota-pie">
        <div className="pie-botones">
          {id && (
            <>
              <BotonCircular 
                logo={logoPaleta}
                textoHover="Cambiar color"
                colorFondo={color}
                onClick={handleCambiarColor}
              />
              <BotonCircular 
                logo={logoEtiqueta}
                textoHover="Añadir etiqueta"
                colorFondo={color}
                onClick={handleAnadirEtiqueta}
              />
              <BotonCircular 
                logo={logoArchivar}
                textoHover={estaArchivado ? "Desarchivar" : "Archivar"}
                colorFondo={color}
                onClick={handleToggleArchivar}
              />
              <BotonCircular 
                logo={logoBorrar}
                textoHover="Borrar Nota"
                colorFondo={color}
                onClick={handleBorrarNota}
              />
            </>
          )}
        </div>
        <div className="pie-cerrar">
          <BotonTexto 
            texto="Cerrar"
            colorFondo={color}
            onClick={handleCerrar}
          />
        </div>
      </div>

      {/* Popup para añadir etiqueta - Solo para notas existentes */}
      {mostrarAnadirEtiqueta && id && (
        <AnadirEtiqueta_aNota
          notaId={id}
          etiquetasDisponibles={etiquetasDisponibles}
          etiquetasActuales={etiquetas}
          onCerrar={cerrarAnadirEtiqueta}
          onEtiquetaAnadida={handleEtiquetaAnadida}
        />
      )}
    </div>
  );
});

export default NotaEditable;

