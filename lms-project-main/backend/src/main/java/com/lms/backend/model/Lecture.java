package com.lms.backend.model;

import jakarta.persistence.*;

@Entity
@Table(name = "lectures")
public class Lecture {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String title;
    private String type; // PDF أو VIDEO أو TEXT
    private String url;

    @ManyToOne
    @JoinColumn(name = "course_id")
    private Course course;

    public void setTitle(String title2) {
        throw new UnsupportedOperationException("Unimplemented method 'setTitle'");
    }

    public void setUrl(String filePath) {
        throw new UnsupportedOperationException("Unimplemented method 'setUrl'");
    }

    // Constructors, Getters, Setters
}
