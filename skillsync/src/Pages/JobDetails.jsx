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
  // New states for test handling
  const [showTest, setShowTest] = useState(false);
  const [testQuestions, setTestQuestions] = useState([]);
  const [userAnswers, setUserAnswers] = useState({});
  const [testScore, setTestScore] = useState(null);
  const [isGeneratingTest, setIsGeneratingTest] = useState(false);
  
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

  const generateTest = async () => {
    setIsGeneratingTest(true);
    try {
      const response = await fetch('http://localhost:3000/generate-test', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          jobTitle: job.jobTitle,
          jobDescription: job.description,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to generate test');
      }

      const data = await response.json();
      setTestQuestions(data.questions);
      setShowTest(true);
    } catch (error) {
      console.error('Error generating test:', error);
      Swal.fire('Error', 'Failed to generate test questions', 'error');
    } finally {
      setIsGeneratingTest(false);
    }
  };

  const handleAnswerSelect = (questionId, answer) => {
    setUserAnswers(prev => ({
      ...prev,
      [questionId]: answer
    }));
  };

  const submitTest = async () => {
    try {
      const response = await fetch('http://localhost:3000/evaluate-test', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          jobId: id,
          userId: userEmail,
          answers: userAnswers,
          questions: testQuestions,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to evaluate test');
      }

      const result = await response.json();
      setTestScore(result.score);
      
      // If test passed, proceed with resume upload
      if (result.score >= 70) {
        Swal.fire('Success', `You passed the test with ${result.score}%! Please proceed with your application.`, 'success');
        handleResumeUpload();
      } else {
        Swal.fire('Sorry', `You scored ${result.score}%. Minimum required score is 70%.`, 'error');
      }
    } catch (error) {
      console.error('Error submitting test:', error);
      Swal.fire('Error', 'Failed to submit test', 'error');
    }
  };

  const handleResumeUpload = () => {
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
  };

  const handleApply = async () => {
    const userRole = localStorage.getItem("role");

    if (userRole === "employee") {
      const { value: confirmation } = await Swal.fire({
        title: "Ready to take the test?",
        text: "You need to complete a short assessment before applying",
        icon: "info",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Yes, start test!",
      });

      if (confirmation) {
        generateTest();
      }
    } else {
      Swal.fire("Unauthorized", "You need to be logged in as an employee to apply.", "error");
      navigate("/login", { state: { from: `/job/${id}` } });
    }
  };

  const TestModal = () => (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <h2 className="text-2xl font-bold mb-4">Skills Assessment Test</h2>
        
        {testQuestions.map((question, index) => (
          <div key={index} className="mb-6">
            <p className="font-medium mb-2">{index + 1}. {question.question}</p>
            <div className="space-y-2">
              {question.options.map((option, optIndex) => (
                <label key={optIndex} className="flex items-center space-x-2">
                  <input
                    type="radio"
                    name={`question-${index}`}
                    value={option}
                    onChange={() => handleAnswerSelect(index, option)}
                    checked={userAnswers[index] === option}
                    className="form-radio"
                  />
                  <span>{option}</span>
                </label>
              ))}
            </div>
          </div>
        ))}

        <div className="flex justify-end space-x-4 mt-6">
          <button
            onClick={() => setShowTest(false)}
            className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300"
          >
            Cancel
          </button>
          <button
            onClick={submitTest}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Submit Test
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <div className="container mx-auto px-4 py-0">
      <PageHeader title="Job Details" path="Job Details" />
      {isLoading ? (
        <div className="text-center py-6">
          <p>Loading job details...</p>
        </div>
      ) : job ? (
        <>
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
                  applied || isApplying || isGeneratingTest
                    ? "bg-gray-400 cursor-not-allowed"
                    : "bg-blue-600 hover:bg-blue-700"
                }`}
                disabled={applied || isApplying || isGeneratingTest}
                onClick={handleApply}
              >
                {isGeneratingTest
                  ? "Preparing Test..."
                  : isApplying
                  ? "Submitting..."
                  : applied
                  ? "Application Sent"
                  : "Apply Now"}
              </button>
            </div>
          </div>
          {showTest && <TestModal />}
        </>
      ) : (
        <div className="text-center py-6">
          <p>Job not found.</p>
        </div>
      )}
    </div>
  );
};

export default JobDetails;
