import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import ApplicantsModal from '../Components/ApplicantsModal'; // Adjust the path if needed

const MyJobs = () => {
  const [jobs, setJobs] = useState([]);
  const [searchtext, setSearchText] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5; // Set to 5 to show 5 jobs per page
  const [applicants, setApplicants] = useState([]);
  // const [selectedJobId, setSelectedJobId] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false); // Modal state
  const [error, setError] = useState(null); // Error state

  // Fetch jobs when component mounts or search changes
  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user"))

    const userEmail = user?.state?.user?.email;
    setIsLoading(true);

    fetch(`http://localhost:3000/MyJobs/${userEmail}`)
      .then((res) => {
        if (!res.ok) {
          throw new Error("Failed to fetch jobs");
        }
        return res.json();
      })
      .then((data) => {
        setJobs(data);
        setIsLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching jobs:", error);
        setError("Failed to load jobs.");
        setIsLoading(false);
      });
  }, [searchtext]);

  // Search function to filter jobs
  const filteredJobs = jobs.filter(job =>
    job.jobTitle.toLowerCase().includes(searchtext.toLowerCase()) ||
    job.companyName.toLowerCase().includes(searchtext.toLowerCase())
  );

  // Pagination logic
  const indexOfLastJob = currentPage * itemsPerPage;
  const indexOfFirstJob = indexOfLastJob - itemsPerPage;
  const currentJobs = filteredJobs.slice(indexOfFirstJob, indexOfLastJob);

  const nextPage = () => {
    if (indexOfLastJob < filteredJobs.length) {
      setCurrentPage(currentPage + 1);
    }
  };

  const prevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  // Fetch applicants for a job
  const fetchApplicants = (jobId) => {
    // setSelectedJobId(jobId);
    fetch(`http://localhost:3000/applications/${jobId}`)
      .then((res) => {
        if (!res.ok) {
          throw new Error("Failed to fetch applicants.");
        }
        return res.json();
      })
      .then((data) => {
        setApplicants(data);
        setIsModalOpen(true); // Open the modal when applicants are fetched
      })
      .catch((error) => {
        console.error("Error fetching applicants:", error);
        setApplicants([]); // Ensure applicants is an empty array if no applicants
        setIsModalOpen(true); // Still open the modal even with no applicants
      });
  };

  // Handle delete job
  const handleDelete = (jobId) => {
    if (window.confirm("Are you sure you want to delete this job?")) {
      fetch(`http://localhost:3000/job/${jobId}`, {
        method: 'DELETE',
      })
        .then((res) => {
          if (!res.ok) {
            throw new Error("Failed to delete job");
          }
          setJobs((prevJobs) => prevJobs.filter((job) => job._id !== jobId));
        })
        .catch((error) => {
          console.error("Error deleting job:", error);
          alert("Failed to delete job.");
        });
    }
  };

  // Close modal
  const closeModal = () => {
    setIsModalOpen(false);
  };

  return (
    <div className="max-w-screen-xl container mx-auto px-4 py-8">
      <div className="my-jobs-container">
        <h1 className="text-center text-2xl font-bold mb-6">All My Jobs</h1>
        <div className="flex justify-center gap-4 mb-6">
          <input
            onChange={(e) => setSearchText(e.target.value)}
            type="text"
            name="search"
            id="search"
            placeholder="Search jobs..."
            className="py-2 px-4 border border-gray-300 rounded-lg focus:outline-none focus:ring focus:ring-blue-200 w-2/3"
          />
          <button
            className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition"
          >
            Search
          </button>
        </div>
      </div>

      {/* Job Table */}
      <section className="bg-gray-50 rounded-lg shadow-md p-6">
        {isLoading ? (
          <div className="text-center py-4">Loading...</div>
        ) : error ? (
          <div className="text-center py-4 text-red-600">{error}</div>
        ) : (
          <>
            <table className="w-full text-left border-collapse">
              <thead className="bg-gray-200">
                <tr>
                  <th className="py-2 px-4">No.</th>
                  <th className="py-2 px-4">Title</th>
                  <th className="py-2 px-4">Company Name</th>
                  <th className="py-2 px-4">Salary</th>
                  <th className="py-2 px-4">Actions</th>
                </tr>
              </thead>
              <tbody>
                {currentJobs.map((job, index) => (
                  <tr key={job._id} className="border-b hover:bg-gray-100 transition">
                    <td className="py-2 px-4">{index + 1}</td>
                    <td className="py-2 px-4">{job.jobTitle}</td>
                    <td className="py-2 px-4">{job.companyName}</td>
                    <td className="py-2 px-4">
                      ${job.minPrice} - ${job.maxPrice}
                    </td>
                    <td className="py-2 px-4 space-x-4">
                      <button
                        onClick={() => fetchApplicants(job._id)}
                        className="bg-green-500 text-white px-4 py-1 rounded hover:bg-green-600 transition"
                      >
                        View Applicants
                      </button>
                      <Link
                        to={`/edit-job/${job._id}`}
                        className="bg-yellow-500 text-white px-4 py-1 rounded hover:bg-yellow-600 transition"
                      >
                        Edit
                      </Link>
                      <button
                        onClick={() => handleDelete(job._id)}
                        className="bg-red-600 text-white px-4 py-1 rounded hover:bg-red-700 transition"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {/* Pagination */}
            <div className="flex justify-center mt-6 space-x-4">
              {currentPage > 1 && (
                <button
                  onClick={prevPage}
                  className="px-4 py-2 bg-gray-300 text-gray-800 rounded-lg hover:bg-gray-400 transition"
                >
                  Previous
                </button>
              )}
              {indexOfLastJob < filteredJobs.length && (
                <button
                  onClick={nextPage}
                  className="px-4 py-2 bg-gray-300 text-gray-800 rounded-lg hover:bg-gray-400 transition"
                >
                  Next
                </button>
              )}
            </div>
          </>
        )}
      </section>

      {/* Show Applicants Modal */}
      {isModalOpen && (
        <ApplicantsModal
          applicants={applicants}
          closeModal={closeModal}
        />
      )}
    </div>
  );
};

export default MyJobs;
