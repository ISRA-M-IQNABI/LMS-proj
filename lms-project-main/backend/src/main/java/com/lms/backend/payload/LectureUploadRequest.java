package com.lms.backend.payload;

import org.springframework.web.multipart.MultipartFile;

public class LectureUploadRequest {

    private String title;
    private String type; // مثل: PDF أو VIDEO
    private Long courseId;
    private MultipartFile file;

    // Constructors
    public LectureUploadRequest() {}

    public LectureUploadRequest(String title, String type, Long courseId, MultipartFile file) {
        this.title = title;
        this.type = type;
        this.courseId = courseId;
        this.file = file;
    }

    // Getters and Setters
    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public String getType() {
        return type;
    }

    public void setType(String type) {
        this.type = type;
    }

    public Long getCourseId() {
        return courseId;
    }

    public void setCourseId(Long courseId) {
        this.courseId = courseId;
    }

    public MultipartFile getFile() {
        return file;
    }

    public void setFile(MultipartFile file) {
        this.file = file;
    }
}
