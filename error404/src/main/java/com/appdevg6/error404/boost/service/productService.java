package com.appdevg6.error404.boost.service;

import com.appdevg6.error404.boost.entity.productEntity;
import com.appdevg6.error404.boost.repository.productRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;
import java.util.NoSuchElementException;

@Service
public class productService {

    @Autowired
    private productRepository prepo;

    // CREATE
    public productEntity createProduct(productEntity product) {
        return prepo.save(product);
    }

    // READ (All)
    public List<productEntity> getAllProducts() {
        return prepo.findAll();
    }

    // READ (By ID)
    public Optional<productEntity> getProductById(Integer id) {
        return prepo.findById(id);
    }

    // UPDATE
    @SuppressWarnings("finally")
    public productEntity updateProduct(Integer id, productEntity updatedProduct) {
        productEntity product = new productEntity();
        try {
            product = prepo.findById(id).get();
            product.setProductName(updatedProduct.getProductName());
            product.setProductDescription(updatedProduct.getProductDescription());
            product.setProductPrice(updatedProduct.getProductPrice());
            product.setProductImage(updatedProduct.getProductImage());
            product.setProductCategory(updatedProduct.getProductCategory());
            product.setProductStatus(updatedProduct.getProductStatus());
            product.setProductDate(updatedProduct.getProductDate());
            // If payload includes user relation, you can set it:
            // product.setUser(updatedProduct.getUser());
            return prepo.save(product);
        } catch (NoSuchElementException ex) {
            throw new NoSuchElementException("Product " + id + " does not exist");
        } finally {
            return prepo.save(product);
        }
    }

    // DELETE
    public String deleteProduct(Integer id) {
        String msg = "";
        if (prepo.findById(id).isPresent()) {
            prepo.deleteById(id);
            msg = "Product " + id + " deleted successfully";
        } else {
            msg = "Product " + id + " does not exist";
        }
        return msg;
    }
}