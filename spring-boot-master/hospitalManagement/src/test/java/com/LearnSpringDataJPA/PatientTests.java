package com.LearnSpringDataJPA;

import com.LearnSpringDataJPA.entity.Patient;
import com.LearnSpringDataJPA.repository.PatientRepository;
import com.LearnSpringDataJPA.service.PatientService;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;

import java.util.List;

@SpringBootTest
public class PatientTests {

    @Autowired
    private PatientRepository patientRepository;

    @Autowired
    private PatientService patientService;

    @Test
    public void testPatientRepository() {
        List<Patient> patientList = patientRepository.findAll();
        System.out.println(patientList);

        Patient p1 = new Patient();
        patientRepository.save(p1);
    }

//    @Test
//    public void testTransitionMethods() {
//        Patient patient = patientService.getPatientById(1L);
//        System.out.println(patient);
//    }
}
