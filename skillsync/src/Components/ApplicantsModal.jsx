import React, { useState } from "react";
import { Worker, Viewer } from "@react-pdf-viewer/core";
import "@react-pdf-viewer/core/lib/styles/index.css";
import "@react-pdf-viewer/default-layout/lib/styles/index.css";

const ApplicantsModal = ({ applicants, closeModal }) => {
  const BASE_URL = "http://localhost:3000";

  console.log('applicants',applicants)
  const [selectedResume, setSelectedResume] = useState(null); // State to hold selected resume

  const handleViewResume = (resumeUrl) => {
    const fullUrl = `${BASE_URL}${resumeUrl}`; // Append backend URL
    setSelectedResume(fullUrl);
  };

  const closeResumeViewer = () => {
    setSelectedResume(null); // Close the PDF viewer
  };

  return (
    <div className="fixed inset-0 bg-gray-800 bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-white w-1/3 max-w-lg p-6 rounded-lg shadow-lg">
        {/* Header Section */}
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold text-gray-700">Applicants</h2>
          <button
            onClick={closeModal}
            className="text-gray-500 hover:text-red-600 transition duration-200"
          >
            ✖
          </button>
        </div>

        {/* Content Section */}
        <div className="max-h-60 overflow-y-auto">
          {applicants.length === 0 ? (
            <p className="text-gray-500 text-center">
              No applicants available for this job.
            </p>
          ) : (
            <ul className="divide-y divide-gray-200">
              {applicants.map((applicant) => (
                <li
                  key={applicant.id}
                  className="flex justify-between py-3 items-center hover:bg-gray-100 px-2 rounded"
                >
                  <div>
                    <p className="text-gray-800 font-medium">{applicant.user.username}</p>
                    <p className="text-sm text-gray-500">{applicant.email}</p>
                    <p className="text-sm text-gray-500">{new Date(applicant.appliedAt).toLocaleDateString()}</p>
                    {/* <p className="text-sm text-gray-500">{applicant.email}</p> */}
                  </div>
                  <button
                    className="bg-blue-500 text-white px-4 py-1 rounded hover:bg-blue-600 transition"
                    onClick={() => handleViewResume(applicant.resumePath)}
                  >
                    View Resume
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Footer Section */}
        <div className="mt-4 flex justify-end">
          <button
            onClick={closeModal}
            className="bg-gray-300 text-gray-800 px-4 py-2 rounded hover:bg-gray-400 transition"
          >
            Close
          </button>
        </div>
      </div>

      {/* PDF Viewer Modal */}
      {selectedResume && (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex justify-center items-center z-50">
          <div className="bg-white w-3/4 h-3/4 p-4 rounded-lg shadow-lg flex flex-col">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold text-gray-700">Resume Viewer</h2>
              <button
                onClick={closeResumeViewer}
                className="text-gray-500 hover:text-red-600 transition duration-200"
              >
                ✖
              </button>
            </div>
            <div className="flex-grow overflow-auto">
              <Worker workerUrl="https://unpkg.com/pdfjs-dist@3.11.174/build/pdf.worker.min.js">
                <Viewer fileUrl={selectedResume} />
              </Worker>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ApplicantsModal;
