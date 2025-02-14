package org.ifmo.ru.lab4back.rest;
import jakarta.ws.rs.ApplicationPath;
import jakarta.ws.rs.core.Application;

@ApplicationPath("/api") // Базовый путь для всех REST-эндпоинтов
public class RestConfig extends Application {}