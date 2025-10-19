import React, { useRef } from 'react';
import './App.css'
import Sidebar from './components/UI/Sidebar'
import NoteContainer from './components/UI/NoteContainer'
import { useFiltroNotas } from './hooks/useFiltroNotas'
import { useNotas } from './hooks/useNotas'

function App() {
  const { tipoVista, etiquetaFiltro, mostrarTodas, mostrarArchivadas, mostrarPorEtiqueta } = useFiltroNotas();
  const { notas: ArrayNotas, etiquetas: ArrayEtiquetas, cargando, error, recargarDatos } = useNotas();
  const abrirNotaEditableRef = useRef(null);

  const handleAbrirNotaEditable = (nota) => {
    if (abrirNotaEditableRef.current) {
      abrirNotaEditableRef.current(nota);
    }
  };

  const filtrarNotas = () => {
    let notasFiltradas = ArrayNotas;

    if (tipoVista === 'archivadas') {
      notasFiltradas = ArrayNotas.filter(nota => nota.estaArchivado);
    } else if (tipoVista === 'etiqueta' && etiquetaFiltro) {
      notasFiltradas = ArrayNotas.filter(nota => 
        nota.etiquetas.some(etiqueta => etiqueta.id === etiquetaFiltro.id)
      );
    } else {
      notasFiltradas = ArrayNotas.filter(nota => !nota.estaArchivado);
    }

    return notasFiltradas;
  };

  const notasFiltradas = filtrarNotas();
  const notasFijadas = tipoVista === 'todas' ? 
    notasFiltradas.filter(nota => nota.estaFijado) : 
    [];
  
  const notasNoFijadas = tipoVista === 'todas' ? 
    notasFiltradas.filter(nota => !nota.estaFijado) : 
    [];

  const notasEspeciales = tipoVista !== 'todas' ? notasFiltradas : [];
  if (cargando) {
    return (
      <div className="app-container">
        <div className="cargando">
          <p>Cargando notas...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="app-container">
        <div className="error">
          <p>Error al cargar las notas: {error}</p>
          <button onClick={() => window.location.reload()}>Reintentar</button>
        </div>
      </div>
    );
  }

  return (
    <div className="app-container">
      <Sidebar 
        notas={ArrayNotas}
        etiquetas={ArrayEtiquetas}
        onMostrarTodas={mostrarTodas}
        onMostrarArchivadas={mostrarArchivadas}
        onMostrarPorEtiqueta={mostrarPorEtiqueta}
        tipoVista={tipoVista}
        etiquetaFiltro={etiquetaFiltro}
        onEtiquetasActualizadas={recargarDatos}
        onAbrirNotaEditable={handleAbrirNotaEditable}
      />
      <NoteContainer 
        notasFijadas={notasFijadas}
        notasNoFijadas={notasNoFijadas}
        notasEspeciales={notasEspeciales}
        tipoVista={tipoVista}
        etiquetaFiltro={etiquetaFiltro}
        etiquetasDisponibles={ArrayEtiquetas}
        onNotaActualizada={recargarDatos}
        onAbrirNotaEditable={abrirNotaEditableRef}
      />
    </div>
  )
};

export default App;
