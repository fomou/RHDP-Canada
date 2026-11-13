FROM eclipse-temurin:21-jdk AS build
WORKDIR /app
COPY . .
RUN sed -i 's/\r$//' mvnw && chmod +x mvnw && ./mvnw -B -ntp -DskipTests package

FROM eclipse-temurin:21-jre
WORKDIR /app
RUN groupadd --system rhdp && useradd --system --gid rhdp --home-dir /app rhdp
COPY --from=build /app/target/rhdp-canada.jar /app/app.jar
USER rhdp
EXPOSE 8080
ENTRYPOINT ["java", "-jar", "/app/app.jar"]
