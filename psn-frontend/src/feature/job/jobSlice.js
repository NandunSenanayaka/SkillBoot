import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const API_URL = "http://localhost:9092";

// Create job post
export const createJob = createAsyncThunk(
  "job/createJob",
  async (jobData, { rejectWithValue }) => {
    try {
      const response = await axios.post(`${API_URL}/api/v1/insertjob`, jobData, {
        headers: {
          Authorization: localStorage.getItem("psnToken"),
        },
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

// Get all jobs
export const getAllJobs = createAsyncThunk(
  "job/getAllJobs",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${API_URL}/api/v1/jobs`, {
        headers: {
          Authorization: localStorage.getItem("psnToken"),
        },
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

// Get jobs by user ID
export const getJobsByUserId = createAsyncThunk(
  "job/getJobsByUserId",
  async (userId, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${API_URL}/api/v1/jobs/user/${userId}`, {
        headers: {
          Authorization: localStorage.getItem("psnToken"),
        },
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

// Get job by ID
export const getJobById = createAsyncThunk(
  "job/getJobById",
  async (jobId, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${API_URL}/api/v1/jobs/${jobId}`, {
        headers: {
          Authorization: localStorage.getItem("psnToken"),
        },
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

// Update job
export const updateJob = createAsyncThunk(
  "job/updateJob",
  async ({ jobId, jobData, userId }, { rejectWithValue }) => {
    try {
      const response = await axios.put(
        `${API_URL}/api/v1/jobs/${jobId}`,
        jobData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
            Authorization: localStorage.getItem("psnToken"),
          },
        }
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || { message: "Failed to update job" });
    }
  }
);

// Delete job
export const deleteJob = createAsyncThunk(
  "job/deleteJob",
  async ({ jobId, userId }, { rejectWithValue }) => {
    try {
      const response = await axios.delete(`${API_URL}/api/v1/jobs/${jobId}?userId=${userId}`, {
        headers: {
          Authorization: localStorage.getItem("psnToken"),
        },
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data.message || "Failed to delete job");
    }
  }
);

const initialState = {
  jobs: [],
  userJobs: [],
  selectedJob: null,
  loading: false,
  error: null,
};

const jobSlice = createSlice({
  name: "job",
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Create job
      .addCase(createJob.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createJob.fulfilled, (state, action) => {
        state.loading = false;
        state.jobs.unshift(action.payload.job);
      })
      .addCase(createJob.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || "Failed to create job";
      })
      // Get all jobs
      .addCase(getAllJobs.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getAllJobs.fulfilled, (state, action) => {
        state.loading = false;
        state.jobs = action.payload.jobs;
      })
      .addCase(getAllJobs.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || "Failed to fetch jobs";
      })
      // Get jobs by user ID
      .addCase(getJobsByUserId.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getJobsByUserId.fulfilled, (state, action) => {
        state.loading = false;
        state.userJobs = action.payload.jobs;
      })
      .addCase(getJobsByUserId.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || "Failed to fetch user jobs";
      })
      // Get job by ID
      .addCase(getJobById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getJobById.fulfilled, (state, action) => {
        state.loading = false;
        state.selectedJob = action.payload.job;
      })
      .addCase(getJobById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || "Failed to fetch job";
      })
      // Update job
      .addCase(updateJob.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateJob.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.jobs.findIndex(job => job.id === action.payload.job.id);
        if (index !== -1) {
          state.jobs[index] = action.payload.job;
        }
        if (state.selectedJob?.id === action.payload.job.id) {
          state.selectedJob = action.payload.job;
        }
      })
      .addCase(updateJob.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || "Failed to update job";
      })
      // Delete job
      .addCase(deleteJob.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteJob.fulfilled, (state, action) => {
        state.loading = false;
        state.jobs = state.jobs.filter(job => job.id !== action.meta.arg);
        state.userJobs = state.userJobs.filter(job => job.id !== action.meta.arg);
        if (state.selectedJob?.id === action.meta.arg) {
          state.selectedJob = null;
        }
      })
      .addCase(deleteJob.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || "Failed to delete job";
      });
  },
});

export const { clearError } = jobSlice.actions;
export default jobSlice.reducer; 