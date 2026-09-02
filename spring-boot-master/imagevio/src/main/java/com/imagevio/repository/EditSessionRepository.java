package com.imagevio.repository;

import com.imagevio.entity.EditSessionEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface EditSessionRepository extends JpaRepository<EditSessionEntity, Long> {
    Optional<EditSessionEntity> findBySessionId(String sessionId);
}
