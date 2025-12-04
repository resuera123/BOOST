package com.appdevg6.error404.boost.entity;

import java.time.LocalDate;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

@Entity
@Getter
@Setter
@Table(name = "recommendation")
public class recommendationEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "recommendationID")
    private int recommendationID;

    @ManyToOne(optional = false)
    @JoinColumn(name = "user_ID", referencedColumnName = "userID", nullable = false)
    private userEntity user;

    @ManyToOne(optional = false)
    @JoinColumn(name = "product_ID", referencedColumnName = "product_ID", nullable = false)
    private productEntity product;

    @Column(name = "message", columnDefinition = "TEXT")
    private String message;

    @Column(name = "dateGenerated")
    private LocalDate dateGenerated;

    @Column(name = "rating")
    private Integer rating;
}