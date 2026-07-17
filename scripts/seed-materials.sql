-- Material-Stammdaten für Zeltverleih Erfurt
-- IDs entsprechen der Produktions-DB (10, 20, … 580)
-- Preise: Tages-/Wochenendpreis laut Website (zzgl. MwSt.)

SET NAMES utf8mb4;
SET CHARACTER SET utf8mb4;

SET FOREIGN_KEY_CHECKS = 0;
DELETE FROM material_price;
DELETE FROM material;
SET FOREIGN_KEY_CHECKS = 1;

ALTER TABLE material MODIFY category VARCHAR(50) NOT NULL;

INSERT INTO material (id, name, category, total_count) VALUES
-- Zelte
(10,  'Zelt XS (4×2 m)', 'ZELTE', 1),
(20,  'Zelt S (3×3 m)', 'ZELTE', 1),
(30,  'Zelt Pagode (3×3 m)', 'ZELTE', 1),
(40,  'Zelt M/1 (4×4 m)', 'ZELTE', 1),
(50,  'Zelt M/2 (3×6 m)', 'ZELTE', 3),
(60,  'Zelt L (4×6 m)', 'ZELTE', 2),
(70,  'Zelt XL/1 (4×8 m)', 'ZELTE', 2),
(80,  'Zelt XL/2 (4×9 m)', 'ZELTE', 1),
(90,  'Zelt XXL (4×10 m)', 'ZELTE', 2),
(100, 'Zeltfußboden (je qm)', 'ZELTE', 50),
(110, 'Abkantung', 'ZELTE', 4),
(120, 'Ballastierung (je Zelt)', 'ZELTE', 10),
(130, 'Regenrinne für Längs- oder Giebelseite', 'ZELTE', 6),
-- Tische & Bänke
(140, 'Biertischgarnitur mit 2 Bänken', 'TISCHE_BAENKE_STUEHLE', 22),
(150, 'Biergartentisch', 'TISCHE_BAENKE_STUEHLE', 22),
(160, 'Biergartenstühle', 'TISCHE_BAENKE_STUEHLE', 47),
(170, 'Buffettisch, extra breit', 'TISCHE_BAENKE_STUEHLE', 5),
(180, 'einzelne Tische', 'TISCHE_BAENKE_STUEHLE', 22),
(190, 'einzelne Bänke', 'TISCHE_BAENKE_STUEHLE', 48),
(200, 'Stehtische', 'TISCHE_BAENKE_STUEHLE', 17),
(210, 'Polsterstühle', 'TISCHE_BAENKE_STUEHLE', 100),
(220, 'Hussen Bierzeltgarnitur (weiß, ungebügelt) - bei Miete mit Biertischgarnitur', 'TISCHE_BAENKE_STUEHLE', 17),
(230, 'Hussen Bierzeltgarnitur (weiß, ungebügelt) - ohne Miete Biertischgarnitur', 'TISCHE_BAENKE_STUEHLE', 17),
(240, 'Hussen Bierzeltgarnitur (weiß, gebügelt) - bei Miete mit Biertischgarnitur', 'TISCHE_BAENKE_STUEHLE', 17),
(250, 'Hussen Bierzeltgarnitur (weiß, gebügelt) - ohne Miete Biertischgarnitur', 'TISCHE_BAENKE_STUEHLE', 17),
(260, 'Hussen Stehtische (anthrazit)', 'TISCHE_BAENKE_STUEHLE', 15),
(270, 'Hussen Stehtische (weiss)', 'TISCHE_BAENKE_STUEHLE', 20),
(280, 'Tischdecke (dunkelgrau) für Biergartentisch', 'TISCHE_BAENKE_STUEHLE', 12),
(290, 'Tischdecke (dunkelrot) für Biertischgarnitur', 'TISCHE_BAENKE_STUEHLE', 20),
(300, 'Sitzpolster (dunkelrot) für Biergartenstühle', 'TISCHE_BAENKE_STUEHLE', 48),
(310, 'Sitzpolster (dunkelrot) für Bierbank', 'TISCHE_BAENKE_STUEHLE', 40),
(320, 'Bodenschoner für Biertischgarnituren (je Satz)', 'TISCHE_BAENKE_STUEHLE', 10),
(330, 'Tischdeckenklammern (Satz)', 'TISCHE_BAENKE_STUEHLE', 10),
-- Licht & Schatten
(340, 'Party-Lichterkette mit 10 bunten oder weißen Glühlampen', 'LICHT_SCHATTEN', 6),
(350, 'LED-Leuchte 30 Watt', 'LICHT_SCHATTEN', 4),
(360, 'LED-Tischleuchte (mehrfarbig)', 'LICHT_SCHATTEN', 8),
(370, 'Ampelschirm, Durchmesser 3,30 m', 'LICHT_SCHATTEN', 1),
(380, 'Schirmständer + Gewichte', 'LICHT_SCHATTEN', 1),
(390, 'Sonnensegel 3,6 × 3,6 m', 'LICHT_SCHATTEN', 1),
(400, 'Sonnensegel 4,0 × 3,0 m', 'LICHT_SCHATTEN', 1),
(410, 'Sonnensegel 5,0 × 5,0 m', 'LICHT_SCHATTEN', 1),
(420, 'Befestigungsset für Sonnensegel', 'LICHT_SCHATTEN', 2),
-- Wärme & Kälte
(430, 'Kühlschrank ca. 120 l', 'WAERME_KAELTE', 2),
(440, 'Flaschenkühlschrank mit Glastür und blauer LED-Beleuchtung, ca. 90 l', 'WAERME_KAELTE', 1),
(450, 'Klimagerät, Kühlleistung 2,6 kW', 'WAERME_KAELTE', 1),
(460, 'Zeltheizung, elektrisch (240 Volt, 3 kW)', 'WAERME_KAELTE', 4),
(470, 'Zeltheizung, elektrisch (400 Volt, 9 kW)', 'WAERME_KAELTE', 4),
(480, 'Verlängerungskabel 25 m, 240 Volt', 'WAERME_KAELTE', 1),
(490, 'Verlängerungskabel 25 m, 400 Volt', 'WAERME_KAELTE', 1),
(500, 'Verlängerungskabel 10 m, 400 Volt', 'WAERME_KAELTE', 2),
(510, 'Feuerschale', 'WAERME_KAELTE', 1),
(520, 'Brennmaterial (Anzünd- & Feuerholz + Anzündwolle)', 'WAERME_KAELTE', 1),
-- Aktivitäten
(530, 'Mobile Tischtennisplatte', 'AKTIVITAETEN', 2),
(540, 'Tischkicker', 'AKTIVITAETEN', 1),
(550, 'Hufeisenwerfen (zum Selbstaufbau)', 'AKTIVITAETEN', 1),
(560, 'Hufeisenwerfen (mit Montage)', 'AKTIVITAETEN', 1),
(570, 'Jenga (Wackelturm)', 'AKTIVITAETEN', 1),
(580, 'Kegeln', 'AKTIVITAETEN', 1);

