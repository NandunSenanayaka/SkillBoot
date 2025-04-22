import React, { useEffect, useState } from "react";
import { Card, Row, Col, Button } from "react-bootstrap";
import { Hashicon } from "@emeraldpay/hashicon-react";
import { useDispatch, useSelector } from "react-redux";
import { getAllJobs, deleteJob, updateJob, clearError } from "../feature/job/jobSlice";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";

function JobVacancies() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { jobs, loading, error } = useSelector((state) => state.jobReducer);
  const [selectedJob, setSelectedJob] = useState(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [editForm, setEditForm] = useState({
    jobTitle: "",
    jobCategory: "",
    jobDescription: "",
    salary: "",
    companyName: "",
    image: null
  });
  const [editImagePreview, setEditImagePreview] = useState(null);

  const currentUserId = localStorage.getItem("psnUserId");

  useEffect(() => {
    dispatch(getAllJobs());
  }, [dispatch]);

  useEffect(() => {
    if (error) {
      const timer = setTimeout(() => {
        dispatch(clearError());
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [error, dispatch]);

  const handleDelete = async (jobId) => {
    if (window.confirm("Are you sure you want to delete this job posting?")) {
      try {
        await dispatch(deleteJob({ jobId, userId: currentUserId })).unwrap();
        toast.success("Job deleted successfully!");
      } catch (error) {
        toast.error(error.message || "Failed to delete job");
      }
    }
  };

  const handleEdit = (job) => {
    setSelectedJob(job);
    setEditForm({
      jobTitle: job.jobTitle,
      jobCategory: job.jobCategory,
      jobDescription: job.jobDescription,
      salary: job.salary,
      companyName: job.companyName,
      image: null
    });
    setEditImagePreview(job.image || null);
  };

  const handleEditImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setEditForm({ ...editForm, image: file });
      setEditImagePreview(URL.createObjectURL(file));
    }
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    try {
      const formData = new FormData();
      formData.append("jobTitle", editForm.jobTitle);
      formData.append("jobCategory", editForm.jobCategory);
      formData.append("jobDescription", editForm.jobDescription);
      formData.append("salary", editForm.salary);
      formData.append("companyName", editForm.companyName);
      formData.append("userId", currentUserId);
      
      if (editForm.image) {
        formData.append("image", editForm.image);
      }

      await dispatch(updateJob({ 
        jobId: selectedJob.id, 
        jobData: formData,
        userId: currentUserId 
      })).unwrap();
      
      setSelectedJob(null);
      setEditImagePreview(null);
      toast.success("Job updated successfully!");
    } catch (error) {
      toast.error(error.message || "Failed to update job");
    }
  };

  const handlePostJob = () => {
    if (currentUserId) {
      navigate("/post-job");
    } else {
      navigate("/signin");
    }
  };

  const filteredJobs = jobs?.filter(job => {
    const searchLower = searchQuery.toLowerCase();
    return (
      job.jobTitle.toLowerCase().includes(searchLower) ||
      job.companyName.toLowerCase().includes(searchLower) ||
      job.jobCategory.toLowerCase().includes(searchLower)
    );
  });

  if (loading) {
    return <div className="text-center">Loading...</div>;
  }

  if (error) {
    return <div className="text-center text-danger">Error: {error}</div>;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Job Vacancies</h1>
        <div className="d-flex justify-content-end">
          <button
            onClick={handlePostJob}
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
            style={{
              backgroundColor: '#0d6efd',
              color: 'white',
              padding: '10px 20px',
              borderRadius: '20px',
              fontWeight: '500',
              boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
              border: 'none',
              transition: 'all 0.2s ease'
            }}
          >
            Post a Job
          </button>
        </div>
      </div>

      <div className="mb-6">
        <input
          type="text"
          placeholder="Search jobs by title, company, or category..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          style={{
            border: '1px solid #333',
            borderRadius: '8px',
            padding: '12px 16px',
            marginBottom: '24px',
            boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
          }}
        />
      </div>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredJobs && filteredJobs.map((job) => (
          <div
            key={job.id}
            className="bg-white rounded-lg shadow-md p-6 mb-4 hover:shadow-lg transition-shadow"
            style={{
              border: '1px solid #e0e0e0',
              borderRadius: '12px',
              padding: '24px',
              backgroundColor: '#ffffff',
              boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
              marginBottom: '20px',
              height: '100%',
              display: 'flex',
              flexDirection: 'column'
            }}
          >
            {selectedJob && selectedJob.id === job.id ? (
              <form onSubmit={handleEditSubmit} className="d-flex flex-column h-100">
                <div className="mb-3">
                  <label className="form-label fw-bold">Job Title</label>
                  <input
                    type="text"
                    className="form-control"
                    value={editForm.jobTitle}
                    onChange={(e) =>
                      setEditForm({ ...editForm, jobTitle: e.target.value })
                    }
                    required
                  />
                </div>
                <div className="mb-3">
                  <label className="form-label fw-bold">Company Name</label>
                  <input
                    type="text"
                    className="form-control"
                    value={editForm.companyName}
                    onChange={(e) =>
                      setEditForm({ ...editForm, companyName: e.target.value })
                    }
                    required
                  />
                </div>
                <div className="mb-3">
                  <label className="form-label fw-bold">Category</label>
                  <select
                    className="form-select"
                    value={editForm.jobCategory}
                    onChange={(e) =>
                      setEditForm({ ...editForm, jobCategory: e.target.value })
                    }
                    required
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
                  </select>
                </div>
                <div className="mb-3">
                  <label className="form-label fw-bold">Description</label>
                  <textarea
                    className="form-control"
                    value={editForm.jobDescription}
                    onChange={(e) =>
                      setEditForm({ ...editForm, jobDescription: e.target.value })
                    }
                    required
                    rows="4"
                  />
                </div>
                <div className="mb-3">
                  <label className="form-label fw-bold">Salary</label>
                  <input
                    type="text"
                    className="form-control"
                    value={editForm.salary}
                    onChange={(e) =>
                      setEditForm({ ...editForm, salary: e.target.value })
                    }
                    required
                  />
                </div>
                <div className="mb-3">
                  <label className="form-label fw-bold">Job Image</label>
                  <input
                    type="file"
                    className="form-control"
                    onChange={handleEditImageChange}
                    accept="image/*"
                  />
                  {editImagePreview && (
                    <div className="mt-2">
                      <img
                        src={editImagePreview}
                        alt="Preview"
                        className="img-fluid rounded"
                        style={{
                          maxHeight: '200px',
                          objectFit: 'cover',
                          width: '100%'
                        }}
                      />
                    </div>
                  )}
                </div>
                <div className="d-flex justify-content-end gap-2 mt-auto">
                  <button
                    type="button"
                    onClick={() => setSelectedJob(null)}
                    className="btn btn-outline-secondary px-4"
                    style={{ borderRadius: '20px' }}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="btn btn-primary px-4"
                    style={{ borderRadius: '20px' }}
                  >
                    Save
                  </button>
                </div>
              </form>
            ) : (
              <>
                <div className="mb-4">
                  <h2 className="fs-5 fw-bold mb-1">{job.jobTitle}</h2>
                  <p className="text-muted mb-0">{job.companyName}</p>
                </div>

                <div className="mb-3">
                  <span className="badge bg-light text-dark me-2">{job.jobCategory}</span>
                  <span className="text-success fw-semibold">${job.salary}</span>
                </div>

                <p className="text-gray-700 mb-4 flex-grow-1" style={{ whiteSpace: 'pre-line' }}>
                  {job.jobDescription}
                </p>

                {job.image && (
                  <img
                    src={job.image}
                    alt={job.jobTitle}
                    className="w-100 rounded mb-4"
                    style={{
                      maxHeight: '300px',
                      objectFit: 'cover',
                      borderRadius: '8px'
                    }}
                  />
                )}

                {currentUserId && job.userId === currentUserId && (
                  <div className="d-flex justify-content-end gap-2 mt-auto">
                    <button
                      onClick={() => handleEdit(job)}
                      className="btn btn-outline-primary px-4"
                      style={{ borderRadius: '20px' }}
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(job.id)}
                      className="btn btn-outline-danger px-4"
                      style={{ borderRadius: '20px' }}
                    >
                      Delete
                    </button>
                  </div>
                )}
              </>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

export default JobVacancies; 