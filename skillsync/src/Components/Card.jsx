import React from "react";
import { Link } from "react-router-dom";
import { FiCalendar, FiClock, FiDollarSign, FiMapPin } from "react-icons/fi";

const Card = ({ data }) => {
  const {
    _id,
    companyName,
    companyLogo,
    jobTitle,
    minPrice,
    maxPrice,
    salaryType,
    jobLocation,
    employmentType,
    postingDate,
    description,
  } = data;
  
  return (
    <section className="card p-4 bg-white rounded shadow flex items-center space-x-4">
      <Link to={`/job/${_id}`} className="flex gap-4 flex-col sm:flex-row items-start">
        {/* Company Logo */}
        <div>
          <img
            src={companyLogo}
            alt={`${companyName} Logo`}
            className="w-[100px] h-[100px] object-cover border rounded"
          />
        </div>

        {/* Job Details */}
        <div>
          <h4 className="text-secondary mb-1">{companyName}</h4>
          <h3 className="text-lg font-semibold mb-2">{jobTitle}</h3>
          <div className="text-secondary/70 text-base flex flex-wrap gap-2 mb-2">
            <span className="flex items-center gap-2">
              <FiMapPin />
              {jobLocation}
            </span>
            <span className="flex items-center gap-2">
              <FiClock />
              {employmentType}
            </span>
            <span className="flex items-center gap-2">
              <FiDollarSign />
              {minPrice}-{maxPrice}K
            </span>
            <span className="flex items-center gap-2">
              <FiCalendar />
              {postingDate}
            </span>
          </div>

          <p className="text-base text-secondary/70">{description}</p>
        </div>
      </Link>
    </section>
  );
};

export default Card;
