package com.appdevg6.error404.boost.controller;

import com.appdevg6.error404.boost.entity.sellerapplicationEntity;
import com.appdevg6.error404.boost.service.sellerapplicationService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/seller-applications")
@CrossOrigin(origins = "*")
public class sellerapplicationController {

    @Autowired
    private sellerapplicationService sserv;

    // CREATE
    @PostMapping("/createSellerApplication")
    public ResponseEntity<sellerapplicationEntity> createSellerApplication(@RequestBody sellerapplicationEntity app) {
        sellerapplicationEntity created = sserv.createSellerApplication(app);
        return ResponseEntity.ok(created);
    }

    // READ ALL
    @GetMapping("/getAllApplications")
    public ResponseEntity<List<sellerapplicationEntity>> getAllApplications() {
        List<sellerapplicationEntity> apps = sserv.getAllSellerApplications();
        return ResponseEntity.ok(apps);
    }

    // READ BY ID
    @GetMapping("/getApplicationById/{id}")
    public ResponseEntity<sellerapplicationEntity> getApplicationById(@PathVariable Integer id) {
        Optional<sellerapplicationEntity> app = sserv.getSellerApplicationById(id);
        return app.map(ResponseEntity::ok)
                  .orElseGet(() -> ResponseEntity.notFound().build());
    }

    // APPROVE APPLICATION (Admin only)
    @PutMapping("/approve/{id}")
    public ResponseEntity<sellerapplicationEntity> approveApplication(@PathVariable Integer id) {
        sellerapplicationEntity approved = sserv.approveApplication(id);
        return (approved != null) ? ResponseEntity.ok(approved) : ResponseEntity.notFound().build();
    }

    // REJECT APPLICATION (Admin only)
    @PutMapping("/reject/{id}")
    public ResponseEntity<sellerapplicationEntity> rejectApplication(@PathVariable Integer id) {
        sellerapplicationEntity rejected = sserv.rejectApplication(id);
        return (rejected != null) ? ResponseEntity.ok(rejected) : ResponseEntity.notFound().build();
    }

    // UPDATE
    @PutMapping("/updateApplication/{id}")
    public ResponseEntity<sellerapplicationEntity> updateApplication(@PathVariable Integer id, @RequestBody sellerapplicationEntity updatedApp) {
        sellerapplicationEntity updated = sserv.updateSellerApplication(id, updatedApp);
        return (updated != null) ? ResponseEntity.ok(updated) : ResponseEntity.notFound().build();
    }

    // DELETE
    @DeleteMapping("/deleteApplication/{id}")
    public ResponseEntity<String> deleteApplication(@PathVariable Integer id) {
        String result = sserv.deleteSellerApplication(id);
        if (result.contains("does not exist")) {
            return ResponseEntity.status(404).body(result);
        }
        return ResponseEntity.ok(result);
    }
}