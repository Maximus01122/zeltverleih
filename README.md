# Projektname: Spring Boot & React Docker Setup

Dieses Projekt enthält eine komplette Fullstack-Anwendung bestehend aus einer MySQL-Datenbank, einem Spring Boot Backend und einem React Frontend. Die Anwendung wird in Docker-Containern bereitgestellt, sodass eine einfache Bereitstellung und Verwaltung aller Komponenten ermöglicht wird.

## Voraussetzungen

Bevor du das Projekt startest, stelle sicher, dass folgende Software auf deinem Rechner installiert ist:

Java SE Development Kit (JDK) 17 oder neuer installieren ([Oracle Download](https://www.oracle.com/java/technologies/downloads))
Apache und MySQL Datenbank aufsetzen, beispielsweise mit [XAMPP](https://www.apachefriends.org/de/download.html)
Unter [http://localhost/phpmyadmin/](http://localhost/phpmyadmin/) eine neue MySQL Datenbank mit Namen "zeltverleih" anlegen

1. **Git** – Um das Repository zu klonen.
2. **Maven** – Um das Spring Boot Backend zu kompilieren.
3. **Docker** – Um Container zu bauen und zu starten.
4. **Docker Compose** – Zum Orchestrieren der Container.

## Installation und Einrichtung

### 1. Repository klonen

Zuerst musst du das Git-Repository auf deinen lokalen Rechner klonen. Führe dazu den folgenden Befehl in deinem Terminal oder deiner Kommandozeile aus:

```bash
git clone https://github.com/Maximus01122/zeltverleih.git
```

Navigiere in das geklonte Verzeichnis:
```bash
cd zeltverleih
```

### 2. Backend kompilieren (Spring Boot)

Bevor du die Docker-Container startest, musst du sicherstellen, dass das Spring Boot Backend kompiliert ist. Dies wird mit Maven gemacht. Überprüfe, dass die Credentials in src/main/java/application.properties mit denen von der angelegten Datenbank übereinstimmen. Führe dann den folgenden Befehl aus:
```bash
mvn clean install
```

### 3. Docker-Container starten (Spring Boot)
Nachdem du das Repository geklont und das Backend erfolgreich kompiliert hast, kannst du alle benötigten Docker-Container (Spring Boot Backend mit MySQL und React Frontend) mit Docker Compose starten.

Führe den folgenden Befehl aus, um die Container zu starten:

```bash
docker-compose up --build
```
