package com.appdevg6.error404.boost.service;

import com.appdevg6.error404.boost.entity.sellerapplicationEntity;
import com.appdevg6.error404.boost.repository.sellerapplicationRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;
import java.util.NoSuchElementException;

@Service
public class sellerapplicationService {

    @Autowired
    private sellerapplicationRepository srepo;

    // CREATE
    public sellerapplicationEntity createSellerApplication(sellerapplicationEntity app) {
        return srepo.save(app);
    }

    // READ (All)
    public List<sellerapplicationEntity> getAllSellerApplications() {
        return srepo.findAll();
    }

    // READ (By ID)
    public Optional<sellerapplicationEntity> getSellerApplicationById(Integer id) {
        return srepo.findById(id);
    }

    // UPDATE
    @SuppressWarnings("finally")
    public sellerapplicationEntity updateSellerApplication(Integer id, sellerapplicationEntity updatedApp) {
        sellerapplicationEntity app = new sellerapplicationEntity();
        try {
            app = srepo.findById(id).get();
            app.setApplicationStatus(updatedApp.getApplicationStatus());
            app.setApplicationDate(updatedApp.getApplicationDate());
            // If payload includes user relation, it can be set here:
            // app.setUser(updatedApp.getUser());
            return srepo.save(app);
        } catch (NoSuchElementException ex) {
            throw new NoSuchElementException("Seller application " + id + " does not exist");
        } finally {
            return srepo.save(app);
        }
    }

    // DELETE
    public String deleteSellerApplication(Integer id) {
        String msg = "";
        if (srepo.findById(id).isPresent()) {
            srepo.deleteById(id);
            msg = "Seller application " + id + " deleted successfully";
        } else {
            msg = "Seller application " + id + " does not exist";
        }
        return msg;
    }
}