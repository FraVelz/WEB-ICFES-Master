-- Backfill content.block en lecciones fase 1 (learning_content.phase = 1)
-- Proyecto: web-icfes-master (lfijpvklueklhbywvuhf)
-- Nota: hay 10 lecciones legacy (order_index 1-10) + 115 del catálogo (11-125) = 125 por área.

BEGIN;

-- Legacy intro (order_index 1-10) -> primer bloque de cada área
UPDATE learning_content SET content = jsonb_set(content, '{block}', '"numeros"', true)
WHERE area = 'matematicas' AND phase = 1 AND order_index BETWEEN 1 AND 10;

UPDATE learning_content SET content = jsonb_set(content, '{block}', '"comprension"', true)
WHERE area = 'lectura_critica' AND phase = 1 AND order_index BETWEEN 1 AND 10;

UPDATE learning_content SET content = jsonb_set(content, '{block}', '"biologia"', true)
WHERE area = 'ciencias_naturales' AND phase = 1 AND order_index BETWEEN 1 AND 10;

UPDATE learning_content SET content = jsonb_set(content, '{block}', '"historia"', true)
WHERE area = 'sociales' AND phase = 1 AND order_index BETWEEN 1 AND 10;

UPDATE learning_content SET content = jsonb_set(content, '{block}', '"grammar"', true)
WHERE area = 'ingles' AND phase = 1 AND order_index BETWEEN 1 AND 10;

-- Matemáticas (catálogo offset +10)
UPDATE learning_content SET content = jsonb_set(content, '{block}', '"numeros"', true)
WHERE area = 'matematicas' AND phase = 1 AND order_index BETWEEN 11 AND 35;

UPDATE learning_content SET content = jsonb_set(content, '{block}', '"algebra"', true)
WHERE area = 'matematicas' AND phase = 1 AND order_index BETWEEN 36 AND 50;

UPDATE learning_content SET content = jsonb_set(content, '{block}', '"funciones"', true)
WHERE area = 'matematicas' AND phase = 1 AND order_index BETWEEN 51 AND 60;

UPDATE learning_content SET content = jsonb_set(content, '{block}', '"estadistica"', true)
WHERE area = 'matematicas' AND phase = 1 AND order_index BETWEEN 61 AND 82;

UPDATE learning_content SET content = jsonb_set(content, '{block}', '"geometria"', true)
WHERE area = 'matematicas' AND phase = 1 AND order_index BETWEEN 83 AND 125;

-- Lectura crítica
UPDATE learning_content SET content = jsonb_set(content, '{block}', '"comprension"', true)
WHERE area = 'lectura_critica' AND phase = 1 AND order_index BETWEEN 11 AND 80;

UPDATE learning_content SET content = jsonb_set(content, '{block}', '"argumentacion"', true)
WHERE area = 'lectura_critica' AND phase = 1 AND order_index BETWEEN 81 AND 125;

-- Ciencias naturales
UPDATE learning_content SET content = jsonb_set(content, '{block}', '"biologia"', true)
WHERE area = 'ciencias_naturales' AND phase = 1 AND order_index BETWEEN 11 AND 55;

UPDATE learning_content SET content = jsonb_set(content, '{block}', '"quimica"', true)
WHERE area = 'ciencias_naturales' AND phase = 1 AND order_index BETWEEN 56 AND 95;

UPDATE learning_content SET content = jsonb_set(content, '{block}', '"fisica"', true)
WHERE area = 'ciencias_naturales' AND phase = 1 AND order_index BETWEEN 96 AND 125;

-- Sociales
UPDATE learning_content SET content = jsonb_set(content, '{block}', '"historia"', true)
WHERE area = 'sociales' AND phase = 1 AND order_index BETWEEN 11 AND 50;

UPDATE learning_content SET content = jsonb_set(content, '{block}', '"geografia"', true)
WHERE area = 'sociales' AND phase = 1 AND order_index BETWEEN 51 AND 80;

UPDATE learning_content SET content = jsonb_set(content, '{block}', '"ciudadania"', true)
WHERE area = 'sociales' AND phase = 1 AND order_index BETWEEN 81 AND 125;

-- Inglés
UPDATE learning_content SET content = jsonb_set(content, '{block}', '"grammar"', true)
WHERE area = 'ingles' AND phase = 1 AND order_index BETWEEN 11 AND 70;

UPDATE learning_content SET content = jsonb_set(content, '{block}', '"reading"', true)
WHERE area = 'ingles' AND phase = 1 AND order_index BETWEEN 71 AND 100;

UPDATE learning_content SET content = jsonb_set(content, '{block}', '"vocabulary"', true)
WHERE area = 'ingles' AND phase = 1 AND order_index BETWEEN 101 AND 125;

COMMIT;
