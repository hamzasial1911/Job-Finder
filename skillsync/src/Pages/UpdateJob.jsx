import { Navigate, useLoaderData, useParams } from "react-router-dom";
import { useForm } from "react-hook-form";
import CreatableSelect from "react-select/creatable";
import React, { useState } from "react";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";



const UpdateJob = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const {
    jobTitle,
    companyName,
    minPrice,
    maxPrice,
    salaryType,
    jobLocation,
    postingDate,
    experienceLevel,
    companyLogo,
    employmentType,
    description,
    postedby,
    skills,
  } = useLoaderData();
  const [logoUrl, setLogoUrl] = useState("");
  const [selectedOption, setSelectedOption] = useState(null);
  const {
    register,
    handleSubmit, reset,
    formState: { errors },
  } = useForm();

  const onSubmit = (data) => {
    // Validation for required fields
    if (
      !data.jobTitle || 
      !data.description || 
      !data.jobLocation || 
      !data.companyName || 
      !data.minPrice || 
      !data.maxPrice || 
      !data.salaryType || 
      !data.experienceLevel || 
      !data.postingDate
    ) {
      Swal.fire("Error", "Please fill all the fields", "error");
      return;
    }
    
    data.skills = selectedOption; // Add selected skills
    
    fetch(`http://localhost:3000/update-job/${id}`, {
      method: "PATCH",
      headers: { "content-type": "application/json" },
      body: JSON.stringify(data),
    })
      .then((res) => res.json())
      .then((result) => {
        if (result.acknowledged === true) {
          Swal.fire("Success", "Job Updated Successfully!", "success");
          navigate('/recruiter-dashboard');
        }
        reset();
        setSelectedOption(null);
        setLogoUrl("");
      });
  };
  

  const options = [
    { value: "JavaScript", label: "JavaScript" },
    { value: "C++", label: "C++" },
    { value: "HTML", label: "HTML" },
    { value: "CSS", label: "CSS" },
    { value: "React", label: "React" },
    { value: "Node", label: "Node" },
    { value: "MongoDB", label: "MongoDB" },
    { value: "Redux", label: "Redux" },
  ];

  return (
    <div className="max-w-screen-2x1 container mx-auto x1:px-24 px-4 mt-4">
      {/* Form */}
      <div className="bg-[#FAFAFA] py-10 px-4 lg:px-16">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
          {/* First Row */}
          <div className="create-job-flex">
            <div className="lg:w-1/2 w-full">
              <label className="block mb-2 text-lg">Job Title</label>
              <input
                type="text"
                defaultValue={jobTitle}
                {...register("jobTitle")}
                className="create-job-input"
              />
            </div>
            <div className="lg:w-1/2 w-full">
              <label className="block mb-2 text-lg">Company Name</label>
              <input
                type="text"
                defaultValue={companyName}
                placeholder="Ex: Microsoft"
                {...register("companyName")}
                className="create-job-input"
              />
            </div>
          </div>

          {/* Second Row */}
          <div className="create-job-flex">
            <div className="lg:w-1/2 w-full">
              <label className="block mb-2 text-lg">Minimun Salary</label>
              <input
                type="text"
                defaultValue={minPrice}
                placeholder="$20K"
                {...register("minPrice")}
                className="create-job-input"
              />
            </div>
            <div className="lg:w-1/2 w-full">
              <label className="block mb-2 text-lg">Maximum Salary</label>
              <input
                type="text"
                defaultValue={maxPrice}
                placeholder="$120K"
                {...register("maxPrice")}
                className="create-job-input"
              />
            </div>
          </div>

          {/* Third Row */}
          <div className="create-job-flex">
            <div className="lg:w-1/2 w-full">
              <label className="block mb-2 text-lg">Salary Type</label>
              <select {...register("salaryType")} className="create-job-input">
                <option value={salaryType}>"{salaryType}</option>
                <option className="hover:bg-primary" value="Hourly">
                  Hourly
                </option>
                <option value="Monthly">Monthly</option>
                <option value="Yearly">Yearly</option>
              </select>
            </div>
            <div className="lg:w-1/2 w-full">
              <label className="block mb-2 text-lg">Job Location</label>
              <input
                type="text"
                defaultValue={jobLocation}
                placeholder="Ex: London"
                {...register("jobLocation")}
                className="create-job-input"
              />
            </div>
          </div>

          {/* Fourth Row */}
          <div className="create-job-flex">
            <div className="lg:w-1/2 w-full">
              <label className="block mb-2 text-lg">Job Posting Date</label>
              <input
                type="date"
                defaultValue={postingDate}
                placeholder="2024-11-03"
                {...register("postingDate")}
                className="create-job-input"
              />
            </div>
            <div className="lg:w-1/2 w-full">
              <label className="block mb-2 text-lg">Experience Level</label>
              <select
                {...register("experienceLevel")}
                className="create-job-input"
              >
                <option value={experienceLevel}>{experienceLevel}</option>
                <option value="No experience">No Experience</option>
                <option value="Intership">Intership</option>
                <option value="Work remotely">Work remotely</option>
              </select>
            </div>
          </div>

          {/* Fifth Row */}
          <div>
            <label className="block mb-2 text-lg">Required Skill Set:</label>
            <CreatableSelect
              defaultValue={skills}
              onChange={setSelectedOption}
              options={options}
              isMulti
              className="create-job-input py-4"
            />
          </div>
          {/* Sixth Row */}
          <div className="create-job-flex logoCompany">
            <div className="lg:w-1/2 w-full">
              <label className="block mb-2 text-lg">Company Logo</label>
              <input
                type="url"
                defaultValue={companyLogo}
                placeholder="Paste your Company Logo URL: https://weshare.com/img1"
                {...register("companyLogo")}
                className="create-job-input"
                onChange={(e) => setLogoUrl(e.target.value)} // Update logo URL state dynamically
              />
              {/* Logo Preview */}
              {logoUrl && (
                <div className="mt-2">
                  <img
                    src={logoUrl}
                    alt="Company Logo Preview"
                    className="w-[150px] h-[150px] object-cover border rounded"
                  />
                </div>
              )}
            </div>
            <div className="lg:w-1/2 w-full">
              <label className="block mb-2 text-lg">Employment Type</label>
              <select
                {...register("employmentType")}
                className="create-job-input"
              >
                <option value={employmentType}>{employmentType}</option>
                <option value="Full-time">Full Time</option>
                <option value="Part-time">Part Time</option>
                <option value="Temporary">Temporary</option>
              </select>
            </div>
          </div>

          {/* Seventh Row */}
          <div className="w-full ">
            <label className="block mb-2 text-lg">Job Description</label>
            <textarea
            defaultValue={description}
              className="w-full pl-3 py-1.5 focus:outline-none placeholder:text-gray-700"
              rows={6}
              placeholder="Job Description"
              {...register("description")}
            />
          </div>

          {/* Last Row */}
          <div className="w-full">
            <label className="block mb-2 text-lg">Job Posted By</label>
            <input
              type="email"
              defaultValue={postedby}
              placeholder="example@gmail.com"
              {...register("postedby")}
              className="create-job-input"
            />
          </div>
          <input
            type="submit"
            className="block mt-12 bg-secondary text-white font-semibold px-8 py-2 rounded-sm cursor-pointer"
            style={{ width: "150px" }}
          />
        </form>
      </div>
    </div>
  );
};

export default UpdateJob;
