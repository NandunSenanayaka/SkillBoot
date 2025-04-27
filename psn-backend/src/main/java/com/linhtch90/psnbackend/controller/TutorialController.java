package com.linhtch90.psnbackend.controller;

import com.linhtch90.psnbackend.model.Tutorial;
import com.linhtch90.psnbackend.service.TutorialService;
import com.linhtch90.psnbackend.service.FileStorageService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Map;

@RestController
@RequestMapping("/api/v1/tutorials")
@CrossOrigin(origins = "*")
public class TutorialController {

    @Autowired
    private TutorialService tutorialService;

    @Autowired
    private FileStorageService fileStorageService;

    @PostMapping
    public ResponseEntity<?> createTutorial(
            @RequestParam("tutorialName") String tutorialName,
            @RequestParam("category") String category,
            @RequestParam("description") String description,
            @RequestParam("userId") String userId,
            @RequestParam("videoUrl") String videoUrl) {
        
        try {
            Tutorial tutorial = new Tutorial();
            tutorial.setTutorialName(tutorialName);
            tutorial.setCategory(category);
            tutorial.setDescription(description);
            tutorial.setUserId(userId);
            tutorial.setVideoUrl(videoUrl);

            Tutorial savedTutorial = tutorialService.createTutorial(tutorial);

            Map<String, Object> response = new HashMap<>();
            response.put("status", "success");
            response.put("message", "Tutorial created successfully");
            response.put("data", savedTutorial);

            return ResponseEntity.ok(response);
        } catch (Exception e) {
            Map<String, Object> response = new HashMap<>();
            response.put("status", "error");
            response.put("message", e.getMessage());
            return ResponseEntity.badRequest().body(response);
        }
    }

    @GetMapping
    public ResponseEntity<?> getAllTutorials() {
        try {
            List<Tutorial> tutorials = tutorialService.getAllTutorials();
            Map<String, Object> response = new HashMap<>();
            response.put("status", "success");
            response.put("data", tutorials);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            Map<String, Object> response = new HashMap<>();
            response.put("status", "error");
            response.put("message", e.getMessage());
            return ResponseEntity.badRequest().body(response);
        }
    }

    @GetMapping("/user/{userId}")
    public ResponseEntity<?> getTutorialsByUserId(@PathVariable String userId) {
        try {
            List<Tutorial> tutorials = tutorialService.getTutorialsByUserId(userId);
            Map<String, Object> response = new HashMap<>();
            response.put("status", "success");
            response.put("data", tutorials);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            Map<String, Object> response = new HashMap<>();
            response.put("status", "error");
            response.put("message", e.getMessage());
            return ResponseEntity.badRequest().body(response);
        }
    }

    @GetMapping("/category/{category}")
    public ResponseEntity<?> getTutorialsByCategory(@PathVariable String category) {
        try {
            List<Tutorial> tutorials = tutorialService.getTutorialsByCategory(category);
            Map<String, Object> response = new HashMap<>();
            response.put("status", "success");
            response.put("data", tutorials);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            Map<String, Object> response = new HashMap<>();
            response.put("status", "error");
            response.put("message", e.getMessage());
            return ResponseEntity.badRequest().body(response);
        }
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> getTutorialById(@PathVariable String id) {
        try {
            return tutorialService.getTutorialById(id)
                    .map(tutorial -> {
                        Map<String, Object> response = new HashMap<>();
                        response.put("status", "success");
                        response.put("data", tutorial);
                        return ResponseEntity.ok(response);
                    })
                    .orElse(ResponseEntity.notFound().build());
        } catch (Exception e) {
            Map<String, Object> response = new HashMap<>();
            response.put("status", "error");
            response.put("message", e.getMessage());
            return ResponseEntity.badRequest().body(response);
        }
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> updateTutorial(
            @PathVariable String id,
            @RequestParam("tutorialName") String tutorialName,
            @RequestParam("category") String category,
            @RequestParam("description") String description,
            @RequestParam(value = "video", required = false) MultipartFile video) {
        
        try {
            Tutorial tutorial = new Tutorial();
            tutorial.setTutorialName(tutorialName);
            tutorial.setCategory(category);
            tutorial.setDescription(description);
            
            if (video != null && !video.isEmpty()) {
                String videoUrl = fileStorageService.storeFile(video);
                tutorial.setVideoUrl(videoUrl);
            }

            Tutorial updatedTutorial = tutorialService.updateTutorial(id, tutorial);
            if (updatedTutorial != null) {
                Map<String, Object> response = new HashMap<>();
                response.put("status", "success");
                response.put("message", "Tutorial updated successfully");
                response.put("data", updatedTutorial);
                return ResponseEntity.ok(response);
            } else {
                return ResponseEntity.notFound().build();
            }
        } catch (Exception e) {
            Map<String, Object> response = new HashMap<>();
            response.put("status", "error");
            response.put("message", e.getMessage());
            return ResponseEntity.badRequest().body(response);
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteTutorial(@PathVariable String id) {
        try {
            tutorialService.deleteTutorial(id);
            Map<String, Object> response = new HashMap<>();
            response.put("status", "success");
            response.put("message", "Tutorial deleted successfully");
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            Map<String, Object> response = new HashMap<>();
            response.put("status", "error");
            response.put("message", e.getMessage());
            return ResponseEntity.badRequest().body(response);
        }
    } 
} 