package com.linhtch90.psnbackend.repository;

import com.linhtch90.psnbackend.entity.QuizResult;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;
import java.util.List;
import java.util.Optional;

@Repository
public interface QuizResultRepository extends MongoRepository<QuizResult, String> {
    List<QuizResult> findByUserId(String userId);
    Optional<QuizResult> findByUserIdAndQuizId(String userId, String quizId);
    boolean existsByUserIdAndQuizId(String userId, String quizId);
} 
