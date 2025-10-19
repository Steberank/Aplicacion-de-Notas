import { useState } from 'react';

export const useFiltroNotas = () => {
  const [tipoVista, setTipoVista] = useState('todas');
  const [etiquetaFiltro, setEtiquetaFiltro] = useState(null);

  const mostrarTodas = () => {
    setTipoVista('todas');
    setEtiquetaFiltro(null);
  };

  const mostrarArchivadas = () => {
    setTipoVista('archivadas');
    setEtiquetaFiltro(null);
  };

  const mostrarPorEtiqueta = (etiqueta) => {
    setTipoVista('etiqueta');
    setEtiquetaFiltro(etiqueta);
  };

  return {
    tipoVista,
    etiquetaFiltro,
    mostrarTodas,
    mostrarArchivadas,
    mostrarPorEtiqueta
  };
};
