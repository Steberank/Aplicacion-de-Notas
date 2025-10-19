import './BotonSidebar.css';

const BotonSidebar = ({ logo, texto, onClick }) => {
  return (
    <button className="boton-sidebar" onClick={onClick}>
      {logo && <img src={logo} alt={texto} className="boton-sidebar-logo" />}
      <span className="boton-sidebar-texto">{texto}</span>
    </button>
  );
};

export default BotonSidebar;

