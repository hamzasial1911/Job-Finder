import React, { useEffect, useState } from "react";

const EmployeeDashboard = () => {
  const [appliedJobs, setAppliedJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchAppliedJobs = async () => {
    try {
      const user = JSON.parse(localStorage.getItem("user"));
      const userEmail = user?.state?.user?.email;
      const Authanticated = user?.state?.isAuthanticated
      if (!Authanticated) {
        setError("User not logged in.");
        setLoading(false);
        return;
      }

      const response = await fetch(`http://localhost:3000/my-applications/${userEmail}`);
      const data = await response.json();

      if (response.ok) {
        setAppliedJobs(data);
      } else {
        setError(data.message || "Failed to fetch applications.");
      }
    } catch (err) {
      setError("An error occurred while fetching applications.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAppliedJobs();
  }, []);

  if (loading) {
    return <div className="text-center">Loading...</div>;
  }

  if (error) {
    return <div className="text-center text-red-500">{error}</div>;
  }

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <h1 className="text-2xl font-bold mb-6">My Applied Jobs</h1>
      {appliedJobs.length === 0 ? (
        <p className="text-center">No jobs found.</p>
      ) : (
        <table className="min-w-full bg-white shadow rounded-lg">
          <thead>
            <tr className="bg-gray-200">
              <th className="py-3 px-4 text-left text-gray-600 font-medium">Job Title</th>
              <th className="py-3 px-4 text-left text-gray-600 font-medium">Company</th>
              <th className="py-3 px-4 text-left text-gray-600 font-medium">Posted By</th>
              <th className="py-3 px-4 text-left text-gray-600 font-medium">Applied At</th>
            </tr>
          </thead>
          <tbody>
            {appliedJobs.map((application) => (
              <tr key={application._id} className="border-b">
                <td className="py-3 px-4">{application.jobDetails?.title || "N/A"}</td>
                <td className="py-3 px-4">{application.jobDetails?.company || "N/A"}</td>
                <td className="py-3 px-4">{application.jobDetails?.postedBy || "N/A"}</td>
                <td className="py-3 px-4">{new Date(application.appliedAt).toLocaleDateString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default EmployeeDashboard;
