package com.LearnSpringDataJPA;

import com.LearnSpringDataJPA.entity.Appointment;
import com.LearnSpringDataJPA.entity.Insurance;
import com.LearnSpringDataJPA.entity.Patient;
import com.LearnSpringDataJPA.service.AppointmentService;
import com.LearnSpringDataJPA.service.InsuranceService;
import com.LearnSpringDataJPA.repository.PatientRepository;
import org.junit.jupiter.api.Test;
import static org.junit.jupiter.api.Assertions.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;

import java.time.LocalDate;
import java.time.LocalDateTime;

import org.springframework.transaction.annotation.Transactional;

@SpringBootTest
@Transactional
public class InsuranceTests {

    @Autowired
    private InsuranceService insuranceService;

    @Autowired
    private AppointmentService appointmentService;
    
    @Autowired
    private jakarta.persistence.EntityManager entityManager;

    @Test
    public void testInsurance() {
        Insurance insurance = Insurance.builder()
                .policyNumber("HDFC_" + java.util.UUID.randomUUID().toString().substring(0, 8))
                .provider("HDFC")
                .validUntil(LocalDate.of(2029, 11, 30))
                .build();

        Patient patient = insuranceService.assignInsuranceToPatient(insurance, 2L);
        entityManager.flush(); // <--- This flush proves CascadeType.ALL works (generates INSERT)
        System.out.println("After Assign: " + patient);

        var newPatient = insuranceService.disaccociateInsuranceFromPatient(patient.getId());
        entityManager.flush(); // <--- This flush proves orphanRemoval=true works (generates DELETE)
        System.out.println("After Disassociate: " + newPatient);
    }

    @Test
    public void testCreateAppointment() {
        Appointment appointment = Appointment.builder()
                .appointmentTime(LocalDateTime.of(2026, 8, 24, 10, 0))
                .reason("Cancer")
                .build();
        var newAppointment = appointmentService.createNewAppointment(appointment, 1L, 2L);
        System.out.println(newAppointment);

        var updatedAppointment = appointmentService.reAssignAppointmentToAnotherDoctor(newAppointment.getId(),3L);

        System.out.println(updatedAppointment);
    }
    @Autowired
    private PatientRepository patientRepository;

    @Test
    public void testDeletePatientCascadesToAppointments() {
        Long doctorId = 1L;
        Long patientId = 1L;

        // 1. Setup: Create 3 appointments for the patient
        createAppointmentsForPatient(doctorId, patientId, 3);
        
        // Push inserts to DB and clear cache to fetch fresh state
        entityManager.flush();
        entityManager.clear();

        // 2. Verify: Ensure appointments are properly assigned
        Patient patient = patientRepository.findById(patientId).orElseThrow();
        assertEquals(3, patient.getAppointments().size(), "Patient should have 3 appointments assigned");
        
        // 3. Act: Delete the patient
        patientRepository.delete(patient);
        entityManager.flush(); // Triggers cascade delete for appointments
        
        // 4. Assert: Ensure patient is completely removed from the DB
        boolean patientExists = patientRepository.findById(patientId).isPresent();
        assertFalse(patientExists, "Patient should be deleted from the database");
    }

    private void createAppointmentsForPatient(Long doctorId, Long patientId, int count) {
        for (int i = 1; i <= count; i++) {
            Appointment appointment = Appointment.builder()
                    .appointmentTime(LocalDateTime.now().plusDays(i))
                    .reason("Follow up appointment " + i)
                    .build();
            
            appointmentService.createNewAppointment(appointment, doctorId, patientId);
        }
    }
}