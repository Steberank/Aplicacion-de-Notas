-- Datos de ejemplo para la aplicación de notas
USE notesapp;

-- Insertar etiquetas de ejemplo
INSERT INTO etiquetas (id, texto, color) VALUES
(1, 'Personal', '#A8E6CF'),
(2, 'Importante', '#FFD3B6'),
(3, 'Compras', '#FFAAA5'),
(4, 'Trabajo', '#B5EAD7'),
(5, 'Urgente', '#FF6B6B'),
(6, 'React', '#FFAAA5')
ON DUPLICATE KEY UPDATE texto = VALUES(texto);

-- Insertar notas de ejemplo
INSERT INTO notas (id, titulo, contenido, color, esta_archivado, esta_fijado) VALUES
(1, 'Mi primera nota', 'Esta es una nota de ejemplo para probar el componente.', '#FFE4B5', FALSE, TRUE),
(2, 'Lista de compras', 'Comprar leche, pan, huevos y frutas para la semana.', '#D4F1F4', FALSE, FALSE),
(3, 'Reunión importante', 'Reunión con el equipo de desarrollo el lunes a las 10am.', '#C7CEEA', FALSE, TRUE),
(4, 'Ideas para el proyecto', 'Implementar dark mode, mejorar la interfaz de usuario, añadir búsqueda.', '#FFD6A5', FALSE, FALSE)
ON DUPLICATE KEY UPDATE titulo = VALUES(titulo);

-- Relacionar notas con etiquetas
INSERT INTO notas_etiquetas (nota_id, etiqueta_id) VALUES
(1, 1), -- Mi primera nota -> Personal
(1, 2), -- Mi primera nota -> Importante
(2, 3), -- Lista de compras -> Compras
(3, 4), -- Reunión importante -> Trabajo
(3, 5), -- Reunión importante -> Urgente
(4, 6)  -- Ideas para el proyecto -> React
ON DUPLICATE KEY UPDATE nota_id = VALUES(nota_id);

