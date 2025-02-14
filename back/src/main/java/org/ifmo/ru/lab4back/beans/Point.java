package org.ifmo.ru.lab4back.beans;

import com.google.gson.Gson;
import jakarta.ejb.EJB;
import jakarta.enterprise.context.ApplicationScoped;
import jakarta.ws.rs.*;
import jakarta.ws.rs.core.MediaType;
import jakarta.ws.rs.core.Response;
import org.ifmo.ru.lab4back.EJB.PointEJB;
import org.ifmo.ru.lab4back.entities.PointEntity;

import java.time.LocalDateTime;
import java.util.List;

@ApplicationScoped
@Path("/point")
public class Point {
    public Point() {
    }

    private String x;
    private String y;
    private String r;

    @EJB
    private PointEJB pointEJB;

    @POST
    @Path("/add-point")
    @Produces(MediaType.APPLICATION_JSON)
    @Consumes(MediaType.APPLICATION_JSON)
    public Response addPoint(PointEntity point) {
        try {
            // Получаем текущее время начала обработки
            long startTime = System.nanoTime();

            // Выполняем вычисления для определения попадания
            String hit = checkHit(point.getX(), point.getY(), point.getR());

            // Устанавливаем результат попадания
            point.setHit(hit);

            // Получаем текущее время
            LocalDateTime currentTime = LocalDateTime.now();

            // Вычисляем время выполнения до сохранения в БД
            long executionTime = (System.nanoTime() - startTime) / 1000; // Время в миллисекундах

            // Устанавливаем значения времени выполнения и текущего времени
            point.setExecutionTime(executionTime);
            point.setCurrentTime(currentTime.toString());

            // Создаем новую точку и сохраняем в БД
            pointEJB.createPoint(point);
            System.out.println(point.toString());

            // Подготавливаем данные для ответа
            PointEntity responsePoint = new PointEntity();
            responsePoint.setX(point.getX());
            responsePoint.setY(point.getY());
            responsePoint.setR(point.getR());
            responsePoint.setHit(hit);
            responsePoint.setExecutionTime(executionTime);
            responsePoint.setCurrentTime(currentTime.toString());

            pointEJB.getAllPoints().forEach(System.out::println);

            // Возвращаем успешный ответ с данными
            return Response.status(Response.Status.OK)
                    .entity(responsePoint)
                    .build();

        } catch (Exception e) {
            // Если возникла ошибка, возвращаем ошибку
            return Response.status(Response.Status.INTERNAL_SERVER_ERROR)
                    .entity("Error processing the point.")
                    .build();
        }
    }

    @GET
    @Path("/get-points/{login}")
    @Produces(MediaType.APPLICATION_JSON)
    public Response getUserPoints(@PathParam("login") String userLogin) {
        if (userLogin == null || userLogin.isEmpty()) {
            System.out.println("user: " + userLogin);
            return Response.status(Response.Status.UNAUTHORIZED).build();
        }
        pointEJB.getAllPoints().forEach(System.out::println);
        List<PointEntity> userPoints = pointEJB.getPointsByOwner(userLogin);
        Gson gson = new Gson();
        String json = gson.toJson(userPoints);
        System.out.println(json);
        return Response.status(Response.Status.OK)
                .entity(userPoints)
                .build();
    }

    private String checkHit(String xVal, String yVal, String rVal) throws NumberFormatException {
        double x = Double.parseDouble(xVal);
        double y = Double.parseDouble(yVal);
        double r = Double.parseDouble(rVal);
        if (r == 0) {
            return ((Boolean) false).toString();
        }
        if (r > 0) {
            if (x > 0 && y > 0) return ((Boolean) (x < r / 2 && y < r)).toString();
            if (x < 0 && y > 0) return ((Boolean) ((Math.pow(x, 2)) + (Math.pow(y, 2)) <= Math.pow(r, 2))).toString();
            if (x < 0 && y < 0) return ((Boolean) (y >= -r / 2 - x / 2)).toString();
        }
        if (r < 0) {
            if (x > 0 && y > 0) return ((Boolean) (y <= Math.abs(r / 2) - x / 2)).toString();
            if (x < 0 && y < 0) return ((Boolean) (y > r && x > r / 2)).toString();
            if (x > 0 && y < 0) return ((Boolean) (Math.pow(x, 2) + Math.pow(y, 2) <= Math.pow(r, 2))).toString();
        }
        return ((Boolean) false).toString();
    }
}
