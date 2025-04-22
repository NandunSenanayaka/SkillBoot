package com.linhtch90.psnbackend.repository;

import com.linhtch90.psnbackend.entity.JobEntity;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface JobRepository extends MongoRepository<JobEntity, String> {
    List<JobEntity> findAllByOrderByCreatedAtDesc();
    List<JobEntity> findByUserId(String userId);
    Optional<JobEntity> findById(String id);
    void deleteById(String id);
} 