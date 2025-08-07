package com.lms.backend.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.lms.backend.payload.LectureUploadRequest;
import com.lms.backend.service.LectureService;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/lectures")
@RequiredArgsConstructor
public class LectureController {
    private final LectureService lectureService;

    @PostMapping("/upload")
    public ResponseEntity<?> uploadLecture(@RequestParam Long courseId,
                                           @RequestBody LectureUploadRequest lectureRequest) {
        return ResponseEntity.ok(lectureService.uploadLecture(courseId, lectureRequest));
    }

    @GetMapping("/{courseId}")
    public ResponseEntity<?> getLectures(@PathVariable Long courseId) {
        return ResponseEntity.ok(lectureService.getLecturesByCourse(courseId));
    }
}
