-- Base de datos para la aplicación de notas
CREATE DATABASE IF NOT EXISTS notesapp;
USE notesapp;

-- Tabla de notas
CREATE TABLE IF NOT EXISTS notas (
  id INT AUTO_INCREMENT PRIMARY KEY,
  titulo VARCHAR(255) NOT NULL DEFAULT '',
  contenido TEXT,
  color VARCHAR(7) DEFAULT '#FFE4B5',
  esta_archivado BOOLEAN DEFAULT FALSE,
  esta_fijado BOOLEAN DEFAULT FALSE,
  creado_en TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  editado_en TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_archivado (esta_archivado),
  INDEX idx_fijado (esta_fijado)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Tabla de etiquetas
CREATE TABLE IF NOT EXISTS etiquetas (
  id INT AUTO_INCREMENT PRIMARY KEY,
  texto VARCHAR(50) NOT NULL UNIQUE,
  color VARCHAR(7) DEFAULT '#808080',
  creado_en TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Tabla intermedia para relación muchos a muchos entre notas y etiquetas
CREATE TABLE IF NOT EXISTS notas_etiquetas (
  nota_id INT NOT NULL,
  etiqueta_id INT NOT NULL,
  PRIMARY KEY (nota_id, etiqueta_id),
  FOREIGN KEY (nota_id) REFERENCES notas(id) ON DELETE CASCADE,
  FOREIGN KEY (etiqueta_id) REFERENCES etiquetas(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

