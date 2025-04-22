import React, { useState, useEffect } from "react";
import { Button, Form, Row, Col } from "react-bootstrap";
import { Hashicon } from "@emeraldpay/hashicon-react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import imageCompression from "browser-image-compression";
import { useDispatch } from "react-redux";
import { createJob, getAllJobs } from "../feature/job/jobSlice";
import { useNavigate } from "react-router-dom";

function JobPostCompose() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [userId] = useState(localStorage.getItem("psnUserId"));
  const [userFullname] = useState(
    localStorage.getItem("psnUserFirstName") +
      " " +
      localStorage.getItem("psnUserLastName")
  );
  
  // Form state
  const [jobTitle, setJobTitle] = useState("");
  const [jobCategory, setJobCategory] = useState("");
  const [jobDescription, setJobDescription] = useState("");
  const [salary, setSalary] = useState("");
  const [companyName, setCompanyName] = useState("");
  const [disablePostButton, setDisablePostButton] = useState(true);
  
  // Image state
  const [file, setFile] = useState(null);
  const [file64String, setFile64String] = useState(null);
  const [file64StringWithType, setFile64StringWithType] = useState(null);

  useEffect(() => {
    // Check if user is authenticated
    if (!userId) {
      navigate("/signin");
    }
  }, [userId, navigate]);

  function showSuccessMessage(inputMessage) {
    toast.success(inputMessage, {
      position: "bottom-center",
      autoClose: 3000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: "colored",
    });
  }

  function showFailMessage(inputMessage) {
    toast.error(inputMessage, {
      position: "bottom-center",
      autoClose: 3000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: "colored",
    });
  }

  function validateForm() {
    if (jobTitle.trim() === "" || 
        jobCategory.trim() === "" || 
        jobDescription.trim() === "" || 
        salary.trim() === "" ||
        companyName.trim() === "") {
      setDisablePostButton(true);
    } else {
      setDisablePostButton(false);
    }
  }

  function handleJobTitleChange(e) {
    setJobTitle(e.target.value);
    validateForm();
  }

  function handleJobCategoryChange(e) {
    setJobCategory(e.target.value);
    validateForm();
  }

  function handleJobDescriptionChange(e) {
    setJobDescription(e.target.value);
    validateForm();
  }

  function handleSalaryChange(e) {
    setSalary(e.target.value);
    validateForm();
  }

  function handleCompanyNameChange(e) {
    setCompanyName(e.target.value);
    validateForm();
  }

  async function handleCreateJobPost(e) {
    e.preventDefault();
    
    const jobData = {
      id: null,
      userId: userId,
      jobTitle: jobTitle,
      jobCategory: jobCategory,
      jobDescription: jobDescription,
      salary: salary,
      image: file64StringWithType,
      companyName: companyName
    };
    
    try {
      const result = await dispatch(createJob(jobData)).unwrap();
      if (result) {
        showSuccessMessage("Job posted successfully!");
        // Reset form
        setJobTitle("");
        setJobCategory("");
        setJobDescription("");
        setSalary("");
        setCompanyName("");
        setFile64String(null);
        setFile64StringWithType(null);
        setDisablePostButton(true);
        
        // Refresh job list
        dispatch(getAllJobs());
        
        // Navigate back to jobs page
        navigate("/newsfeed/jobs");
      }
    } catch (error) {
      showFailMessage("Failed to post job: " + error);
    }
  }

  function onUploadFileChange(e) {
    setFile64String(null);
    if (e.target.files < 1 || !e.target.validity.valid) {
      return;
    }
    compressImageFile(e);
  }

  function fileToBase64(file, cb) {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = function () {
      cb(null, reader.result);
    };
    reader.onerror = function (error) {
      cb(error, null);
    };
  }

  async function compressImageFile(event) {
    const imageFile = event.target.files[0];
    const options = {
      maxWidthOrHeight: 250,
      useWebWorker: true,
    };
    try {
      const compressedFile = await imageCompression(imageFile, options);
      fileToBase64(compressedFile, (err, result) => {
        if (result) {
          setFile(result);
          setFile64StringWithType(result);
          setFile64String(String(result.split(",")[1]));
        }
      });
    } catch (error) {
      setFile64String(null);
    }
  }

  return (
    <div>
      <div className="border rounded-3 border-success p-3 shadow mb-4">
        <ToastContainer />
        <Form className="d-flex flex-column">
          <Form.Group className="mb-3">
            <Form.Label>
              <div className="d-flex align-items-center mb-1">
                <div className="mx-3">
                  <Hashicon value={userId} size={60} />
                </div>
                <div className="fs-4 fw-bold">{userFullname}</div>
              </div>
            </Form.Label>
          </Form.Group>

          <Row>
            <Col md={6}>
              <Form.Group className="mb-3">
                <Form.Label>Job Title</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Enter job title"
                  value={jobTitle}
                  onChange={handleJobTitleChange}
                />
              </Form.Group>
            </Col>
            <Col md={6}>
              <Form.Group className="mb-3">
                <Form.Label>Job Category</Form.Label>
                <Form.Select 
                  value={jobCategory}
                  onChange={handleJobCategoryChange}
                >
                  <option value="">Select category</option>
                  <option value="Technology">Technology</option>
                  <option value="Coding">Coding</option>
                  <option value="Web Development">Web Development</option>
                  <option value="Mobile Development">Mobile Development</option>
                  <option value="Data Science">Data Science</option>
                  <option value="Marketing">Marketing</option>
                  <option value="Sales">Sales</option>
                  <option value="Finance">Finance</option>
                  <option value="Healthcare">Healthcare</option>
                  <option value="Education">Education</option>
                  <option value="Cooking">Cooking</option>
                  <option value="Photography">Photography</option>
                  <option value="DIY Craft">DIY Craft</option>
                  <option value="Design">Design</option>
                  <option value="Writing">Writing</option>
                  <option value="Customer Service">Customer Service</option>
                  <option value="Administrative">Administrative</option>
                  <option value="Legal">Legal</option>
                  <option value="Engineering">Engineering</option>
                  <option value="Construction">Construction</option>
                  <option value="Transportation">Transportation</option>
                  <option value="Other">Other</option>
                </Form.Select>
              </Form.Group>
            </Col>
          </Row>

          <Form.Group className="mb-3">
            <Form.Label>Company Name</Form.Label>
            <Form.Control
              type="text"
              placeholder="Enter company name"
              value={companyName}
              onChange={handleCompanyNameChange}
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Job Description</Form.Label>
            <Form.Control
              as="textarea"
              rows={4}
              placeholder="Enter job description"
              value={jobDescription}
              onChange={handleJobDescriptionChange}
              style={{ resize: "none" }}
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Salary Range</Form.Label>
            <Form.Control
              type="text"
              placeholder="Enter salary range (e.g., $50,000 - $70,000)"
              value={salary}
              onChange={handleSalaryChange}
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Company Image (Optional)</Form.Label>
            <Form.Control
              type="file"
              accept=".jpg, .jpeg, .png"
              onChange={onUploadFileChange}
            />
          </Form.Group>

          <div className="d-flex justify-content-end align-items-center">
            <Button
              onClick={handleCreateJobPost}
              variant="success"
              disabled={disablePostButton}
              className="col-2 mx-3"
            >
              Post Job
            </Button>
          </div>
        </Form>
        {file64String !== null ? (
          <div className="mt-3">
            <img 
              src={file64StringWithType} 
              alt="company" 
              className="img-fluid rounded"
              style={{ maxHeight: "200px" }}
            />
          </div>
        ) : null}
      </div>
    </div>
  );
}

export default JobPostCompose; 