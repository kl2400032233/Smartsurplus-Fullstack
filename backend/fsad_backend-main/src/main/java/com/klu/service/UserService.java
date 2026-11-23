package com.klu.service;

import java.util.Optional;
import java.util.List;

import org.springframework.stereotype.Service;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;

import com.klu.model.User;
import com.klu.repository.UserRepository;

@Service
public class UserService {
    private final UserRepository repo;
    private final PasswordEncoder passwordEncoder = new BCryptPasswordEncoder();

    public UserService(UserRepository repo) {
        this.repo = repo;
    }

    public List<User> findAll() { return repo.findAll(); }

    public User invite(User user) {
        if (user.getName() == null || user.getName().isBlank() || user.getEmail() == null || user.getEmail().isBlank())
            throw new RuntimeException("Name and email are required");
        if (repo.findByEmail(user.getEmail()).isPresent()) throw new RuntimeException("Email already exists");
        user.setPassword(passwordEncoder.encode(java.util.UUID.randomUUID().toString()));
        user.setStatus("Pending");
        return repo.save(user);
    }

    public User register(User user) {
        Optional<User> existingUser = repo.findByEmail(user.getEmail());
        if (existingUser.isPresent()) {
            throw new RuntimeException("Email already exists");
        }

        user.setPassword(passwordEncoder.encode(user.getPassword()));
        if (user.getStatus() == null || user.getStatus().isBlank()) user.setStatus("Active");
        return repo.save(user);
    }

    public User login(String email, String password) {
        Optional<User> userOpt = repo.findByEmail(email);
        if (userOpt.isPresent() && passwordEncoder.matches(password, userOpt.get().getPassword())) {
            return userOpt.get();
        }
        return null;
    }
}
