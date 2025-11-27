package com.appdevg6.error404.boost.entity;

import java.time.LocalDate;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

@Entity
@Getter
@Setter
@Table(name = "seller_application")
public class sellerapplicationEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "application_ID")
    private int applicationID;

    @Column(name = "application_status")
    private String applicationStatus;

    @Column(name = "application_date")
    private LocalDate applicationDate;

    // owning side: nullable unique foreign key to user (makes relationship optional and 1:1)
    @OneToOne(optional = true)
    @JoinColumn(name = "user_id", referencedColumnName = "userID", unique = true, nullable = true)
    private userEntity user;

}
