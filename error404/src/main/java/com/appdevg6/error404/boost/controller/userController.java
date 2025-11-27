package com.appdevg6.error404.boost.controller;

import com.appdevg6.error404.boost.entity.userEntity;
import com.appdevg6.error404.boost.service.userService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
import java.util.Optional;

import org.springframework.security.crypto.password.PasswordEncoder;

@RestController
@RequestMapping("/api/users")
@CrossOrigin(origins = "http://localhost:3000")
public class userController {

    @Autowired
    private userService userv;

    @Autowired
    private PasswordEncoder passwordEncoder;

    // LOGIN
    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody LoginRequest loginRequest) {
        if (loginRequest == null || loginRequest.getEmail() == null || loginRequest.getPassword() == null) {
            return ResponseEntity.badRequest().body(Map.of("error", "Email and password required"));
        }

        List<userEntity> users = userv.getAllUsers();
        for (userEntity user : users) {
            if (user != null && loginRequest.getEmail().equals(user.getEmail())) {
                if (user.getPassword() != null && passwordEncoder.matches(loginRequest.getPassword(), user.getPassword())) {
                    user.setPassword(null); // ensure password not returned
                    return ResponseEntity.ok(Map.of("success", true, "user", user));
                }
                break;
            }
        }
        return ResponseEntity.status(401).body(Map.of("success", false, "error", "Invalid email or password"));
    }

    // REGISTER
    @PostMapping("/register")
    public ResponseEntity<userEntity> register(@RequestBody userEntity user) {
        userEntity created = userv.createUser(user);
        return ResponseEntity.ok(created);
    }

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

class LoginRequest {
    private String email;
    private String password;

    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }
    public String getPassword() { return password; }
    public void setPassword(String password) { this.password = password; }
}
