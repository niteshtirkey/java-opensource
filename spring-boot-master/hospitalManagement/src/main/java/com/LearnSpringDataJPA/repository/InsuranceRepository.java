package com.LearnSpringDataJPA.repository;

import com.LearnSpringDataJPA.entity.Insurance;
import org.springframework.data.jpa.repository.JpaRepository;

public interface InsuranceRepository extends JpaRepository<Insurance, Long> {
}