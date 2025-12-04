package com.appdevg6.error404.boost.controller;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

import org.springframework.http.ResponseEntity;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;
import org.springframework.beans.factory.annotation.Autowired;

import com.appdevg6.error404.boost.entity.recommendationEntity;
import com.appdevg6.error404.boost.entity.userEntity;
import com.appdevg6.error404.boost.entity.productEntity;
import com.appdevg6.error404.boost.service.RecommendationService;
import com.appdevg6.error404.boost.repository.userRepository;
import com.appdevg6.error404.boost.repository.productRepository;

@RestController
@RequestMapping("/recommendations")
@CrossOrigin(origins = "http://localhost:3000")
public class RecommendationController {

    @Autowired
    private RecommendationService service;

    // repositories used to attach existing user/product references
    @Autowired
    private userRepository userRepo;

    @Autowired
    private productRepository productRepo;

    public static class RecommendationRequest {
        public Integer userID;
        public Integer productID;
        public String message;
        public String dateGenerated; // ISO yyyy-MM-dd (optional)
        public Integer rating;
    }

    @PostMapping("/create")
    public ResponseEntity<?> createRecommendation(@RequestBody RecommendationRequest req) {
        if (req == null || req.userID == null || req.productID == null) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("userID and productID are required");
        }

        Optional<userEntity> uOpt = userRepo.findById(req.userID);
        Optional<productEntity> pOpt = productRepo.findById(req.productID);

        if (!uOpt.isPresent() || !pOpt.isPresent()) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("user or product not found");
        }

        recommendationEntity r = new recommendationEntity();
        r.setUser(uOpt.get());
        r.setProduct(pOpt.get());
        r.setMessage(req.message);
        r.setRating(req.rating);
        if (req.dateGenerated != null && !req.dateGenerated.isBlank()) {
            r.setDateGenerated(LocalDate.parse(req.dateGenerated));
        } else {
            r.setDateGenerated(LocalDate.now());
        }

        recommendationEntity saved = service.create(r);
        return ResponseEntity.status(HttpStatus.CREATED).body(saved);
    }

    @GetMapping
    public List<recommendationEntity> getAll() {
        return service.findAll();
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> getById(@PathVariable int id) {
        Optional<recommendationEntity> opt = service.findById(id);
        if (opt.isPresent()) {
            return ResponseEntity.ok(opt.get());
        }
        return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Recommendation not found");
    }

    @GetMapping("/user/{userId}")
    public List<recommendationEntity> getByUser(@PathVariable int userId) {
        return service.findByUserId(userId);
    }

    @GetMapping("/product/{productId}")
    public List<recommendationEntity> getByProduct(@PathVariable int productId) {
        return service.findByProductId(productId);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> delete(@PathVariable int id) {
        service.delete(id);
        return ResponseEntity.noContent().build();
    }
}