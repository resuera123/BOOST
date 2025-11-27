package com.appdevg6.error404.boost.service;

import com.appdevg6.error404.boost.entity.userEntity;
import com.appdevg6.error404.boost.repository.userRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class userService {

    @Autowired
    private userRepository urepo;

    @Autowired
    private PasswordEncoder passwordEncoder;

    // CREATE
    public userEntity createUser(userEntity user) {
        if (user.getPassword() != null) {
            user.setPassword(passwordEncoder.encode(user.getPassword()));
        }
        return urepo.save(user);
    }

    // READ (All)
    public List<userEntity> getAllUsers() {
        return urepo.findAll();
    }

    // READ (By ID)
    public Optional<userEntity> getUserById(Integer id) {
        return urepo.findById(id);
    }

    // UPDATE
    @SuppressWarnings("finally")
    public userEntity updateUser(Integer id, userEntity updatedUser) {
        Optional<userEntity> opt = urepo.findById(id);
        if (opt.isPresent()) {
            userEntity user = opt.get();
            // update allowed fields
            if (updatedUser.getUsername() != null) user.setUsername(updatedUser.getUsername());
            if (updatedUser.getEmail() != null) user.setEmail(updatedUser.getEmail());
            if (updatedUser.getPassword() != null) user.setPassword(passwordEncoder.encode(updatedUser.getPassword()));
            if (updatedUser.getPhone() != null) user.setPhone(updatedUser.getPhone());
            if (updatedUser.getFirstname() != null) user.setFirstname(updatedUser.getFirstname());
            if (updatedUser.getMiddlename() != null) user.setMiddlename(updatedUser.getMiddlename());
            if (updatedUser.getLastname() != null) user.setLastname(updatedUser.getLastname());
            if (updatedUser.getRole() != null) user.setRole(updatedUser.getRole());
            return urepo.save(user);
        }
        return null;
    }

    // DELETE
    public String deleteUser(Integer id) {
        if (urepo.existsById(id)) {
            urepo.deleteById(id);
            return "User deleted successfully";
        } else {
            return "User with id " + id + " not found";
        }
    }
}