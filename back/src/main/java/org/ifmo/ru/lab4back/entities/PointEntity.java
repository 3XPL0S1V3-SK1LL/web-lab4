package org.ifmo.ru.lab4back.entities;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;

@Entity
public class PointEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private long id;
    private String owner;           // Владелец точки
    private String x;               // Координата X
    private String y;               // Координата Y
    private String r;               // Радиус
    private String hit;             // Попадание или не попадание
    private long executionTime;     // Время выполнения в миллисекундах
    private String currentTime;     // Текущее время в строковом формате

    // Геттеры и сеттеры для новых полей
    public long getExecutionTime() {
        return executionTime;
    }

    public void setExecutionTime(long executionTime) {
        this.executionTime = executionTime;
    }

    public String getCurrentTime() {
        return currentTime;
    }

    public void setCurrentTime(String currentTime) {
        this.currentTime = currentTime;
    }

    // Остальные геттеры и сеттеры
    public long getId() {
        return id;
    }

    public void setId(long id) {
        this.id = id;
    }

    public String getOwner() {
        return owner;
    }

    public void setOwner(String owner) {
        this.owner = owner;
    }

    public String getX() {
        return x;
    }

    public void setX(String x) {
        this.x = x;
    }

    public String getY() {
        return y;
    }

    public void setY(String y) {
        this.y = y;
    }

    public String getR() {
        return r;
    }

    public void setR(String r) {
        this.r = r;
    }

    public String getHit() {
        return hit;
    }

    public void setHit(String hit) {
        this.hit = hit;
    }

    @Override
    public String toString() {
        return "PointEntity{" +
                "id=" + id +
                ", owner='" + owner + '\'' +
                ", x='" + x + '\'' +
                ", y='" + y + '\'' +
                ", r='" + r + '\'' +
                ", hit='" + hit + '\'' +
                ", executionTime=" + executionTime +
                ", currentTime='" + currentTime + '\'' +
                '}';
    }
}