INSERT INTO material_price (material_id, daily_price, weekend_price, assembly_price, valid_from) VALUES
(10,  65.00,  95.00, 225.00, '2000-01-01'),
(20,  75.00, 105.00, 225.00, '2000-01-01'),
(30,  80.00, 115.00, 235.00, '2000-01-01'),
(40,  85.00, 125.00, 245.00, '2000-01-01'),
(50,  90.00, 130.00, 255.00, '2000-01-01'),
(60, 100.00, 145.00, 305.00, '2000-01-01'),
(70, 110.00, 170.00, 365.00, '2000-01-01'),
(80, 125.00, 185.00, 395.00, '2000-01-01'),
(90, 140.00, 200.00, 425.00, '2000-01-01'),
(100,  3.00,   4.00,   5.00, '2000-01-01'),
(110,  7.00,  10.00,   5.00, '2000-01-01'),
(120, 25.00,  25.00,   0.00, '2000-01-01'),
(130,  6.50,   9.50,  24.50, '2000-01-01'),
(140,  9.50,  13.50,   6.00, '2000-01-01'),
(150,  8.00,  10.00,   2.00, '2000-01-01'),
(160,  3.00,   4.00,   2.00, '2000-01-01'),
(170,  9.50,  13.50,   2.00, '2000-01-01'),
(180,  7.50,  11.00,   2.00, '2000-01-01'),
(190,  2.50,   4.00,   2.00, '2000-01-01'),
(200,  8.00,  10.00,   2.00, '2000-01-01'),
(210,  4.00,   5.00,   2.00, '2000-01-01'),
(220,  5.00,   7.00,   0.00, '2000-01-01'),
(230,  6.50,   8.50,   0.00, '2000-01-01'),
(240, 15.50,  18.50,   0.00, '2000-01-01'),
(250, 17.50,  21.00,   0.00, '2000-01-01'),
(260,  4.00,   5.50,   0.00, '2000-01-01'),
(270,  4.00,   5.50,   0.00, '2000-01-01'),
(280,  4.00,   5.50,   0.00, '2000-01-01'),
(290,  4.00,   5.50,   0.00, '2000-01-01'),
(300,  2.00,   2.50,   0.00, '2000-01-01'),
(310,  2.50,   3.50,   0.00, '2000-01-01'),
(320,  2.50,   3.50,   0.00, '2000-01-01'),
(330,  2.00,   2.50,   0.00, '2000-01-01'),
(340,  8.50,  12.50,   0.00, '2000-01-01'),
(350,  8.50,  12.50,   0.00, '2000-01-01'),
(360,  6.50,   9.50,   0.00, '2000-01-01'),
(370, 27.50,  39.50,   0.00, '2000-01-01'),
(380, 10.50,  14.50,   0.00, '2000-01-01'),
(390, 14.00,  19.50,   0.00, '2000-01-01'),
(400, 14.00,  19.50,   0.00, '2000-01-01'),
(410, 21.00,  29.50,   0.00, '2000-01-01'),
(420,  5.50,   7.50,   0.00, '2000-01-01'),
(430, 30.00,  40.00,   0.00, '2000-01-01'),
(440, 40.00,  50.00,   0.00, '2000-01-01'),
(450, 30.00,  43.00,   0.00, '2000-01-01'),
(460, 15.00,  20.00,   0.00, '2000-01-01'),
(470, 30.00,  45.00,   0.00, '2000-01-01'),
(480,  7.00,   9.50,   0.00, '2000-01-01'),
(490, 12.50,  17.50,   0.00, '2000-01-01'),
(500,  7.00,   9.50,   0.00, '2000-01-01'),
(510, 13.50,  19.50,   0.00, '2000-01-01'),
(520,  9.50,   9.50,   0.00, '2000-01-01'),
(530, 17.50,  24.50,   0.00, '2000-01-01'),
(540, 26.50,  37.50,   0.00, '2000-01-01'),
(550, 17.50,  24.50,  10.00, '2000-01-01'),
(560, 42.50,  49.50,  35.00, '2000-01-01'),
(570, 13.50,  19.50,   0.00, '2000-01-01'),
(580, 13.50,  19.50,   0.00, '2000-01-01');

ALTER TABLE material AUTO_INCREMENT = 581;

SELECT COUNT(*) AS materialien FROM material;
SELECT COUNT(*) AS preise FROM material_price;
