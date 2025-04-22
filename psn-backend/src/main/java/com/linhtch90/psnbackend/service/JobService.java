package com.linhtch90.psnbackend.service;

import com.linhtch90.psnbackend.entity.JobEntity;
import com.linhtch90.psnbackend.entity.JobRequestEntity;
import com.linhtch90.psnbackend.repository.JobRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.Date;
import java.util.List;
import java.util.Optional;

@Service
public class JobService {

    @Autowired
    private JobRepository jobRepository;

    public JobEntity insertJob(JobRequestEntity jobRequest) {
        JobEntity jobEntity = new JobEntity();
        jobEntity.setUserId(jobRequest.getUserId());
        jobEntity.setJobTitle(jobRequest.getJobTitle());
        jobEntity.setJobCategory(jobRequest.getJobCategory());
        jobEntity.setJobDescription(jobRequest.getJobDescription());
        jobEntity.setSalary(jobRequest.getSalary());
        jobEntity.setImage(jobRequest.getImage());
        jobEntity.setCompanyName(jobRequest.getCompanyName());
        jobEntity.setCreatedAt(new Date());
        return jobRepository.save(jobEntity);
    }

    public List<JobEntity> getAllJobs() {
        return jobRepository.findAllByOrderByCreatedAtDesc();
    }

    public List<JobEntity> getJobsByUserId(String userId) {
        return jobRepository.findByUserId(userId);
    }
    
    public Optional<JobEntity> getJobById(String id) {
        return jobRepository.findById(id);
    }
    
    public JobEntity updateJob(String id, JobRequestEntity jobRequest) {
        Optional<JobEntity> existingJob = jobRepository.findById(id);
        if (existingJob.isPresent()) {
            JobEntity job = existingJob.get();
            // Check if the user ID matches
            if (!job.getUserId().equals(jobRequest.getUserId())) {
                throw new RuntimeException("You are not authorized to update this job post");
            }
            job.setJobTitle(jobRequest.getJobTitle());
            job.setJobCategory(jobRequest.getJobCategory());
            job.setJobDescription(jobRequest.getJobDescription());
            job.setSalary(jobRequest.getSalary());
            job.setCompanyName(jobRequest.getCompanyName());
            if (jobRequest.getImage() != null && !jobRequest.getImage().isEmpty()) {
                job.setImage(jobRequest.getImage());
            }
            return jobRepository.save(job);
        }
        throw new RuntimeException("Job not found");
    }
    
    public boolean deleteJob(String id, String userId) {
        Optional<JobEntity> existingJob = jobRepository.findById(id);
        if (existingJob.isPresent()) {
            JobEntity job = existingJob.get();
            // Check if the user ID matches
            if (!job.getUserId().equals(userId)) {
                throw new RuntimeException("You are not authorized to delete this job post");
            }
            jobRepository.deleteById(id);
            return true;
        }
        return false;
    }
} 