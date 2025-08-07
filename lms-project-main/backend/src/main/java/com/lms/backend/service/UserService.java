package com.lms.backend.service;

import com.lms.backend.model.User;
import com.lms.backend.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

@Service
public class UserService {
    @Autowired
    private UserRepository userRepo;

    @Autowired
    private BCryptPasswordEncoder passwordEncoder;

    public User save(User user) {
        user.setPassword(passwordEncoder.encode(user.getPassword()));
        return userRepo.save(user);
    }

    public Object getProfile(String token) {
       throw new UnsupportedOperationException("Unimplemented method 'getProfile'");
    }

    public Object updateProfile(String token, User updatedUser) {
        throw new UnsupportedOperationException("Unimplemented method 'updateProfile'");
    }
}
