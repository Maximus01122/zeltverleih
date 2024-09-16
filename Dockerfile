FROM openjdk:17-jdk-slim
WORKDIR /app
COPY target/zeltverleih-1.0.jar /app/app.jar
EXPOSE 8080
ENTRYPOINT ["java", "-jar", "/app/app.jar"]
