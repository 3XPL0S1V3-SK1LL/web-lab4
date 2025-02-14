package org.ifmo.ru.lab4back.beans;

import com.google.gson.JsonObject;
import jakarta.ejb.EJB;
import jakarta.enterprise.context.ApplicationScoped;
import jakarta.enterprise.context.RequestScoped;
import jakarta.inject.Named;
import jakarta.ws.rs.*;
import jakarta.ws.rs.core.MediaType;
import jakarta.ws.rs.core.Response;
import org.ifmo.ru.lab4back.EJB.UserEJB;
import org.ifmo.ru.lab4back.entities.UserEntity;

import java.util.Iterator;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

@ApplicationScoped
@Path("/user")
public class User {

    private static final long MAX_INACTIVITY_TIME = 10000; // 10 секунд
    private static final Map<String, Long> lastHeartBeatTimes = new ConcurrentHashMap<>(); //

    @EJB
    private UserEJB userEJB;

    public User() {}

    private String login;
    private String password;

    @GET
    @Path("/check-login/{login}")
    @Produces(MediaType.APPLICATION_JSON)
    public Response checkLogin(@PathParam("login") String login) {
        if (userEJB.getAllUsersLogins().contains(login)) {
            checkUser(login);
            return Response.status(Response.Status.OK).build();
        }
        return Response.status(Response.Status.NOT_FOUND).build();
    }

    @POST
    @Path("/check-password")
    @Produces(MediaType.APPLICATION_JSON)
    public Response checkPassword(UserEntity user) {
        if (!userEJB.getAllUsersLogins().contains(user.getLogin())) {
            return Response.status(Response.Status.NOT_FOUND).build();
        }

        // Проверка пароля
        UserEntity storedUser = userEJB.getUser(user.getLogin());
        if (storedUser != null && userEJB.checkPassword(user.getLogin(), user.getPassword())) {
            System.out.println(storedUser.getLogin() + " " + storedUser.isActive());
            checkUser(storedUser.getLogin());
            if (storedUser.isActive()) {
                System.out.println(storedUser.getLogin() + " is already active----");
                return Response.status(Response.Status.FORBIDDEN).entity("User is already logged in").build();
            } else {
                userEJB.setUserActive(user.getLogin(), true);
                return Response.status(Response.Status.OK).build();
            }
        }

        // Если пароль неверный
        return Response.status(Response.Status.CONFLICT).build();
    }

    @POST
    @Path("/add-user")
    @Produces(MediaType.APPLICATION_JSON)
    public Response addUser(UserEntity user) {
        if (userEJB.getAllUsersLogins().contains(user.getLogin())) {
            return Response.status(Response.Status.CONFLICT).build();
        }
        userEJB.createUser(user);
        userEJB.setUserActive(user.getLogin(), true);
        return Response.status(Response.Status.OK).build();
    }

    // Логика выхода из системы
    @GET
    @Path("/logout/{login}")
    @Produces(MediaType.APPLICATION_JSON)
    public Response logout(@PathParam("login") String login) {
        System.out.println("logged out " + login);
        userEJB.setUserActive(login, false);
        return Response.status(Response.Status.OK).build();
    }

    public String getLogin() {
        return login;
    }

    public void setLogin(String login) {
        this.login = login;
    }

    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
    }

    @GET
    @Path("/heart-beat/{login}")
    public Response heartBeat(@PathParam("login") String login) {
        long currentTime = System.currentTimeMillis();

        lastHeartBeatTimes.put(login, currentTime);

        Iterator<Map.Entry<String, Long>> iterator = lastHeartBeatTimes.entrySet().iterator();
        while (iterator.hasNext()) {
            Map.Entry<String, Long> entry = iterator.next();
            long lastHeartBeatTime = entry.getValue();
            if (currentTime - lastHeartBeatTime > MAX_INACTIVITY_TIME) {
                iterator.remove();  // Безопасно удаляет элемент
                userEJB.setUserActive(entry.getKey(), false);
                System.out.println("Deleted user " + entry.getKey());
            }
        }

        return Response.status(Response.Status.OK).build();
    }
    private void checkUser(String login) {
        long currentTime = System.currentTimeMillis();
        if (lastHeartBeatTimes.size() == 1) {
            if (lastHeartBeatTimes.containsKey(login) && currentTime - lastHeartBeatTimes.get(login) > MAX_INACTIVITY_TIME) {
                lastHeartBeatTimes.remove(login);
                userEJB.setUserActive(login, false);
            }
        }
    }
}
