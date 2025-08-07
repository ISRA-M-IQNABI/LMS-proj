package com.lms.backend.payload;

public class CourseRequest {

    private String title;
    private String description;
    private String category;
    private int durationInHours;

    // Constructors
    public CourseRequest() {}

    public CourseRequest(String title, String description, String category, int durationInHours) {
        this.title = title;
        this.description = description;
        this.category = category;
        this.durationInHours = durationInHours;
    }

    // Getters and Setters
    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public String getCategory() {
        return category;
    }

    public void setCategory(String category) {
        this.category = category;
    }

    public int getDurationInHours() {
        return durationInHours;
    }

    public void setDurationInHours(int durationInHours) {
        this.durationInHours = durationInHours;
    }
}
