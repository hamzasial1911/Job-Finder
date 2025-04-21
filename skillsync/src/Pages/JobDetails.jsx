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
          jobId: id,
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
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to evaluate test');
      }

      const result = await response.json();
      setTestScore(result.score);
      
      // Helper function to format improvement areas
      const formatImprovementAreas = (areas) => {
        return areas.map(area => `
          <div class="mb-4">
            <p class="font-semibold text-gray-700">${area.area}</p>
            <ul class="list-disc pl-5 text-gray-600">
              ${area.suggestions.map(suggestion => `
                <li>${suggestion}</li>
              `).join('')}
            </ul>
          </div>
        `).join('');
      };

      if (result.passed) {
        Swal.fire({
          title: 'Congratulations! Test Passed',
          html: `
            <div class="text-left">
              <p class="text-lg font-semibold mb-3">Score: ${result.score}%</p>
              <p class="mb-4">${result.encouragingMessage}</p>
              ${result.improvementAreas.length > 0 ? `
                <div class="mt-4">
                  <p class="font-semibold mb-2">Areas for Further Growth:</p>
                  ${formatImprovementAreas(result.improvementAreas)}
                </div>
              ` : ''}
              <p class="mt-4 text-blue-600">Please proceed to upload your resume.</p>
            </div>
          `,
          icon: 'success',
          width: 600,
          confirmButtonText: 'Upload Resume'
        }).then(() => {
          handleResumeUpload();
        });
      } else {
        Swal.fire({
          title: 'Test Not Passed',
          html: `
            <div class="text-left">
              <p class="text-lg font-semibold mb-3">Score: ${result.score}%</p>
              <p class="mb-4">${result.encouragingMessage}</p>
              <div class="mt-4">
                <p class="font-semibold mb-2">Areas to Focus On:</p>
                ${formatImprovementAreas(result.improvementAreas)}
              </div>
              <p class="mt-4 text-gray-600">
                We encourage you to focus on these areas and try again in the future.
                The minimum required score is 70%.
              </p>
            </div>
          `,
          icon: 'error',
          width: 600
        });
      }
    } catch (error) {
      console.error('Error submitting test:', error);
      Swal.fire('Error', error.message || 'Failed to submit test', 'error');
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
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg p-8 max-w-3xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header Section */}
        <div className="border-b pb-4 mb-6">
          <h2 className="text-2xl font-bold text-gray-800">Skills Assessment Test</h2>
          <p className="text-gray-600 mt-2">Please answer all questions to proceed with your application.</p>
        </div>

        {/* Questions Section */}
        <div className="space-y-8">
          {testQuestions.map((question, index) => (
            <div key={index} className="bg-gray-50 rounded-lg p-6">
              <div className="flex items-start mb-4">
                <span className="bg-blue-600 text-white rounded-full w-8 h-8 flex items-center justify-center flex-shrink-0 mr-3">
                  {index + 1}
                </span>
                <p className="font-medium text-gray-800 text-lg">{question.question}</p>
              </div>
              
              <div className="ml-11 space-y-3">
                {question.options.map((option, optIndex) => (
                  <label 
                    key={optIndex} 
                    className={`flex items-center p-3 rounded-lg border transition-all cursor-pointer
                      ${userAnswers[index] === option 
                        ? 'border-blue-500 bg-blue-50' 
                        : 'border-gray-200 hover:border-blue-200 hover:bg-gray-50'}`}
                  >
                    <input
                      type="radio"
                      name={`question-${index}`}
                      value={option}
                      onChange={() => handleAnswerSelect(index, option)}
                      checked={userAnswers[index] === option}
                      className="form-radio h-4 w-4 text-blue-600 focus:ring-blue-500"
                    />
                    <span className="ml-3 text-gray-700">{option}</span>
                  </label>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Progress Indicator */}
        <div className="mt-6 mb-4">
          <div className="flex justify-between text-sm text-gray-600 mb-2">
            <span>Progress</span>
            <span>{Object.keys(userAnswers).length} of {testQuestions.length} answered</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div 
              className="bg-blue-600 h-2 rounded-full transition-all duration-300"
              style={{ width: `${(Object.keys(userAnswers).length / testQuestions.length) * 100}%` }}
            ></div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="border-t pt-6 mt-6 flex justify-between items-center">
          <button
            onClick={() => setShowTest(false)}
            className="px-6 py-2.5 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
          >
            Cancel Test
          </button>
          <div className="flex items-center gap-4">
            <span className="text-sm text-gray-500">
              {Object.keys(userAnswers).length === testQuestions.length ? 
                "All questions answered!" : 
                "Please answer all questions"}
            </span>
            <button
              onClick={submitTest}
              disabled={Object.keys(userAnswers).length !== testQuestions.length}
              className={`px-6 py-2.5 rounded-lg text-white font-medium transition-all
                ${Object.keys(userAnswers).length === testQuestions.length
                  ? 'bg-blue-600 hover:bg-blue-700'
                  : 'bg-gray-400 cursor-not-allowed'}`}
            >
              Submit Test
            </button>
          </div>
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
