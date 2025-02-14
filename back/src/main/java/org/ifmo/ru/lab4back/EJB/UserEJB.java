package org.ifmo.ru.lab4back.EJB;

import jakarta.ejb.Stateless;
import jakarta.persistence.EntityManager;
import jakarta.persistence.PersistenceContext;
import org.ifmo.ru.lab4back.entities.UserEntity;
import org.mindrot.jbcrypt.BCrypt;

import java.util.ArrayList;
import java.util.List;

@Stateless
public class UserEJB {

    @PersistenceContext
    private EntityManager entityManager;

    public UserEJB() {}

    public void createUser(UserEntity userEntity) {
        String hashedPassword = BCrypt.hashpw(userEntity.getPassword(), BCrypt.gensalt());
        userEntity.setPassword(hashedPassword);

        entityManager.persist(userEntity);
    }

    public UserEntity getUser(String login) {
        return entityManager.find(UserEntity.class, login);
    }

    public List<UserEntity> getAllUsers() {
        return entityManager.createQuery("SELECT u FROM UserEntity u", UserEntity.class).getResultList();
    }

    public List<String> getAllUsersLogins() {
        List<String> res = new ArrayList<>();
        getAllUsers().forEach(u -> res.add(u.getLogin()));
        return res;
    }

    public UserEntity updateUser(UserEntity userEntity) {
        return entityManager.merge(userEntity);
    }

    public void deleteUser(String login) {
        UserEntity userEntity = getUser(login);
        if (userEntity != null) {
            entityManager.remove(userEntity);
        }
    }

    // Обновленный метод для проверки и изменения состояния активности пользователя
    public boolean isUserActive(String login) {
        UserEntity user = getUser(login);
        return user != null && user.isActive();
    }

    public void setUserActive(String login, boolean active) {
        UserEntity user = getUser(login);
        if (user != null) {
            user.setActive(active);
            updateUser(user);
        }
    }
    public boolean checkPassword(String login, String password) {
        UserEntity user = getUser(login);
        if (user != null && BCrypt.checkpw(password, user.getPassword())) {
            return true; // Пароль верный
        }
        return false; // Неверный пароль
    }
}
