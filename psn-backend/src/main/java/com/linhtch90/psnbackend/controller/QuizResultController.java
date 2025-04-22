package com.linhtch90.psnbackend.controller;

import com.linhtch90.psnbackend.entity.QuizResult;
import com.linhtch90.psnbackend.service.QuizResultService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/v1/quiz-results")
@CrossOrigin(origins = "*")
public class QuizResultController {

    @Autowired
    private QuizResultService quizResultService;

    @GetMapping("/user/{userId}")
    public ResponseEntity<Map<String, Object>> getResultsByUserId(@PathVariable String userId) {
        List<QuizResult> results = quizResultService.getResultsByUserId(userId);
        
        Map<String, Object> response = new HashMap<>();
        response.put("status", "success");
        response.put("data", results);
        
        return new ResponseEntity<>(response, HttpStatus.OK);
    }

    @GetMapping("/user/{userId}/quiz/{quizId}")
    public ResponseEntity<Map<String, Object>> getResultByUserIdAndQuizId(
            @PathVariable String userId, 
            @PathVariable String quizId) {
        Optional<QuizResult> result = quizResultService.getResultByUserIdAndQuizId(userId, quizId);
        
        Map<String, Object> response = new HashMap<>();
        
        if (result.isPresent()) {
            response.put("status", "success");
            response.put("data", result.get());
            return new ResponseEntity<>(response, HttpStatus.OK);
        } else {
            response.put("status", "error");
            response.put("message", "Quiz result not found");
            return new ResponseEntity<>(response, HttpStatus.NOT_FOUND);
        }
    }

    @GetMapping("/check/{userId}/quiz/{quizId}")
    public ResponseEntity<Map<String, Object>> checkIfUserCompletedQuiz(
            @PathVariable String userId, 
            @PathVariable String quizId) {
        boolean hasCompleted = quizResultService.hasUserCompletedQuiz(userId, quizId);
        
        Map<String, Object> response = new HashMap<>();
        response.put("status", "success");
        response.put("hasCompleted", hasCompleted);
        
        return new ResponseEntity<>(response, HttpStatus.OK);
    }

    @PostMapping
    public ResponseEntity<Map<String, Object>> saveQuizResult(@RequestBody QuizResult quizResult) {
        QuizResult savedResult = quizResultService.saveQuizResult(quizResult);
        
        Map<String, Object> response = new HashMap<>();
        response.put("status", "success");
        response.put("message", "Quiz result saved successfully");
        response.put("data", savedResult);
        
        return new ResponseEntity<>(response, HttpStatus.CREATED);
    }
} 