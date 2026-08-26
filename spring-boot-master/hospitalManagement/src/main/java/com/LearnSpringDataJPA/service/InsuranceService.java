package com.LearnSpringDataJPA.service;

import com.LearnSpringDataJPA.entity.Insurance;
import com.LearnSpringDataJPA.entity.Patient;
import com.LearnSpringDataJPA.repository.InsuranceRepository;
import com.LearnSpringDataJPA.repository.PatientRepository;
import jakarta.persistence.EntityNotFoundException;
import jakarta.transaction.Transactional;
import lombok.AllArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@AllArgsConstructor
public class InsuranceService {

    private final InsuranceRepository insuranceRepository;
    private final PatientRepository patientRepository;

    @Transactional
    public Patient assignInsuranceToPatient(Insurance insurance, Long patientId) {
        Patient patient = patientRepository.findById(patientId).orElseThrow(() -> new EntityNotFoundException("Patient not found with id:" + patientId));

        patient.setInsurance(insurance);
        insurance.setPatient(patient); // bidirectional consistency maintain
        return patient;
    }

    @Transactional
    public Patient disaccociateInsuranceFromPatient(Long patientId) {
        Patient patient = patientRepository.findById(patientId).orElseThrow(() -> new EntityNotFoundException("Patient not found with id:" + patientId));
        if (patient.getInsurance() != null) {
            patient.getInsurance().setPatient(null);
            patient.setInsurance(null);
        }
        return patient;
    }
}
