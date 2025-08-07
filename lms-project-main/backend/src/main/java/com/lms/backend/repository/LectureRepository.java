package com.lms.backend.repository;

import com.lms.backend.model.Lecture;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface LectureRepository extends JpaRepository<Lecture, Long> {
    List<Lecture> findByCourse_Id(Long courseId);
}
