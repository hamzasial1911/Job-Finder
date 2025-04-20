import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import PageHeader from "../Components/PageHeader";

const JobDetails = () => {
  const { id } = useParams(); // Fetch job ID from URL parameters
  const [job, setJob] = useState(null); // State to store job details
  const [isLoading, setIsLoading] = useState(true); // Loading state for fetching job details
  const [isApplying, setIsApplying] = useState(false); // Loading state for applying
  const [applied, setApplied] = useState(false); // Track if user has applied
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user"));

    const userEmail = user?.state?.user?.email;

  useEffect(() => {
    // Fetch job details from the API when component mounts
    fetch(`http://localhost:3000/all-jobs/${id}`)
      .then((res) => {
        if (!res.ok) {
          throw new Error("Failed to fetch job details.");
        }
        return res.json();
      })
      .then((data) => {
        setJob(data);
        setIsLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching job details:", error);
        Swal.fire("Error", "Job details could not be fetched.", "error");
        navigate("/"); // Redirect to home if the job details cannot be loaded
      });
  }, [id, navigate]);

  const handleApply = async () => {
    const userRole = localStorage.getItem("role");


    if (userRole === "employee") {
      // Confirm application
      const { value: confirmation } = await Swal.fire({
        title: "Are you sure?",
        text: "Do you want to apply for this job?",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Yes, apply!",
      });

      if (confirmation) {
        const fileInput = document.createElement("input");
        fileInput.type = "file";
        fileInput.accept = "application/pdf,image/*";

        fileInput.onchange = async (event) => {
          const file = event.target.files[0];
          if (!file) {
            Swal.fire("Error", "No file selected.", "error");
            return;
          }

          if (file.size > 3 * 1024 * 1024) {
            Swal.fire("Error", "File size exceeds 3MB limit.", "error");
            return;
          }

          // Prepare the form data
          const formData = new FormData();
          formData.append("resume", file);
          formData.append("jobId", id); // Pass the job ID to the backend
          formData.append("email", userEmail); // User ID from local storage
          try {
            setIsApplying(true); // Show loader
            const res = await fetch("http://localhost:3000/apply-job", {
              method: "POST",
              body: formData,
            });

            if (!res.ok) {
              throw new Error("Failed to submit application.");
            }

            Swal.fire("Success", "Your application has been submitted!", "success");
            setApplied(true); // Mark as applied
          } catch (error) {
            console.error("Error applying for the job:", error);
            Swal.fire("Error", "Could not submit your application.", "error");
          } finally {
            setIsApplying(false); // Hide loader
          }
        };

        fileInput.click(); // Trigger file upload dialog
      }
    } else {
      // Redirect to login if the user is not an employee
      Swal.fire("Unauthorized", "You need to be logged in as an employee to apply.", "error");
      navigate("/login", { state: { from: `/job/${id}` } });
    }
  };

  return (
    <div className="container mx-auto px-4 py-0">
      <PageHeader title="Job Details" path="Job Details" />
      {isLoading ? (
        <div className="text-center py-6">
          <p>Loading job details...</p>
        </div>
      ) : job ? (
        <div className="bg-white shadow-md rounded-lg p-6">
          <h1 className="text-2xl font-bold mb-4">{job.jobTitle}</h1>
          <p className="text-gray-600 mb-4">{job.description}</p>
          <p className="font-medium">
            <span className="font-bold">Company:</span> {job.companyName}
          </p>
          <p className="font-medium">
            <span className="font-bold">Salary Range:</span> ${job.minPrice} - ${job.maxPrice}
          </p>
          <p className="font-medium">
            <span className="font-bold">Location:</span> {job.location}
          </p>
          <p className="font-medium">
            <span className="font-bold">Posted On:</span> {new Date(job.postedAt).toLocaleDateString()}
          </p>

          <div className="mt-6">
            <button
              className={`px-8 py-2 rounded text-white ${
                applied || isApplying
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-blue-600 hover:bg-blue-700"
              }`}
              disabled={applied || isApplying}
              onClick={handleApply}
            >
              {isApplying
                ? "Submitting..."
                : applied
                ? "Application Sent"
                : "Apply Now"}
            </button>
          </div>
        </div>
      ) : (
        <div className="text-center py-6">
          <p>Job not found.</p>
        </div>
      )}
    </div>
  );
};

export default JobDetails;
