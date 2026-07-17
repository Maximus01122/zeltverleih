-- Split combined husse stehtisch material into anthrazit (23) and weiß (57).
-- Uses ID 57 because production already has materials 54–56.

UPDATE material
SET name = 'Hussen Stehtische (anthrazit)', total_count = 18
WHERE id = 23 AND name LIKE '%Hussen Stehtische%';

INSERT INTO material (id, name, category, total_count)
SELECT 57, 'Hussen Stehtische (weiß)', 'TISCHE_BAENKE_STUEHLE', 17
FROM DUAL
WHERE NOT EXISTS (SELECT 1 FROM material WHERE id = 57);

INSERT INTO material_price (material_id, daily_price, weekend_price, assembly_price, valid_from)
SELECT 57, 4.00, 5.50, 0.00, '2000-01-01'
FROM DUAL
WHERE NOT EXISTS (SELECT 1 FROM material_price WHERE material_id = 57);
