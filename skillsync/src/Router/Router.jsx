import { createBrowserRouter } from "react-router-dom";
import App from "../App";
import Home from "../Pages/Home";
import CreateJob from "../Pages/CreateJob";
import MyJobs from "../Pages/MyJobs";
import SalaryPage from "../Pages/SalaryPage";
import UpdateJob from "../Pages/UpdateJob";
import Login from "../Components/Login";
import JobDetails from "../Pages/JobDetails";
import SignUp from "../Components/SignUp";
import ProtectedRoute from "./ProtectedRoute";
import RecruiterDashboard from "../Pages/RecruiterDashboard";
import EmployeeDashboard from "../Pages/EmployeeDashboard"; // Import EmployeeDashboard

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      { path: "/", element: <Home /> },
      { path: "/login", element: <Login /> },
      { path: "/signup", element: <SignUp /> },
      { path: "/job/:id", element: <JobDetails /> },

      // Protected Routes with role-based access
      {
        path: "/post-job",
        element: (
          <ProtectedRoute allowedRoles={["recruiter"]}>
            <CreateJob />
          </ProtectedRoute>
        ),
      },
      {
        path: "/my-jobs",
        element: (
          <ProtectedRoute allowedRoles={["employee"]}>
            <MyJobs />
          </ProtectedRoute>
        ),
      },
      {
        path: "/employee-dashboard",
        element: (
          <ProtectedRoute allowedRoles={["employee"]}>
            <EmployeeDashboard />
          </ProtectedRoute>
        ),
      },
      {
        path: "/salary",
        element: (
            <SalaryPage />
          
        ),
      },
      {
        path: "/recruiter-dashboard",
        element: (
          <ProtectedRoute allowedRoles={["recruiter"]}>
            <RecruiterDashboard />
          </ProtectedRoute>
        ),
      },
      {
        path: "edit-job/:id",
        element: (
          <ProtectedRoute allowedRoles={["recruiter"]}>
            <UpdateJob />
          </ProtectedRoute>
        ),
        loader: ({ params }) =>
          fetch(`http://localhost:3000/all-jobs/${params.id}`),
      },
    ],
  },
]);

export default router;



// // Router.jsx
// import { createBrowserRouter } from "react-router-dom";
// import App from "../App";
// import Home from "../Pages/Home";
// import CreateJob from "../Pages/CreateJob";
// import MyJobs from "../Pages/MyJobs";
// import SalaryPage from "../Pages/SalaryPage";
// import UpdateJob from "../Pages/UpdateJob";
// import Login from "../Components/Login";
// import JobDetails from "../Pages/JobDetails";
// import SignUp from "../Components/SignUp";


// const router = createBrowserRouter([
//   {
//     path: "/",
//     element: <App />,
//     children: [
//       { path: "/", element: <Home /> },
//       { path: "/post-job", element: <CreateJob /> },
//       { path: "/my-job", element: <MyJobs /> },
//       { path: "/salary", element: <SalaryPage /> },
//       {path: "edit-job/:id", element:<UpdateJob/>, loader: ({params}) => fetch(`http://localhost:3000/all-jobs/${params.id}`)},
//       {path: "/login", element: <Login/>},
//       {path: "/signup", element: <SignUp/>},
//       {path: "/job/:id", element: <JobDetails/>}

//     ],
//   },
// ]);

// export default router;
