import React, { useEffect, useState } from "react";
import useUser from "../Components/hooks/useUser";
import MyJobs from "./MyJobs";

const RecruiterDashboard = () => {
  const [userName, setuserName] = useState(""); // Add state to store the email

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user"));
    const Authanticated = user?.state?.isAuthanticated
    
    if (!Authanticated) {
      window.location.href = "/login";
      return;
    }
    console.log({user})
    const userName = user?.state?.user?.username;
    setuserName(userName); // Set the email in the state
  }, []);

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-semibold text-gray-700 mb-6">Welcome {userName}</h1>
      <MyJobs/>
    </div>
  );
};

export default RecruiterDashboard;
