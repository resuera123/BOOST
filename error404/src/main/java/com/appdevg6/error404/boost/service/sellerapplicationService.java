package com.appdevg6.error404.boost.service;

import com.appdevg6.error404.boost.entity.sellerapplicationEntity;
import com.appdevg6.error404.boost.entity.userEntity;
import com.appdevg6.error404.boost.repository.sellerapplicationRepository;
import com.appdevg6.error404.boost.repository.userRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class sellerapplicationService {

    @Autowired
    private sellerapplicationRepository srepo;
    
    @Autowired
    private userRepository userRepo;

    // CREATE
    public sellerapplicationEntity createSellerApplication(sellerapplicationEntity app) {
        // Save the application
        sellerapplicationEntity savedApp = srepo.save(app);
        
        // AUTO-APPROVE: Update user role to "seller" immediately
        if (app.getUser() != null) {
            Optional<userEntity> userOpt = userRepo.findById(app.getUser().getUserID());
            if (userOpt.isPresent()) {
                userEntity user = userOpt.get();
                user.setRole("SELLER");
                userRepo.save(user);
                
                // Update application status to approved
                savedApp.setApplicationStatus("Approved");
                savedApp = srepo.save(savedApp);
            }
        }
        
        return savedApp;
    }

    // READ ALL
    public List<sellerapplicationEntity> getAllSellerApplications() {
        return srepo.findAll();
    }

    // READ BY ID
    public Optional<sellerapplicationEntity> getSellerApplicationById(Integer id) {
        return srepo.findById(id);
    }

    // UPDATE
    public sellerapplicationEntity updateSellerApplication(Integer id, sellerapplicationEntity updatedApp) {
        Optional<sellerapplicationEntity> existing = srepo.findById(id);
        if (existing.isPresent()) {
            sellerapplicationEntity app = existing.get();
            app.setApplicationStatus(updatedApp.getApplicationStatus());
            app.setApplicationDate(updatedApp.getApplicationDate());
            if (updatedApp.getUser() != null) {
                app.setUser(updatedApp.getUser());
            }
            return srepo.save(app);
        }
        return null;
    }

    // DELETE
    public String deleteSellerApplication(Integer id) {
        if (srepo.existsById(id)) {
            srepo.deleteById(id);
            return "Seller application with ID " + id + " deleted successfully.";
        }
        return "Seller application with ID " + id + " does not exist.";
    }
}