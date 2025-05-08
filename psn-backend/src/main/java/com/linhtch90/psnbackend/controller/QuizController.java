package com.linhtch90.psnbackend.controller;

import com.linhtch90.psnbackend.entity.Quiz;
import com.linhtch90.psnbackend.service.QuizService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/v1/quizzes")
@CrossOrigin(origins = "*")
public class QuizController {

    @Autowired
    private QuizService quizService;

    @GetMapping
    public ResponseEntity<Map<String, Object>> getAllQuizzes() {
        List<Quiz> quizzes = quizService.getAllQuizzes();
        
        Map<String, Object> response = new HashMap<>();
        response.put("status", "success");
        response.put("data", quizzes);

        
        return new ResponseEntity<>(response, HttpStatus.OK);
    }

    @GetMapping("/{id}")
    public ResponseEntity<Map<String, Object>> getQuizById(@PathVariable String id) {
        Optional<Quiz> quiz = quizService.getQuizById(id);
        
        Map<String, Object> response = new HashMap<>();
        
        if (quiz.isPresent()) {
            response.put("status", "success");
            response.put("data", quiz.get());
            return new ResponseEntity<>(response, HttpStatus.OK);
        } else {
            response.put("status", "error");
            response.put("message", "Quiz not found");
            return new ResponseEntity<>(response, HttpStatus.NOT_FOUND);
        }
    }

    @GetMapping("/user/{userId}")
    public ResponseEntity<Map<String, Object>> getQuizzesByUserId(@PathVariable String userId) {
        List<Quiz> quizzes = quizService.getQuizzesByUserId(userId);
        
        Map<String, Object> response = new HashMap<>();
        response.put("status", "success");
        response.put("data", quizzes);
        
        return new ResponseEntity<>(response, HttpStatus.OK);
    }

    @PostMapping
    public ResponseEntity<Map<String, Object>> createQuiz(@RequestBody Quiz quiz) {
        Quiz createdQuiz = quizService.createQuiz(quiz);
        
        Map<String, Object> response = new HashMap<>();
        response.put("status", "success");
        response.put("message", "Quiz created successfully");
        response.put("data", createdQuiz);
        
        return new ResponseEntity<>(response, HttpStatus.CREATED);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Map<String, Object>> updateQuiz(@PathVariable String id, @RequestBody Quiz quiz) {
        Quiz updatedQuiz = quizService.updateQuiz(id, quiz);
        
        Map<String, Object> response = new HashMap<>();
        
        if (updatedQuiz != null) {
            response.put("status", "success");
            response.put("message", "Quiz updated successfully");
            response.put("data", updatedQuiz);
            return new ResponseEntity<>(response, HttpStatus.OK);
        } else {
            response.put("status", "error");
            response.put("message", "Quiz not found");
            return new ResponseEntity<>(response, HttpStatus.NOT_FOUND);
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Map<String, Object>> deleteQuiz(@PathVariable String id) {
        boolean deleted = quizService.deleteQuiz(id);
        
        Map<String, Object> response = new HashMap<>();
        
        if (deleted) {
            response.put("status", "success");
            response.put("message", "Quiz deleted successfully");
            return new ResponseEntity<>(response, HttpStatus.OK);
        } else {
            response.put("status", "error");
            response.put("message", "Quiz not found or could not be deleted");
            return new ResponseEntity<>(response, HttpStatus.NOT_FOUND);
        }
    }
} 
