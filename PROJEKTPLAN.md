# Projektplan — Zeltverleih Erfurt
**Stand: Juni 2025**

---

## 1. IST-Stand

### 1.1 Öffentliche Website
- Gehostet bei **IONOS** unter `zeltverleiherfurt.de`
- Veraltetes Design, nicht mobiloptimiert (`viewport` falsch gesetzt)
- Kontaktformular funktioniert, aber keine direkte Verbindung zur internen App
- **Neu gebaut (noch nicht live):** Zwei Versionen existieren lokal:
  - `Documents/website` — React + Vite + PocketBase (Monorepo, teilweise fertig, ContactForm repariert)
  - `Documents/zeltverleih/index.html` — Statische HTML-Seite (komplett, kein Build-Schritt nötig)

### 1.2 Interne Mitarbeiter-App
- Liegt in `Documents/zeltverleih`
- **Backend:** Spring Boot 2.7.5 (Java), MySQL-Datenbank, REST-API
- **Frontend:** React + TypeScript
- **Docker-ready:** `Dockerfile` + `docker-compose.yaml` vorhanden
- Funktionsumfang: Kunden, Buchungen, Materialverwaltung, Rechnungen, E-Mail
- Buchungsstatus: `UNPROCESSED → OFFER_SENT → OFFER_ACCEPTED → PAYMENT_PENDING → COMPLETED`
- **Noch nicht öffentlich gehostet**, läuft nur lokal

### 1.3 Hosting & Infrastruktur
- Aktuell: IONOS (nur für die öffentliche Website)
- Interne App: läuft ausschließlich lokal, nicht von anderen Geräten erreichbar
- Kein gemeinsames Backend zwischen Website und App

---

## 2. SOLL-Zustand

### 2.1 Öffentliche Website (`zeltverleiherfurt.de`)
- Neues Design live (React-App aus `Documents/website`)
- Mobiloptimiert, schnell, modernes Design
- Kontaktformular schickt Anfragen direkt an die Spring Boot App
- Öffentlich erreichbar für Kunden

### 2.2 Interne Mitarbeiter-App
- Von jedem Gerät (Handy, Tablet, PC) erreichbar unter einer eigenen URL, z.B. `app.zeltverleiherfurt.de`
- Neue Seite **"Anfragen"**: zeigt alle Website-Kontaktformular-Einreichungen
- Anfragen können direkt in Buchungen umgewandelt werden
- Zugriffsschutz (nur für Mitarbeiter)

### 2.3 Hosting-Entscheidung
Alles läuft auf **einem Hostinger VPS** (~6–10 €/Monat):

| Was | URL | Technik |
|---|---|---|
| Öffentliche Website | `zeltverleiherfurt.de` | Nginx → statische React-Build-Dateien |
| Spring Boot API | intern auf Port 8080 | Docker, hinter Nginx |
| Mitarbeiter-App (Frontend) | `app.zeltverleiherfurt.de` | Nginx → statische React-Build-Dateien |
| Datenbank | intern | MySQL in Docker |

> **Warum kein separater Hostinger Business-Plan?**
> Da die öffentliche Website das Spring Boot Backend direkt ansprechen muss
> (Kontaktformular), ist es am einfachsten, beides auf demselben VPS zu betreiben.
> Nginx übernimmt das Routing für alle Domains.

---

## 3. Plan

### Phase 1 — Backend: Anfragen-Endpunkt in Spring Boot

**Ziel:** Spring Boot empfängt Website-Anfragen und speichert sie in der Datenbank.

- [ ] `QuoteRequest`-Entity anlegen (Felder: Name, E-Mail, Telefon, Veranstaltungstyp, Datum, Gästeanzahl, Zeltgröße, Servicepaket, Zubehör, Untergrund, Nachricht, Eingangszeitpunkt, Status)
- [ ] `QuoteRequestRepository` anlegen (JPA)
- [ ] `QuoteRequestController` anlegen:
  - `POST /public/quote-request` — öffentlich, ohne Login, von der Website aufgerufen
  - `GET /quote-requests` — gesichert, nur für die Mitarbeiter-App
- [ ] CORS konfigurieren: `zeltverleiherfurt.de` darf den öffentlichen Endpunkt aufrufen
- [ ] E-Mail-Benachrichtigung: Bei neuer Anfrage geht automatisch eine E-Mail an `info@zeltverleiherfurt.de` (nutzt bestehenden `EmailController`)
- [ ] Datenbankmigrierung: Neue Tabelle `quote_request` via Liquibase/Flyway oder manuelles SQL

---

