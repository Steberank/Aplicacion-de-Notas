import React, { useRef } from 'react';
import './NoteContainer.css';
import NotaListada from '../NotaListada';
import BotonCrearNota from '../BotonCrearNota';
import NotaEditable from '../NotaEditable';
import { useNotaEditable } from '../../hooks/useNotaEditable';

const NoteContainer = ({ 
  notasFijadas, 
  notasNoFijadas, 
  notasEspeciales, 
  tipoVista, 
  etiquetaFiltro,
  etiquetasDisponibles = [],
  onNotaActualizada,
  onAbrirNotaEditable
}) => {
  const { mostrarNotaEditable, notaEditando, abrirNotaEditable, cerrarNotaEditable } = useNotaEditable();
  const notaEditableRef = useRef(null);

  // Exponer la función abrirNotaEditable al componente padre
  React.useEffect(() => {
    if (onAbrirNotaEditable) {
      onAbrirNotaEditable.current = abrirNotaEditable;
    }
  }, [abrirNotaEditable, onAbrirNotaEditable]);

  return (
    <div className="note-container">
      <BotonCrearNota onClick={() => abrirNotaEditable()} />
      
      {/* Vista por defecto: Notas fijadas y no fijadas */}
      {tipoVista === 'todas' && (
        <>
          {/* Notas fijadas */}
          {notasFijadas.length > 0 && (
            <>
              <h3 className="seccion-titulo">Fijadas</h3>
              <div className="notas-grid">
                {notasFijadas.map(nota => (
                  <NotaListada
                    key={nota.id}
                    id={nota.id}
                    color={nota.color}
                    titulo={nota.titulo}
                    contenido={nota.contenido}
                    etiquetas={nota.etiquetas}
                    estaArchivado={nota.estaArchivado}
                    estaFijado={nota.estaFijado}
                    editadoEn={nota.editadoEn}
                    onClick={() => abrirNotaEditable(nota)}
                  />
                ))}
              </div>
            </>
          )}
          
          {/* Notas no fijadas */}
          {notasNoFijadas.length > 0 && (
            <>
              <h3 className="seccion-titulo">Otras</h3>
              <div className="notas-grid">
                {notasNoFijadas.map(nota => (
                  <NotaListada
                    key={nota.id}
                    id={nota.id}
                    color={nota.color}
                    titulo={nota.titulo}
                    contenido={nota.contenido}
                    etiquetas={nota.etiquetas}
                    estaArchivado={nota.estaArchivado}
                    estaFijado={nota.estaFijado}
                    editadoEn={nota.editadoEn}
                    onClick={() => abrirNotaEditable(nota)}
                  />
                ))}
              </div>
            </>
          )}
        </>
      )}

      {/* Vista de archivadas */}
      {tipoVista === 'archivadas' && notasEspeciales.length > 0 && (
        <>
          <h3 className="seccion-titulo">Notas Archivadas</h3>
          <div className="notas-grid">
            {notasEspeciales.map(nota => (
              <NotaListada
                key={nota.id}
                id={nota.id}
                color={nota.color}
                titulo={nota.titulo}
                contenido={nota.contenido}
                etiquetas={nota.etiquetas}
                estaArchivado={nota.estaArchivado}
                estaFijado={nota.estaFijado}
                editadoEn={nota.editadoEn}
                onClick={() => abrirNotaEditable(nota)}
              />
            ))}
          </div>
        </>
      )}

      {/* Vista por etiqueta */}
      {tipoVista === 'etiqueta' && notasEspeciales.length > 0 && (
        <>
          <h3 className="seccion-titulo">
            Etiqueta: {etiquetaFiltro?.texto}
          </h3>
          <div className="notas-grid">
            {notasEspeciales.map(nota => (
              <NotaListada
                key={nota.id}
                id={nota.id}
                color={nota.color}
                titulo={nota.titulo}
                contenido={nota.contenido}
                etiquetas={nota.etiquetas}
                estaArchivado={nota.estaArchivado}
                estaFijado={nota.estaFijado}
                editadoEn={nota.editadoEn}
                onClick={() => abrirNotaEditable(nota)}
              />
            ))}
          </div>
        </>
      )}

      {/* Mensaje cuando no hay notas */}
      {((tipoVista === 'todas' && notasFijadas.length === 0 && notasNoFijadas.length === 0) ||
        (tipoVista !== 'todas' && notasEspeciales.length === 0)) && (
        <div className="sin-notas">
          <p>
            {tipoVista === 'archivadas' ? 'No hay notas archivadas' :
             tipoVista === 'etiqueta' ? `No hay notas con la etiqueta "${etiquetaFiltro?.texto}"` :
             'No hay notas'}
          </p>
        </div>
      )}

      {/* Popup NotaEditable */}
      {mostrarNotaEditable && (
        <div className="nota-editable-overlay" onClick={() => {
          // Usar la función handleCerrar del componente NotaEditable
          if (notaEditableRef.current) {
            notaEditableRef.current.handleCerrar();
          } else {
            cerrarNotaEditable();
          }
        }}>
          <div onClick={(e) => e.stopPropagation()}>
            <NotaEditable 
              ref={notaEditableRef}
              {...notaEditando}
              onCerrar={cerrarNotaEditable}
              etiquetasDisponibles={etiquetasDisponibles}
              onNotaActualizada={onNotaActualizada}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default NoteContainer;

