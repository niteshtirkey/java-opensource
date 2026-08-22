package com.LearnSpringDataJPA.repository;

import com.LearnSpringDataJPA.entity.Appointment;
import org.springframework.data.jpa.repository.JpaRepository;

public interface AppointmentRepository extends JpaRepository<Appointment, Long> {
}