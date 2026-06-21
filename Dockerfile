FROM eclipse-temurin:25-jdk-alpine
WORKDIR /app
RUN mkdir -p /app/pdfs/angebot /app/pdfs/rechnung
COPY target/zeltverleih-1.0.jar /app/app.jar
EXPOSE 8080
ENTRYPOINT ["java", "-jar", "/app/app.jar"]
