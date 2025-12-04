package com.appdevg6.error404.boost.service;

import java.util.List;
import java.util.Optional;
import org.springframework.stereotype.Service;
import org.springframework.beans.factory.annotation.Autowired;
import com.appdevg6.error404.boost.entity.recommendationEntity;
import com.appdevg6.error404.boost.repository.RecommendationRepository;

@Service
public class RecommendationService {

    @Autowired
    private RecommendationRepository repo;

    public recommendationEntity create(recommendationEntity r) {
        return repo.save(r);
    }

    public Optional<recommendationEntity> findById(int id) {
        return repo.findById(id);
    }

    public List<recommendationEntity> findAll() {
        return repo.findAll();
    }

    public List<recommendationEntity> findByUserId(int userId) {
        return repo.findByUserUserID(userId);
    }

    public List<recommendationEntity> findByProductId(int productId) {
        return repo.findByProductProductID(productId);
    }

    public void delete(int id) {
        repo.deleteById(id);
    }
}