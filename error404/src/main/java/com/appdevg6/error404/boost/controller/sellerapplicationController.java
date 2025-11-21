package com.appdevg6.error404.boost.controller;

import com.appdevg6.error404.boost.entity.sellerapplicationEntity;
import com.appdevg6.error404.boost.service.sellerapplicationService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/sellerApplications")
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
    @GetMapping("/getAllSellerApplications")
    public ResponseEntity<List<sellerapplicationEntity>> getAllSellerApplications() {
        List<sellerapplicationEntity> apps = sserv.getAllSellerApplications();
        return ResponseEntity.ok(apps);
    }

    // READ BY ID
    @GetMapping("/getSellerApplicationById/{id}")
    public ResponseEntity<sellerapplicationEntity> getSellerApplicationById(@PathVariable Integer id) {
        Optional<sellerapplicationEntity> app = sserv.getSellerApplicationById(id);
        return app.map(ResponseEntity::ok)
                  .orElseGet(() -> ResponseEntity.notFound().build());
    }

    // UPDATE
    @PutMapping("/updateSellerApplication/{id}")
    public ResponseEntity<sellerapplicationEntity> updateSellerApplication(@PathVariable Integer id, @RequestBody sellerapplicationEntity updatedApp) {
        sellerapplicationEntity updated = sserv.updateSellerApplication(id, updatedApp);
        return (updated != null) ? ResponseEntity.ok(updated) : ResponseEntity.notFound().build();
    }

    // DELETE
    @DeleteMapping("/deleteSellerApplication/{id}")
    public ResponseEntity<String> deleteSellerApplication(@PathVariable Integer id) {
        String result = sserv.deleteSellerApplication(id);
        if (result.contains("does not exist")) {
            return ResponseEntity.status(404).body(result);
        }
        return ResponseEntity.ok(result);
    }
}