### Phase 2 — Interne App: Anfragen-Seite im Frontend

**Ziel:** Mitarbeiter sehen eingehende Website-Anfragen in der App.

- [ ] Neue Seite „Anfragen" im React-Frontend (`Documents/zeltverleih/src/main/frontend`)
- [ ] Tabelle mit allen `QuoteRequests`, sortiert nach Eingang (neueste zuerst)
- [ ] Spalten: Datum, Name, Telefon, Veranstaltung, Zeltgröße, Servicepaket, Status
- [ ] Detail-Ansicht: Alle Felder der Anfrage + Nachricht anzeigen
- [ ] Aktion „Zu Buchung konvertieren": Legt automatisch `Client` + `Booking` (Status: `UNPROCESSED`) aus den Anfrage-Daten an
- [ ] Aktion „Ablehnen": Setzt Status der Anfrage auf `REJECTED`
- [ ] Navigation: Menüpunkt „Anfragen" mit Badge für unbearbeitete Anfragen

---

### Phase 3 — Öffentliche Website: Formular umhängen

**Ziel:** Das Kontaktformular der Website schickt Daten an Spring Boot statt an PocketBase.

- [ ] In `Documents/website`: `ContactForm.jsx` anpassen — API-Aufruf von PocketBase auf `POST /public/quote-request` (Spring Boot) umstellen
- [ ] `.env`-Datei anlegen: `VITE_API_URL=https://zeltverleiherfurt.de/api` (für Produktion)
- [ ] PocketBase-Abhängigkeit aus `package.json` entfernen (nicht mehr benötigt)
- [ ] Fehlerbehandlung: Benutzerfreundliche Meldung wenn API nicht erreichbar

---

### Phase 4 — VPS einrichten & deployen

**Ziel:** Alle Komponenten laufen produktiv auf dem VPS.

**VPS-Grundkonfiguration:**
- [ ] Hostinger VPS buchen (Ubuntu 22.04, mind. 2 GB RAM empfohlen für Spring Boot)
- [ ] SSH-Zugang einrichten, System aktualisieren
- [ ] Docker + Docker Compose installieren
- [ ] Nginx installieren und konfigurieren
- [ ] Firewall einrichten (nur Port 80, 443, SSH offen)

**Datenbank:**
- [ ] MySQL-Container in `docker-compose.yaml` konfigurieren
- [ ] Datenbankschema initialisieren

**Spring Boot App deployen:**
- [ ] `docker-compose.yaml` für Produktion anpassen (Umgebungsvariablen für DB, E-Mail)
- [ ] App bauen (`mvn package`) und Docker-Image erstellen
- [ ] Als Docker-Container starten, Port 8080 intern

**Öffentliche Website deployen:**
- [ ] React-App bauen (`npm run build` in `Documents/website`)
- [ ] Build-Dateien auf VPS kopieren
- [ ] Nginx: `zeltverleiherfurt.de` → statische Dateien

**Mitarbeiter-App deployen:**
- [ ] React-Frontend bauen (`Documents/zeltverleih/src/main/frontend`)
- [ ] Nginx: `app.zeltverleiherfurt.de` → statische Dateien
- [ ] Nginx: `/api/` → Spring Boot auf Port 8080 (Reverse Proxy)
- [ ] Zugriffsschutz: Basic Auth oder bestehendes Login absichern

**SSL & Domain:**
- [ ] Let's Encrypt / Certbot für `zeltverleiherfurt.de` und `app.zeltverleiherfurt.de`
- [ ] DNS bei IONOS umstellen: A-Record auf VPS-IP

---

### Phase 5 — Testen & Go-Live

- [ ] Kontaktformular auf Website testen → Anfrage erscheint in App
- [ ] E-Mail-Benachrichtigung testen
- [ ] „Zu Buchung konvertieren" testen
- [ ] Mobile Ansicht der Website prüfen
- [ ] IONOS-Hosting kündigen (erst nach Go-Live der neuen Seite)

---

## Zusammenfassung & Reihenfolge

```
Phase 1 (Backend)  →  Phase 2 (App-Frontend)  →  Phase 3 (Website-Formular)
       ↓
Phase 4 (VPS-Setup & Deploy)
       ↓
Phase 5 (Testen & Go-Live)
```

**Geschätzter Gesamtaufwand:** 10–15 Stunden (verteilt auf mehrere Sessions)

**Laufende Kosten nach Go-Live:**
- Hostinger VPS: ~6–10 €/Monat
- Domain `zeltverleiherfurt.de`: ~10–15 €/Jahr
- IONOS-Hosting: kann gekündigt werden
