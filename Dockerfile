# Stage 1: Build
FROM gradle:8-jdk21 AS build
WORKDIR /app
COPY . .
RUN sed -i 's/\r$//' gradlew
RUN chmod +x gradlew
RUN sed -i 's/JavaVersion.VERSION_25/JavaVersion.VERSION_21/g' build.gradle && \
    sed -i 's/options.release = .*/options.release = 21/' build.gradle && \
    ./gradlew -p jpos installApp -x createRevisionPropertyFile

# Stage 2: Run
FROM eclipse-temurin:21-jre
WORKDIR /app

COPY --from=build /app/jpos/build/install/jpos/* /app/

EXPOSE 10000

# Use wildcard classpath for all jars in /app
CMD ["java", "-cp", "/app/*", "-Dorg.jpos.q2.port=8080", "org.jpos.q2.Q2"]