package com.appdevg6.error404.boost.service;

import com.appdevg6.error404.boost.entity.userEntity;
import com.appdevg6.error404.boost.repository.userRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;
import java.util.NoSuchElementException;

@Service
public class userService {

    @Autowired
    private userRepository urepo;

    // CREATE
    public userEntity createUser(userEntity user) {
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
        userEntity user = new userEntity();
        try {
            user = urepo.findById(id).get();
            user.setUsername(updatedUser.getUsername());
            user.setPassword(updatedUser.getPassword());
            user.setEmail(updatedUser.getEmail());
            user.setPhone(updatedUser.getPhone());
            user.setFirstname(updatedUser.getFirstname());
            user.setMiddlename(updatedUser.getMiddlename());
            user.setLastname(updatedUser.getLastname());
            user.setRole(updatedUser.getRole());
            return urepo.save(user);
        } catch (NoSuchElementException ex) {
            throw new NoSuchElementException("User " + id + " does not exist");
        } finally {
            return urepo.save(user);
        }
    }

    // DELETE
    public String deleteUser(Integer id) {
        String msg = "";

        if (urepo.findById(id).isPresent()) {
            urepo.deleteById(id);
            msg = "User " + id + " deleted successfully";
        } else {
            msg = "User " + id + " does not exist";
        }

        return msg;
    }
}