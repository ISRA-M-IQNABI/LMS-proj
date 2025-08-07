package com.lms.backend.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.lms.backend.model.Quiz;
import com.lms.backend.payload.QuizSubmissionRequest;
import com.lms.backend.service.AssessmentService;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/assessments")
@RequiredArgsConstructor
public class AssessmentController {
    private final AssessmentService assessmentService;

    @PostMapping("/create-quiz")
    public ResponseEntity<?> createQuiz(@RequestBody Quiz quiz) {
        return ResponseEntity.ok(assessmentService.createQuiz(quiz));
    }

    @PostMapping("/submit")
    public ResponseEntity<?> submitQuiz(@RequestBody QuizSubmissionRequest submission) {
        return ResponseEntity.ok(assessmentService.submitQuiz(submission));
    }

    @GetMapping("/score/{studentId}")
    public ResponseEntity<?> getStudentScore(@PathVariable Long studentId) {
        return ResponseEntity.ok(assessmentService.getScores(studentId));
    }
}
