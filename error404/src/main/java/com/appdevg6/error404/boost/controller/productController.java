package com.appdevg6.error404.boost.controller;

import com.appdevg6.error404.boost.entity.productEntity;
import com.appdevg6.error404.boost.service.productService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/products")
@CrossOrigin(origins = "*")
public class productController {

    @Autowired
    private productService pserv;

    // CREATE
    @PostMapping("/createProduct")
    public ResponseEntity<productEntity> createProduct(@RequestBody productEntity product) {
        productEntity created = pserv.createProduct(product);
        return ResponseEntity.ok(created);
    }

    // READ ALL
    @GetMapping("/getAllProducts")
    public ResponseEntity<List<productEntity>> getAllProducts() {
        List<productEntity> products = pserv.getAllProducts();
        return ResponseEntity.ok(products);
    }

    // READ BY ID
    @GetMapping("/getProductById/{id}")
    public ResponseEntity<productEntity> getProductById(@PathVariable Integer id) {
        Optional<productEntity> product = pserv.getProductById(id);
        return product.map(ResponseEntity::ok)
                      .orElseGet(() -> ResponseEntity.notFound().build());
    }

    // UPDATE
    @PutMapping("/updateProduct/{id}")
    public ResponseEntity<productEntity> updateProduct(@PathVariable Integer id, @RequestBody productEntity updatedProduct) {
        productEntity updated = pserv.updateProduct(id, updatedProduct);
        return (updated != null) ? ResponseEntity.ok(updated) : ResponseEntity.notFound().build();
    }

    // DELETE
    @DeleteMapping("/deleteProduct/{id}")
    public ResponseEntity<String> deleteProduct(@PathVariable Integer id) {
        String result = pserv.deleteProduct(id);
        if (result.contains("does not exist")) {
            return ResponseEntity.status(404).body(result);
        }
        return ResponseEntity.ok(result);
    }

    // GET PRODUCTS BY USER ID
@GetMapping("/getProductsByUser/{userId}")
public ResponseEntity<List<productEntity>> getProductsByUser(@PathVariable Integer userId) {
    List<productEntity> products = pserv.getProductsByUser(userId);
    return ResponseEntity.ok(products);
}


}