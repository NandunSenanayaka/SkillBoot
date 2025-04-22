package com.linhtch90.psnbackend.entity;

public class JobRequestEntity {
    private String id;
    private String userId;
    private String jobTitle;
    private String jobCategory;
    private String jobDescription;
    private String salary;
    private String image;
    private String companyName;

    public JobRequestEntity() {
    }

    public JobRequestEntity(String id, String userId, String jobTitle, String jobCategory, String jobDescription, String salary, String image, String companyName) {
        this.id = id;
        this.userId = userId;
        this.jobTitle = jobTitle;
        this.jobCategory = jobCategory;
        this.jobDescription = jobDescription;
        this.salary = salary;
        this.image = image;
        this.companyName = companyName;
    }

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getUserId() {
        return userId;
    }

    public void setUserId(String userId) {
        this.userId = userId;
    }

    public String getJobTitle() {
        return jobTitle;
    }

    public void setJobTitle(String jobTitle) {
        this.jobTitle = jobTitle;
    }

    public String getJobCategory() {
        return jobCategory;
    }

    public void setJobCategory(String jobCategory) {
        this.jobCategory = jobCategory;
    }

    public String getJobDescription() {
        return jobDescription;
    }

    public void setJobDescription(String jobDescription) {
        this.jobDescription = jobDescription;
    }

    public String getSalary() {
        return salary;
    }

    public void setSalary(String salary) {
        this.salary = salary;
    }

    public String getImage() {
        return image;
    }

    public void setImage(String image) {
        this.image = image;
    }

    public String getCompanyName() {
        return companyName;
    }

    public void setCompanyName(String companyName) {
        this.companyName = companyName;
    }
} 