package com.lms.backend.service;

import com.lms.backend.model.Lecture;
import com.lms.backend.payload.LectureUploadRequest;
import com.lms.backend.repository.LectureRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.io.IOException;

@Service
public class LectureService {

    @Autowired
    private LectureRepository lectureRepository;

    public Lecture uploadLecture(MultipartFile file, String title, String type, Long courseId) throws IOException {
        String filePath = "/uploads/" + file.getOriginalFilename();
        file.transferTo(new File(filePath));

        Lecture lecture = new Lecture();
        lecture.setTitle(title);
        lecture.setTitle(type);
        lecture.setUrl(filePath);
        return lectureRepository.save(lecture);
    }

    public Object uploadLecture(Long courseId, LectureUploadRequest lectureRequest) {
        throw new UnsupportedOperationException("Unimplemented method 'uploadLecture'");
    }

    public Object getLecturesByCourse(Long courseId) {
        throw new UnsupportedOperationException("Unimplemented method 'getLecturesByCourse'");
    }
}
