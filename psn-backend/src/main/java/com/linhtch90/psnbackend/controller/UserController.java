package com.linhtch90.psnbackend.controller;

import java.security.Principal;
import java.util.Optional;

import com.linhtch90.psnbackend.entity.AuthorizedEntity;
import com.linhtch90.psnbackend.entity.DoubleIdObjectEntity;
import com.linhtch90.psnbackend.entity.IdObjectEntity;
import com.linhtch90.psnbackend.entity.UserEntity;
import com.linhtch90.psnbackend.entity.UserSignInEntity;
import com.linhtch90.psnbackend.repository.UserRepository;
import com.linhtch90.psnbackend.service.JWTUtil;
import com.linhtch90.psnbackend.service.ResponseObjectService;
import com.linhtch90.psnbackend.service.UserService;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/v1")
public class UserController {
    @Autowired
    private UserService userService;

    @Autowired
    private JWTUtil jwtUtil;

    @Autowired
    private AuthenticationManager authenticationManager;

    @Autowired
    private UserRepository userRepo;
