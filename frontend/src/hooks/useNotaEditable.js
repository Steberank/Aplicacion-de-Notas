import { useState } from 'react';

export const useNotaEditable = () => {
  const [mostrarNotaEditable, setMostrarNotaEditable] = useState(false);
  const [notaEditando, setNotaEditando] = useState(null);

  const abrirNotaEditable = (nota = null) => {
    setNotaEditando(nota);
    setMostrarNotaEditable(true);
  };

  const cerrarNotaEditable = () => {
    setMostrarNotaEditable(false);
    setNotaEditando(null);
  };

  return {
    mostrarNotaEditable,
    notaEditando,
    abrirNotaEditable,
    cerrarNotaEditable
  };
};

