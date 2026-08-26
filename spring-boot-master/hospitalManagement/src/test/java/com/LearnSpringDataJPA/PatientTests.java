package com.LearnSpringDataJPA;

import com.LearnSpringDataJPA.dto.BloodGroupCountResponseEntity;
import com.LearnSpringDataJPA.entity.Patient;
import com.LearnSpringDataJPA.entity.type.BloodGroupType;
import com.LearnSpringDataJPA.repository.PatientRepository;
import com.LearnSpringDataJPA.service.PatientService;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;

import java.time.LocalDate;
import java.util.List;

@SpringBootTest
public class PatientTests {

    @Autowired
    private PatientRepository patientRepository;

    @Autowired
    private PatientService patientService;

    @Test
    public void testPatientRepository() {
//        List<Patient> patientList = patientRepository.findAll();
        List<Patient> patientList = patientRepository.findAllPatientWithAppointment();

        System.out.println(patientList);

    //        Patient p1 = new Patient();
    //        p1.setName("Test Patient");
    //        p1.setEmail("test.patient@example.com");
    //        patientRepository.save(p1);
    //        patientRepository.delete(p1);
    }

    @Test
    public void testTransitionMethods() {
//        Patient patient = patientService.getPatientById(1L);
//        System.out.println(patient);
//        Patient patient = patientRepository.findByName("Diya Patel");
//        List<Patient> patientList = patientRepository.findByBirthDateOrEmail(LocalDate.of(1995, 8, 20), "neha.iyer@example.com");

//        List<Patient> patientList = patientRepository.findByNameContainingOrderByNameDesc("Di");
//        List<Patient> patientList = patientRepository.findByBloodGroup(BloodGroupType.O_POSITIVE);
//        List<Patient> patientList = patientRepository.findByBornAfterDate(LocalDate.of(1996,1, 18));
        Page<Patient> patientList = patientRepository.findAllPatients(PageRequest.of(0,2, Sort.by("name")));
        for (Patient patient : patientList) {
            System.out.println(patient);
        }
//
//        List<Object[]> bloodGroupList = patientRepository.countEachBloodGroupType();
//        for(Object[] objects: bloodGroupList){
//            System.out.println(objects[0]+" "+objects[1]);
//        }

//        int rowsUpdated = patientRepository.updateNameWithId("Arav Sharma",1L);
//        System.out.println(rowsUpdated);

        List<BloodGroupCountResponseEntity> bloodGroupList = patientRepository.countEachBloodGroupType();
        for(BloodGroupCountResponseEntity bloodGroupCountResponse: bloodGroupList){
            System.out.println(bloodGroupCountResponse);
        }
    }
}
