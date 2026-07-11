-- Material-Stammdaten für Zeltverleih Erfurt
-- Sortierung über feste IDs (kleinere ID = weiter oben in der Liste)
-- Preise: Tages-/Wochenendpreis laut Website (zzgl. MwSt.)

SET NAMES utf8mb4;
SET CHARACTER SET utf8mb4;

SET FOREIGN_KEY_CHECKS = 0;
DELETE FROM material_price;
DELETE FROM material;
SET FOREIGN_KEY_CHECKS = 1;

ALTER TABLE material MODIFY category VARCHAR(50) NOT NULL;

INSERT INTO material (id, name, category, total_count) VALUES
-- Zelte (Größe), dann Zubehör
(1,  'Zelt XS (4×2 m)', 'ZELTE', 1),
(2,  'Zelt S (3×3 m)', 'ZELTE', 1),
(3,  'Zelt Pagode (3×3 m)', 'ZELTE', 1),
(4,  'Zelt M/1 (4×4 m)', 'ZELTE', 1),
(5,  'Zelt M/2 (3×6 m)', 'ZELTE', 3),
(6,  'Zelt L (4×6 m)', 'ZELTE', 2),
(7,  'Zelt XL/1 (4×8 m)', 'ZELTE', 2),
(8,  'Zelt XL/2 (4×9 m)', 'ZELTE', 1),
(9,  'Zelt XXL (4×10 m)', 'ZELTE', 2),
(10, 'Zeltfußboden (je qm)', 'ZELTE', 50),
(11, 'Ballastierung (je Zelt)', 'ZELTE', 10),
(12, 'Regenrinne für Längs- oder Giebelseite', 'ZELTE', 6),
-- Tische & Bänke
(13, 'Biertischgarnitur mit 2 Bänken', 'TISCHE_BAENKE_STUEHLE', 22),
(14, 'Biergartentisch', 'TISCHE_BAENKE_STUEHLE', 22),
(15, 'Biergartenstühle', 'TISCHE_BAENKE_STUEHLE', 47),
(16, 'Buffettisch, extra breit', 'TISCHE_BAENKE_STUEHLE', 5),
(17, 'Stehtische', 'TISCHE_BAENKE_STUEHLE', 17),
(18, 'Polsterstühle', 'TISCHE_BAENKE_STUEHLE', 100),
(19, 'Hussen Bierzeltgarnitur (weiß, ungebügelt) - bei Miete mit Biertischgarnitur', 'TISCHE_BAENKE_STUEHLE', 17),
(20, 'Hussen Bierzeltgarnitur (weiß, ungebügelt) - ohne Miete Biertischgarnitur', 'TISCHE_BAENKE_STUEHLE', 17),
(21, 'Hussen Bierzeltgarnitur (weiß, gebügelt) - bei Miete mit Biertischgarnitur', 'TISCHE_BAENKE_STUEHLE', 17),
(22, 'Hussen Bierzeltgarnitur (weiß, gebügelt) - ohne Miete Biertischgarnitur', 'TISCHE_BAENKE_STUEHLE', 17),
(23, 'Hussen Stehtische (anthrazit oder weiß)', 'TISCHE_BAENKE_STUEHLE', 35),
(24, 'Tischdecke (dunkelgrau) für Biergartentisch', 'TISCHE_BAENKE_STUEHLE', 12),
(25, 'Tischdecke (dunkelrot) für Biertischgarnitur', 'TISCHE_BAENKE_STUEHLE', 20),
(26, 'Sitzpolster (dunkelrot) für Biergartenstühle', 'TISCHE_BAENKE_STUEHLE', 48),
(27, 'Sitzpolster (dunkelrot) für Bierbank', 'TISCHE_BAENKE_STUEHLE', 40),
(28, 'Bodenschoner für Biertischgarnituren (je Satz)', 'TISCHE_BAENKE_STUEHLE', 10),
(29, 'Tischdeckenklammern (Satz)', 'TISCHE_BAENKE_STUEHLE', 10),
-- Licht & Schatten
(30, 'Party-Lichterkette mit 10 bunten oder weißen Glühlampen', 'LICHT_SCHATTEN', 6),
(31, 'LED-Leuchte 30 Watt', 'LICHT_SCHATTEN', 4),
(32, 'LED-Tischleuchte (mehrfarbig)', 'LICHT_SCHATTEN', 8),
(33, 'Ampelschirm, Durchmesser 3,30 m', 'LICHT_SCHATTEN', 1),
(34, 'Schirmständer + Gewichte', 'LICHT_SCHATTEN', 1),
(35, 'Sonnensegel 3,6 × 3,6 m', 'LICHT_SCHATTEN', 1),
(36, 'Sonnensegel 4,0 × 3,0 m', 'LICHT_SCHATTEN', 1),
(37, 'Sonnensegel 5,0 × 5,0 m', 'LICHT_SCHATTEN', 1),
(38, 'Befestigungsset für Sonnensegel', 'LICHT_SCHATTEN', 2),
-- Wärme & Kälte
(39, 'Kühlschrank ca. 120 l', 'WAERME_KAELTE', 2),
(40, 'Klimagerät, Kühlleistung 2,6 kW', 'WAERME_KAELTE', 1),
(41, 'Zeltheizung, elektrisch (240 Volt, 3 kW)', 'WAERME_KAELTE', 4),
(42, 'Zeltheizung, elektrisch (400 Volt, 9 kW)', 'WAERME_KAELTE', 4),
(43, 'Verlängerungskabel 25 m, 240 Volt', 'WAERME_KAELTE', 1),
(44, 'Verlängerungskabel 25 m, 400 Volt', 'WAERME_KAELTE', 1),
(45, 'Verlängerungskabel 10 m, 400 Volt', 'WAERME_KAELTE', 2),
(46, 'Feuerschale', 'WAERME_KAELTE', 1),
(47, 'Brennmaterial (Anzünd- & Feuerholz + Anzündwolle)', 'WAERME_KAELTE', 1),
-- Aktivitäten
(48, 'Mobile Tischtennisplatte', 'AKTIVITAETEN', 2),
(49, 'Tischkicker', 'AKTIVITAETEN', 1),
(50, 'Hufeisenwerfen (zum Selbstaufbau)', 'AKTIVITAETEN', 1),
(51, 'Hufeisenwerfen (mit Montage)', 'AKTIVITAETEN', 1),
(52, 'Jenga (Wackelturm)', 'AKTIVITAETEN', 1),
(53, 'Kegeln', 'AKTIVITAETEN', 1);

