package com.linhtch90.psnbackend.repository;

import com.linhtch90.psnbackend.entity.Quiz;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.List;


@Repository
public interface QuizRepository extends MongoRepository<Quiz, String> {
    List<Quiz> findByUserId(String userId);
} 
