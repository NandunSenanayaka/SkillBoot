package com.linhtch90.psnbackend.controller;

import com.linhtch90.psnbackend.entity.JobEntity;
import com.linhtch90.psnbackend.entity.JobRequestEntity;
import com.linhtch90.psnbackend.service.JobService;
import com.linhtch90.psnbackend.service.FileStorageService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;



import java.util.HashMap;
import java.util.List;
import java.util.Map;



@RestController
@RequestMapping("/api/v1")
@CrossOrigin(origins = "*")
public class JobController {

    @Autowired
    private JobService jobService;

    @Autowired
    private FileStorageService fileStorageService;

    @PostMapping("/insertjob")
    public ResponseEntity<?> insertJob(@RequestBody JobRequestEntity jobRequest) {
        try {
            JobEntity job = jobService.insertJob(jobRequest);
            Map<String, Object> response = new HashMap<>();
            response.put("status", "success");
            response.put("message", "Job posted successfully");
            response.put("job", job);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            Map<String, Object> response = new HashMap<>();
            response.put("status", "error");
            response.put("message", e.getMessage());
            return ResponseEntity.badRequest().body(response);
        }
    }

    @GetMapping("/jobs")
    public ResponseEntity<?> getAllJobs() {
        try {
            List<JobEntity> jobs = jobService.getAllJobs();
            Map<String, Object> response = new HashMap<>();
            response.put("status", "success");
            response.put("jobs", jobs);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            Map<String, Object> response = new HashMap<>();
            response.put("status", "error");
            response.put("message", e.getMessage());
            return ResponseEntity.badRequest().body(response);
        }
    }

    @GetMapping("/jobs/user/{userId}")
    public ResponseEntity<?> getJobsByUserId(@PathVariable String userId) {
        try {
            List<JobEntity> jobs = jobService.getJobsByUserId(userId);
            Map<String, Object> response = new HashMap<>();
            response.put("status", "success");
            response.put("jobs", jobs);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            Map<String, Object> response = new HashMap<>();
            response.put("status", "error");
            response.put("message", e.getMessage());
            return ResponseEntity.badRequest().body(response);
        }
    }

    @GetMapping("/jobs/{id}")
    public ResponseEntity<?> getJobById(@PathVariable String id) {
        try {
            JobEntity job = jobService.getJobById(id).orElse(null);
            if (job != null) {
                Map<String, Object> response = new HashMap<>();
                response.put("status", "success");
                response.put("job", job);
                return ResponseEntity.ok(response);
            } else {
                Map<String, Object> response = new HashMap<>();
                response.put("status", "error");
                response.put("message", "Job not found");
                return ResponseEntity.notFound().build();
            }
        } catch (Exception e) {
            Map<String, Object> response = new HashMap<>();
            response.put("status", "error");
            response.put("message", e.getMessage());
            return ResponseEntity.badRequest().body(response);
        }
    }

 @PutMapping(value = "/jobs/{id}", consumes = { "multipart/form-data" })
    public ResponseEntity<?> updateJob(
            @PathVariable String id,
            @RequestParam("jobTitle") String jobTitle,
            @RequestParam("jobCategory") String jobCategory,
            @RequestParam("jobDescription") String jobDescription,
            @RequestParam("salary") String salary,
            @RequestParam("companyName") String companyName,
            @RequestParam("userId") String userId,
            @RequestParam(value = "image", required = false) MultipartFile image) {
        try {
            JobRequestEntity jobRequest = new JobRequestEntity();
            jobRequest.setUserId(userId);
            jobRequest.setJobTitle(jobTitle);
            jobRequest.setJobCategory(jobCategory);
            jobRequest.setJobDescription(jobDescription);
            jobRequest.setSalary(salary);
            jobRequest.setCompanyName(companyName);
            
            // Handle image update
            if (image != null && !image.isEmpty()) {
                // New image file uploaded
                String imageUrl = fileStorageService.storeFile(image);
                jobRequest.setImage(imageUrl);
            }

            JobEntity updatedJob = jobService.updateJob(id, jobRequest);
            if (updatedJob != null) {
                Map<String, Object> response = new HashMap<>();
                response.put("status", "success");
                response.put("message", "Job updated successfully");
                response.put("job", updatedJob);
                return ResponseEntity.ok(response);
            } else {
                Map<String, Object> response = new HashMap<>();
                response.put("status", "error");
                response.put("message", "Job not found");
                return ResponseEntity.notFound().build();
            }
        } catch (Exception e) {
            Map<String, Object> response = new HashMap<>();
            response.put("status", "error");
            response.put("message", e.getMessage());
            return ResponseEntity.badRequest().body(response);
        }
        //delete mapping
    }
    @DeleteMapping("/jobs/{id}")
    public ResponseEntity<Map<String, Object>> deleteJob(@PathVariable String id, @RequestParam String userId) {
        Map<String, Object> response = new HashMap<>();
        try {
            boolean deleted = jobService.deleteJob(id, userId);
            if (deleted) {
                response.put("status", "success");
                response.put("message", "Job deleted successfully");
                return ResponseEntity.ok(response);
            } else {
                response.put("status", "error");
                response.put("message", "Job not found");
                return ResponseEntity.notFound().build();
            }
        } catch (RuntimeException e) {
            response.put("status", "error");
            response.put("message", e.getMessage());
            return ResponseEntity.badRequest().body(response);
        }
    }
} 
