package com.LearnSpringDataJPA.repository;

import com.LearnSpringDataJPA.entity.Patient;
import org.springframework.data.jpa.repository.JpaRepository;

public interface PatientRepository extends JpaRepository<Patient,Long> {

}
