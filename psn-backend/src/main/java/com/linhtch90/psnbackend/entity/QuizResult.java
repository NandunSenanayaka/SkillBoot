package com.linhtch90.psnbackend.entity;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.util.Map;

@Document(collection = "quiz_results")
public class QuizResult {
    @Id
    private String id;
    private String quizId;
    private String userId;
    private int score;
    private Map<String, String> answers; // Map of question index to selected answer
    private String completedAt;

    public QuizResult() {
    }

    public QuizResult(String id, String quizId, String userId, int score, Map<String, String> answers, String completedAt) {
        this.id = id;
        this.quizId = quizId;
        this.userId = userId;
        this.score = score;
        this.answers = answers;
        this.completedAt = completedAt;
    }

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getQuizId() {
        return quizId;
    }

    public void setQuizId(String quizId) {
        this.quizId = quizId;
    }

    public String getUserId() {
        return userId;
    }

    public void setUserId(String userId) {
        this.userId = userId;
    }

    public int getScore() {
        return score;
    }

    public void setScore(int score) {
        this.score = score;
    }

    public Map<String, String> getAnswers() {
        return answers;
    }

    public void setAnswers(Map<String, String> answers) {
        this.answers = answers;
    }

    public String getCompletedAt() {
        return completedAt;
    }

    public void setCompletedAt(String completedAt) {
        this.completedAt = completedAt;
    }
} 
