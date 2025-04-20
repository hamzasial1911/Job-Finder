import React, { useEffect, useState } from "react";
import Banner from "../Components/Banner";
import Jobs from "./Jobs";
import Sidebar from "../sidebar/Sidebar";
import Newsletter from "../Components/Newsletter";

const Home = () => {
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [jobs, setJobs] = useState([]);
  const [query, setQuery] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 4;

  useEffect(() => {
    setIsLoading(true);
    fetch("http://localhost:3000/all-jobs")
      .then((res) => {
        if (!res.ok) {
          throw new Error(`HTTP error! status: ${res.status}`);
        }
        return res.json();
      })
      .then((data) => {
        // console.log(data);
        setJobs(data);
        setIsLoading(false);
      })
      .catch((error) => console.error("Error fetching jobs:", error));
  }, []);

  const handleInputChange = (event) => {
    setQuery(event.target.value);
  };

  const handleChange = (event) => {
    setSelectedCategory(event.target.value);
  };

  const handleClick = (value) => {
    setSelectedCategory(value);
  };

  const calculatePageRange = () => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    return { startIndex, endIndex };
  };

  const nextPage = () => {
    if (currentPage < Math.ceil(filteredItems.length / itemsPerPage)) {
      setCurrentPage(currentPage + 1);
    }
  };

  const prevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const filteredItems = jobs.filter(
    (job) => job.jobTitle.toLowerCase().indexOf(query.toLowerCase()) !== -1
  );

  const isValidDate = (dateString) => {
    const date = new Date(dateString);
    return !isNaN(date);
  };

  const filteredData = (jobs, selected, query) => {
    let filteredJobs = jobs.filter((job) =>
      job.jobTitle.toLowerCase().includes(query.toLowerCase())
    );

    if (selected && selected !== "all") {
      filteredJobs = filteredJobs.filter((job) => {
        const {
          jobLocation,
          maxPrice,
          experienceLevel,
          salaryType,
          employmentType,
          postingDate,
        } = job;

        let matches = false;

        if (isValidDate(selected)) {
          const selectedDate = new Date(selected);
          const jobPostingDate = new Date(postingDate);
          matches = jobPostingDate >= selectedDate;
        } else {
          matches =
            jobLocation.toLowerCase() === selected.toLowerCase() ||
            parseInt(maxPrice) <= parseInt(selected) ||
            salaryType.toLowerCase() === selected.toLowerCase() ||
            experienceLevel.toLowerCase() === selected.toLowerCase() ||
            employmentType.toLowerCase() === selected.toLowerCase();
        }

        return matches;
      });
      console.log(filteredJobs);
    }

    const { startIndex, endIndex } = calculatePageRange();
    filteredJobs = filteredJobs.slice(startIndex, endIndex);

    return filteredJobs;
  };

  const result = filteredData(jobs, selectedCategory, query);
  // console.log("Result:", result);

  return (
    <div>
      <Banner query={query} handleInputChange={handleInputChange} />
      <div className="bg-[#FAFAFA] container mx-auto px-4 py-12">
        <div className="md:grid md:grid-cols-4 gap-8">
          <div className="bg-white p-4 rounded shadow-md md:col-span-1">
            <Sidebar handleChange={handleChange} handleClick={handleClick} />
          </div>
          <div className="col-span-2 bg-white p-4 rounded shadow-md">
            {isLoading ? (
              <p className="text-center text-lg font-medium">Loading....</p>
            ) : result.length > 0 ? (
              <Jobs result={result} />
            ) : (
              <>
                <h3 className="text-lg font-bold mb-2">{result.length} Jobs</h3>
                <p className="text-center">No Data Found</p>
              </>
            )}
            {result.length > 0 && (
              <div className="flex justify-center mt-4 space-x-8">
                <button
                  onClick={prevPage}
                  disabled={currentPage === 1}
                  className="text-sm text-gray-600 hover:underline disabled:text-gray-300"
                >
                  Previous
                </button>
                <span className="mx-2 text-sm">
                  Page {currentPage} of{" "}
                  {Math.ceil(filteredItems.length / itemsPerPage)}
                </span>
                <button
                  onClick={nextPage}
                  disabled={
                    currentPage ===
                    Math.ceil(filteredItems.length / itemsPerPage)
                  }
                  className="text-sm text-gray-600 hover:underline disabled:text-gray-300"
                >
                  Next
                </button>
              </div>
            )}
          </div>
          <div className="bg-white p-4 rounded shadow-md">
            <Newsletter />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
