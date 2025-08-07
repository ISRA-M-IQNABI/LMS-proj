package com.lms.backend.payload;

import java.util.Map;

public class QuizSubmissionRequest {

    private Long quizId;
    private Long studentId;
    private Map<Long, String> answers; // key: questionId, value: answer

    // Constructors
    public QuizSubmissionRequest() {}

    public QuizSubmissionRequest(Long quizId, Long studentId, Map<Long, String> answers) {
        this.quizId = quizId;
        this.studentId = studentId;
        this.answers = answers;
    }

    // Getters and Setters
    public Long getQuizId() {
        return quizId;
    }

    public void setQuizId(Long quizId) {
        this.quizId = quizId;
    }

    public Long getStudentId() {
        return studentId;
    }

    public void setStudentId(Long studentId) {
        this.studentId = studentId;
    }

    public Map<Long, String> getAnswers() {
        return answers;
    }

    public void setAnswers(Map<Long, String> answers) {
        this.answers = answers;
    }
}
