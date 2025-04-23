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

    public List<Quiz> getAllQuizzes() {
        return quizRepository.findAll();
    }
} 
