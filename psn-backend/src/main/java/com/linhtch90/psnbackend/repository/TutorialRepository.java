package com.linhtch90.psnbackend.repository;

import com.linhtch90.psnbackend.model.Tutorial;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface TutorialRepository extends MongoRepository<Tutorial, String> {
    
} 