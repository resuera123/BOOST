package com.appdevg6.error404.boost.controller;

import com.appdevg6.error404.boost.entity.userEntity;
import com.appdevg6.error404.boost.service.userService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/users")
@CrossOrigin(origins = "*")
public class userController {

    @Autowired
    private userService userv;

    // CREATE
    @PostMapping("/createUser")
    public ResponseEntity<userEntity> createUser(@RequestBody userEntity user) {
        userEntity created = userv.createUser(user);
        return ResponseEntity.ok(created);
    }

    // READ ALL
    @GetMapping("/getAllUsers")
    public ResponseEntity<List<userEntity>> getAllUsers() {
        List<userEntity> users = userv.getAllUsers();
        return ResponseEntity.ok(users);
    }

    // READ BY ID
    @GetMapping("/getUserById/{id}")
    public ResponseEntity<userEntity> getUserById(@PathVariable Integer id) {
        Optional<userEntity> user = userv.getUserById(id);
        return user.map(ResponseEntity::ok)
                   .orElseGet(() -> ResponseEntity.notFound().build());
    }

    // UPDATE
    @PutMapping("/updateUser/{id}")
    public ResponseEntity<userEntity> updateUser(@PathVariable Integer id, @RequestBody userEntity updatedUser) {
        userEntity updated = userv.updateUser(id, updatedUser);
        return (updated != null) ? ResponseEntity.ok(updated) : ResponseEntity.notFound().build();
    }

    // DELETE
    @DeleteMapping("/deleteUser/{id}")
    public ResponseEntity<String> deleteUser(@PathVariable Integer id) {
        String result = userv.deleteUser(id);
        if (result.contains("not found")) {
            return ResponseEntity.status(404).body(result);
        }
        return ResponseEntity.ok(result);
    }
}
