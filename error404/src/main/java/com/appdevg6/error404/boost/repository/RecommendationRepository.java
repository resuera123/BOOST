package com.appdevg6.error404.boost.repository;

import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;
import com.appdevg6.error404.boost.entity.recommendationEntity;

public interface RecommendationRepository extends JpaRepository<recommendationEntity, Integer> {
    List<recommendationEntity> findByUserUserID(int userID);
    List<recommendationEntity> findByProductProductID(int productID);
}