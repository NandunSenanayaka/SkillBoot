 package com.linhtch90.psnbackend.service;

import com.linhtch90.psnbackend.entity.QuizResult;
import com.linhtch90.psnbackend.repository.QuizResultRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.List;
import java.util.Optional;

@Service
public class QuizResultService {

    @Autowired
    private QuizResultRepository quizResultRepository;

    public List<QuizResult> getResultsByUserId(String userId) {
        return quizResultRepository.findByUserId(userId);
    }

    public Optional<QuizResult> getResultByUserIdAndQuizId(String userId, String quizId) {
        return quizResultRepository.findByUserIdAndQuizId(userId, quizId);
    }

    public boolean hasUserCompletedQuiz(String userId, String quizId) {
        return quizResultRepository.existsByUserIdAndQuizId(userId, quizId);
    }

    public QuizResult saveQuizResult(QuizResult quizResult) {
        LocalDateTime now = LocalDateTime.now();
        DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss");
        quizResult.setCompletedAt(now.format(formatter));
        
        return quizResultRepository.save(quizResult);
    }
} 
} 
