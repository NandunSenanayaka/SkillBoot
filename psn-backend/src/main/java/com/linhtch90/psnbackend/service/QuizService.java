package com.linhtch90.psnbackend.service;

import com.linhtch90.psnbackend.entity.Quiz;
import com.linhtch90.psnbackend.repository.QuizRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.List;
import java.util.Optional;

@Service
public class QuizService {

    @Autowired
    private QuizRepository quizRepository;

    public List<Quiz> getAllQuizzes() {
        return quizRepository.findAll();
    }

    public List<Quiz> getQuizzesByUserId(String userId) {
        return quizRepository.findByUserId(userId);
    }

    public Optional<Quiz> getQuizById(String id) {
        return quizRepository.findById(id);
    }

    public Quiz createQuiz(Quiz quiz) {
        LocalDateTime now = LocalDateTime.now();
        DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss");
        String formattedDateTime = now.format(formatter);
        
        quiz.setCreatedAt(formattedDateTime);
        quiz.setUpdatedAt(formattedDateTime);
        
        return quizRepository.save(quiz);
    }

   

    
} 
