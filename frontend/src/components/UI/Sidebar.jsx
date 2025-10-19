import { useState, useMemo } from 'react';
import Fuse from 'fuse.js';
import './Sidebar.css';
import BotonSidebar from '../BotonSidebar';
import MenuEtiquetas from '../MenuEtiquetas';
import logoEtiquetaMap from '../../assets/logo-etiquetaMap.png';
import logoEtiqueta from '../../assets/logo-etiqueta.png';
import logoArchivar from '../../assets/logo-archivar.png';
import logoNota from '../../assets/logo-nota.png';

const Sidebar = ({ 
  notas, 
  etiquetas, 
  onMostrarTodas, 
  onMostrarArchivadas, 
  onMostrarPorEtiqueta, 
  tipoVista, 
  etiquetaFiltro,
  onEtiquetasActualizadas,
  onAbrirNotaEditable
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [mostrarMenuEtiquetas, setMostrarMenuEtiquetas] = useState(false);

  // Configurar Fuse.js para notas
  const fuseNotas = useMemo(() => {
    const options = {
      keys: ['titulo'],
      threshold: 0.3,
      includeScore: true,
      minMatchCharLength: 2
    };
    return new Fuse(notas, options);
  }, [notas]);

  // Configurar Fuse.js para etiquetas
  const fuseEtiquetas = useMemo(() => {
    const options = {
      keys: ['texto'],
      threshold: 0.3,
      includeScore: true,
      minMatchCharLength: 2
    };
    return new Fuse(etiquetas, options);
  }, [etiquetas]);

  const handleSearch = (e) => {
    const query = e.target.value;
    setSearchQuery(query);

    if (query.trim().length >= 2) {
      // Buscar en notas
      const resultadosNotas = fuseNotas.search(query).slice(0, 5).map(result => ({
        tipo: 'nota',
        data: result.item
      }));

      // Buscar en etiquetas
      const resultadosEtiquetas = fuseEtiquetas.search(query).slice(0, 3).map(result => ({
        tipo: 'etiqueta',
        data: result.item
      }));

      setSearchResults([...resultadosEtiquetas, ...resultadosNotas]);
    } else {
      setSearchResults([]);
    }
  };

  const handleSelectResult = (result) => {
    if (result.tipo === 'nota') {
      // Abrir NotaEditable con la nota seleccionada
      onAbrirNotaEditable?.(result.data);
    } else {
      // Filtrar notas por la etiqueta seleccionada
      onMostrarPorEtiqueta?.(result.data);
    }
    setSearchQuery('');
    setSearchResults([]);
  };

  const handleAbrirMenuEtiquetas = () => {
    setMostrarMenuEtiquetas(true);
  };

  const handleCerrarMenuEtiquetas = () => {
    setMostrarMenuEtiquetas(false);
  };

  const handleEtiquetasActualizadas = () => {
    // Notificar al componente padre que se actualizaron las etiquetas
    onEtiquetasActualizadas?.();
  };

  return (
    <div className="sidebar">
      <div className="sidebar-top">
        <div className="search-container">
          <input
            type="text"
            className="search-input"
            placeholder="Buscar notas o etiquetas..."
            value={searchQuery}
            onChange={handleSearch}
          />
          
          {searchResults.length > 0 && (
            <div className="search-results">
              {searchResults.map((result, index) => (
                <div
                  key={`${result.tipo}-${result.data.id}-${index}`}
                  className="search-result-item"
                  onClick={() => handleSelectResult(result)}
                >
                  <span className="result-type">
                    {result.tipo === 'nota' ? '📝' : '🏷️'}
                  </span>
                  <span className="result-text">
                    {result.tipo === 'nota' ? result.data.titulo : result.data.texto}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <div className="sidebar-bottom">
        {/* Botón Ver Todas las Notas */}
        <BotonSidebar
          logo={logoNota}
          texto="Todas las notas"
          onClick={onMostrarTodas}
        />

        {/* Mapear etiquetas */}
        {etiquetas && etiquetas.map((etiqueta) => (
          <BotonSidebar
            key={etiqueta.id}
            logo={logoEtiquetaMap}
            texto={etiqueta.texto}
            onClick={() => onMostrarPorEtiqueta(etiqueta)}
          />
        ))}
        
        {/* Botón Editar Etiquetas */}
        <BotonSidebar
          logo={logoEtiqueta}
          texto="Editar Etiquetas"
          onClick={handleAbrirMenuEtiquetas}
        />
        
        {/* Botón Ver Archivados */}
        <BotonSidebar
          logo={logoArchivar}
          texto="Ver Archivados"
          onClick={onMostrarArchivadas}
        />
      </div>

      {/* Menu de gestión de etiquetas */}
      {mostrarMenuEtiquetas && (
        <MenuEtiquetas
          onCerrar={handleCerrarMenuEtiquetas}
          onEtiquetasActualizadas={handleEtiquetasActualizadas}
        />
      )}
    </div>
  );
};

export default Sidebar;

