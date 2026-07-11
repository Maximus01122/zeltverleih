FROM maven:3.9-eclipse-temurin-25-alpine AS build
WORKDIR /app
COPY pom.xml .
COPY .mvn .mvn
COPY src ./src
RUN mvn -q package -DskipTests -s .mvn/settings.xml

FROM eclipse-temurin:25-jre-alpine
WORKDIR /app
COPY --from=build /app/target/zeltverleih-backend-0.0.1-SNAPSHOT.jar app.jar
EXPOSE 8080
ENTRYPOINT ["java", "-jar", "app.jar"]
