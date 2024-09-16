Projektname: Spring Boot & React Docker Setup Dieses Projekt enthält
eine komplette Fullstack-Anwendung bestehend aus einer MySQL-Datenbank,
einem Spring Boot Backend und einem React Frontend. Die Anwendung wird
in Docker-Containern bereitgestellt, sodass eine einfache Bereitstellung
und Verwaltung aller Komponenten ermöglicht wird.

Voraussetzungen Bevor du das Projekt startest, stelle sicher, dass
folgende Software auf deinem Rechner installiert ist: 1. Git - Um das
Repository zu klonen. 2. Docker - Um Container zu bauen und zu starten.
3. Docker Compose - Zum Orchestrieren der Container.

Installation und Einrichtung 1. Repository klonen Zuerst musst du das
Git-Repository auf deinen lokalen Rechner klonen. Führe dazu den
folgenden Befehl in deinem Terminal oder deiner Kommandozeile aus: bash
Code kopieren git clone https://github.com/username/repository-name.git
Navigiere in das geklonte Verzeichnis: bash Code kopieren cd
repository-name 2. Docker-Container starten Nachdem du das Repository
geklont hast, kannst du alle benötigten Docker-Container (MySQL,
phpMyAdmin, Spring Boot Backend und React Frontend) mit Docker Compose
starten. Führe den folgenden Befehl aus, um die Container zu starten:
bash Code kopieren docker-compose up \--build Der Schalter \--build
stellt sicher, dass Docker-Images neu gebaut werden, falls sie noch
nicht vorhanden sind. 3. Zugriff auf die Anwendung Sobald die Container
gestartet sind, kannst du auf die verschiedenen Teile der Anwendung über
die folgenden URLs zugreifen: \* phpMyAdmin: http://localhost:8080 -
Verwende diese URL, um die Datenbank über phpMyAdmin zu verwalten. \*
Spring Boot Backend: Läuft auf http://localhost:8081 (Standardport 8080
intern). \* React Frontend: Zugriff über http://localhost:3000 - Die
React-Anwendung wird im Browser gestartet. Dienste und Ports
DienstURLPortphpMyAdminhttp://localhost:80808080MySQL Datenbankintern
(über Docker-Netzwerk)3306Spring Boot
Backendhttp://localhost:80818081React
Frontendhttp://localhost:30003000Datenbankzugriff Die Datenbank (MySQL)
ist für das Spring Boot Backend konfiguriert und kann mit folgenden
Standardzugangsdaten angesprochen werden: \* Host: db (intern innerhalb
des Docker-Netzwerks) \* Port: 3306 \* Benutzer: benutzer \* Passwort:
passwort \* Datenbankname: deine_datenbank Diese Zugangsdaten sind im
docker-compose.yml festgelegt. nützliche Befehle \* Container stoppen:
Um alle laufenden Container zu stoppen, führe aus: bash Code kopieren
docker-compose down \* Logs anzeigen: Um die Logs der laufenden
Container anzuzeigen, kannst du den folgenden Befehl nutzen: bash Code
kopieren docker-compose logs -f \* Neuaufbau erzwingen: Wenn du
sicherstellen willst, dass alle Container und Images neu aufgebaut
werden, nutze: bash Code kopieren docker-compose up \--build
Fehlerbehebung Falls es Probleme beim Starten der Container gibt: \*
Stelle sicher, dass Docker läuft. \* Prüfe, ob die Ports (3306, 8080,
8081, 3000) auf deinem Rechner verfügbar sind und nicht durch andere
Anwendungen blockiert werden. \* Überprüfe die Logs mit docker-compose
logs, um detaillierte Fehlerhinweise zu erhalten.
