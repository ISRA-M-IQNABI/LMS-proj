package com.lms.backend.service;

import com.lms.backend.model.Course;
import com.lms.backend.payload.CourseRequest;
import com.lms.backend.repository.CourseRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class CourseService {

    @Autowired
    private CourseRepository courseRepository;

    public List<Course> getAllCourses() {
        return courseRepository.findAll();
    }

    public Course getCourseById(Long id) {
        return courseRepository.findById(id).orElse(null);
    }

    public Course saveCourse(Course course) {
        return courseRepository.save(course);
    }

    public void deleteCourse(Long id) {
        courseRepository.deleteById(id);
    }

    public Object assignInstructor(Long courseId, Long instructorId) {
       throw new UnsupportedOperationException("Unimplemented method 'assignInstructor'");
    }

    public Object createCourse(CourseRequest request) {
        throw new UnsupportedOperationException("Unimplemented method 'createCourse'");
    }

    public Object updateCourse(Long id, CourseRequest request) {
        throw new UnsupportedOperationException("Unimplemented method 'updateCourse'");
    }
}