INSERT INTO material_price (material_id, daily_price, weekend_price, assembly_price, valid_from) VALUES
(1,  65.00,  95.00, 165.00, '2000-01-01'),
(2,  75.00, 105.00, 165.00, '2000-01-01'),
(3,  80.00, 115.00, 175.00, '2000-01-01'),
(4,  85.00, 125.00, 185.00, '2000-01-01'),
(5,  90.00, 130.00, 195.00, '2000-01-01'),
(6,  100.00, 145.00, 205.00, '2000-01-01'),
(7,  110.00, 170.00, 295.00, '2000-01-01'),
(8,  125.00, 185.00, 325.00, '2000-01-01'),
(9,  140.00, 200.00, 355.00, '2000-01-01'),
(10,  3.00,   4.00,   5.00, '2000-01-01'),
(11, 25.00,  25.00,   0.00, '2000-01-01'),
(12,  6.50,   9.50,  24.50, '2000-01-01'),
(13,  9.50,  13.50,   6.00, '2000-01-01'),
(14,  8.00,  10.00,   2.00, '2000-01-01'),
(15,  3.00,   4.00,   2.00, '2000-01-01'),
(16,  9.50,  13.50,   2.00, '2000-01-01'),
(17,  8.00,  10.00,   2.00, '2000-01-01'),
(18,  4.00,   5.00,   2.00, '2000-01-01'),
(19,  5.00,   7.00,   0.00, '2000-01-01'),
(20,  6.50,   8.50,   0.00, '2000-01-01'),
(21, 15.50,  18.50,   0.00, '2000-01-01'),
(22, 17.50,  21.00,   0.00, '2000-01-01'),
(23,  4.00,   5.50,   0.00, '2000-01-01'),
(24,  4.00,   5.50,   0.00, '2000-01-01'),
(25,  4.00,   5.50,   0.00, '2000-01-01'),
(26,  2.00,   2.50,   0.00, '2000-01-01'),
(27,  2.50,   3.50,   0.00, '2000-01-01'),
(28,  2.50,   3.50,   0.00, '2000-01-01'),
(29,  2.00,   2.50,   0.00, '2000-01-01'),
(30,  8.50,  12.50,   0.00, '2000-01-01'),
(31,  8.50,  12.50,   0.00, '2000-01-01'),
(32,  6.50,   9.50,   0.00, '2000-01-01'),
(33, 27.50,  39.50,   0.00, '2000-01-01'),
(34, 10.50,  14.50,   0.00, '2000-01-01'),
(35, 14.00,  19.50,   0.00, '2000-01-01'),
(36, 14.00,  19.50,   0.00, '2000-01-01'),
(37, 21.00,  29.50,   0.00, '2000-01-01'),
(38,  5.50,   7.50,   0.00, '2000-01-01'),
(39, 30.00,  40.00,   0.00, '2000-01-01'),
(40, 30.00,  43.00,   0.00, '2000-01-01'),
(41, 15.00,  20.00,   0.00, '2000-01-01'),
(42, 30.00,  45.00,   0.00, '2000-01-01'),
(43,  7.00,   9.50,   0.00, '2000-01-01'),
(44, 12.50,  17.50,   0.00, '2000-01-01'),
(45,  7.00,   9.50,   0.00, '2000-01-01'),
(46, 13.50,  19.50,   0.00, '2000-01-01'),
(47,  9.50,   9.50,   0.00, '2000-01-01'),
(48, 17.50,  24.50,   0.00, '2000-01-01'),
(49, 26.50,  37.50,   0.00, '2000-01-01'),
(50, 17.50,  24.50,  10.00, '2000-01-01'),
(51, 42.50,  49.50,  35.00, '2000-01-01'),
(52, 13.50,  19.50,   0.00, '2000-01-01'),
(53, 13.50,  19.50,   0.00, '2000-01-01');

ALTER TABLE material AUTO_INCREMENT = 54;

SELECT COUNT(*) AS materialien FROM material;
SELECT COUNT(*) AS preise FROM material_price;
