package com.appdevg6.error404.boost.repository;

import com.appdevg6.error404.boost.entity.productEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface productRepository extends JpaRepository<productEntity, Integer> {
}