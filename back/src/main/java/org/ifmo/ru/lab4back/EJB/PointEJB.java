package org.ifmo.ru.lab4back.EJB;

import jakarta.ejb.Stateless;
import jakarta.persistence.EntityManager;
import jakarta.persistence.PersistenceContext;
import org.ifmo.ru.lab4back.entities.PointEntity;

import java.util.ArrayList;
import java.util.List;

@Stateless
public class PointEJB {

    @PersistenceContext
    private EntityManager entityManager;

    // Создание новой точки
    public void createPoint(PointEntity pointEntity) {
        entityManager.persist(pointEntity);
    }

    // Получение точки по id
    public PointEntity getPoint(long id) {
        return entityManager.find(PointEntity.class, id);
    }

    // Получение всех точек
    public List<PointEntity> getAllPoints() {
        return entityManager.createQuery("SELECT p FROM PointEntity p", PointEntity.class).getResultList();
    }

    // Обновление существующей точки
    public PointEntity updatePoint(PointEntity pointEntity) {
        return entityManager.merge(pointEntity);
    }

    // Удаление точки по id
    public void deletePoint(long id) {
        PointEntity pointEntity = getPoint(id);
        if (pointEntity != null) {
            entityManager.remove(pointEntity);
        }
    }

    // Получение всех точек, принадлежащих пользователю
    public List<PointEntity> getPointsByOwner(String owner) {
        List<PointEntity> points = getAllPoints();
        List<PointEntity> result = new ArrayList<PointEntity>();
        points.forEach(p -> {
            if (p.getOwner().equals(owner)) {
                result.add(p);
            }
        });
        return result;

        /*return entityManager.createQuery("SELECT p FROM PointEntity p WHERE p.owner = :owner", PointEntity.class)
                .setParameter("owner", owner)
                .getResultList();*/
    }
}
