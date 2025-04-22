package com.linhtch90.psnbackend.service;

import com.linhtch90.psnbackend.model.Tutorial;
import com.linhtch90.psnbackend.repository.TutorialRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Service
public class TutorialService {

    @Autowired
    private TutorialRepository tutorialRepository;

    public Tutorial createTutorial(Tutorial tutorial) {
        tutorial.setCreatedAt(LocalDateTime.now());
        tutorial.setUpdatedAt(LocalDateTime.now());
        return tutorialRepository.save(tutorial);
    }

    public List<Tutorial> getAllTutorials() {
        return tutorialRepository.findAll();
    }

    public List<Tutorial> getTutorialsByUserId(String userId) {
        return tutorialRepository.findByUserId(userId);
    }

    public List<Tutorial> getTutorialsByCategory(String category) {
        return tutorialRepository.findByCategory(category);
    }

    public Optional<Tutorial> getTutorialById(String id) {
        return tutorialRepository.findById(id);
    }

    public Tutorial updateTutorial(String id, Tutorial tutorial) {
        Optional<Tutorial> existingTutorial = tutorialRepository.findById(id);
        if (existingTutorial.isPresent()) {
            Tutorial updatedTutorial = existingTutorial.get();
            updatedTutorial.setTutorialName(tutorial.getTutorialName());
            updatedTutorial.setCategory(tutorial.getCategory());
            updatedTutorial.setDescription(tutorial.getDescription());
            updatedTutorial.setVideoUrl(tutorial.getVideoUrl());
            updatedTutorial.setUpdatedAt(LocalDateTime.now());
            return tutorialRepository.save(updatedTutorial);
        }
        return null;
    }

    public void deleteTutorial(String id) {
        tutorialRepository.deleteById(id);
    }
} 