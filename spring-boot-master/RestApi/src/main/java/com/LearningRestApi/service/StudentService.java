package com.LearningRestApi.service;

import com.LearningRestApi.dto.AddStudentRequestDto;
import com.LearningRestApi.dto.StudentDto;

import java.util.List;

public interface StudentService {
    List<StudentDto> getAllStudents();

    StudentDto getStudentById(Long id);

    StudentDto createNewStudent(AddStudentRequestDto addStudentRequestDto);

    void deleteStudentById(Long id);
}
