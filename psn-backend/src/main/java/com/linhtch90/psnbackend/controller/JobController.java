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

