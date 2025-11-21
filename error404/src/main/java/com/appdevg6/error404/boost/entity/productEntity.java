package com.appdevg6.error404.boost.entity;

import java.time.LocalDate;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

@Entity
@Getter
@Setter
@Table(name = "product")
public class productEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "product_ID")
    private int productID;

    @Column(name = "product_name")
    private String productName;

    @Column(name = "product_description")
    private String productDescription;

    @Column(name = "product_price")
    private double productPrice;

    @Column(name = "product_image")
    private String productImage;

    @Column(name = "product_category")
    private String productCategory;

    @Column(name = "product_status")
    private String productStatus;

    @Column(name = "product_date")
    private LocalDate productDate;
    
    @ManyToOne(optional = true)
    @JoinColumn(name = "user_ID", referencedColumnName = "userID", nullable = true)
    private userEntity user;
}
