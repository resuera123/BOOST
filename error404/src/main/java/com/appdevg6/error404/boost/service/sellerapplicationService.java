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

    // CREATE - Application stays PENDING (no auto-approve)
    public sellerapplicationEntity createSellerApplication(sellerapplicationEntity app) {
        // Just save the application with Pending status
        return srepo.save(app);
    }

    // READ ALL
    public List<sellerapplicationEntity> getAllSellerApplications() {
        return srepo.findAll();
    }

    // READ BY ID
    public Optional<sellerapplicationEntity> getSellerApplicationById(Integer id) {
        return srepo.findById(id);
    }

    // APPROVE APPLICATION - Admin action
    public sellerapplicationEntity approveApplication(Integer id) {
        Optional<sellerapplicationEntity> appOpt = srepo.findById(id);
        if (appOpt.isPresent()) {
            sellerapplicationEntity app = appOpt.get();
            
            // Update application status
            app.setApplicationStatus("Approved");
            
            // Update user role to SELLER
            if (app.getUser() != null) {
                Optional<userEntity> userOpt = userRepo.findById(app.getUser().getUserID());
                if (userOpt.isPresent()) {
                    userEntity user = userOpt.get();
                    user.setRole("SELLER");
                    userRepo.save(user);
                }
            }
            
            return srepo.save(app);
        }
        return null;
    }

    // REJECT APPLICATION - Admin action
    public sellerapplicationEntity rejectApplication(Integer id) {
        Optional<sellerapplicationEntity> appOpt = srepo.findById(id);
        if (appOpt.isPresent()) {
            sellerapplicationEntity app = appOpt.get();
            app.setApplicationStatus("Rejected");
            return srepo.save(app);
        }
        return null;
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