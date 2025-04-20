import React, { useState, useEffect } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { FaBarsStaggered, FaXmark } from "react-icons/fa6";
import { FaUserCircle } from "react-icons/fa";
import useUser from "./hooks/useUser";
import Swal from "sweetalert2";

function Navbar() {
  const { user, logOut, isLoggedIn } = useUser();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const navigate = useNavigate();
  const [userRole, setUserRole] = useState(null);
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
  const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  // Handle menu toggler
  const handleMenuToggler = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  // Handle profile menu toggle
  const handleProfileToggle = () => {
    setIsProfileOpen(!isProfileOpen);
  };

  // Check for user role and login status
  useEffect(() => {
    const role = user?.role;
    setUserRole(role);
  }, [user]);

  // Navigation items for employees and recruiters
  const navItemsEmployee = [
    { path: "/", title: "Start a Search" },
    { path: "/salary", title: "Salary Estimate" },
    { path: "/employee-dashboard", title: "Employee Dashboard" },
  ];

  const navItemsRecruiter = [
    { path: "/", title: "Start a Search" },
    { path: "/recruiter-dashboard", title: "Dashboard" },
    { path: "/post-job", title: "Post a Job" },
  ];

  const navItemsGuest = [
    { path: "/", title: "Start a Search" },
    { path: "/salary", title: "Salary Estimate" },
  ];

  // Determine which nav items to show based on user role
  const navItems = user
    ? userRole === "employee"
      ? navItemsEmployee
      : navItemsRecruiter
    : navItemsGuest;

  // Handle password change
  const handlePasswordChange = async (e) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      Swal.fire({
        icon: 'error',
        title: 'Passwords do not match!',
        text: 'Please make sure both passwords are the same.'
      });
      return;
    }
    
    try {
      const response = await fetch("http://localhost:3000/change-password", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: user.email,
          newPassword: newPassword
        }),
      });
      
      const data = await response.json();
      
      if (response.ok) {
        Swal.fire({
          icon: 'success',
          title: 'Success!',
          text: 'Password changed successfully!'
        });
        setIsPasswordModalOpen(false);
        setNewPassword("");
        setConfirmPassword("");
      } else {
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: data.message || 'Failed to change password. Please try again.'
        });
      }
    } catch (error) {
      console.error("Error changing password:", error);
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'An error occurred. Please try again.'
      });
    }
  };

  return (
    <>
      <header className="bg-white shadow-md relative">
        <nav className="flex items-center justify-between p-4 max-w-7xl mx-auto">
          {/* Logo */}
          <a href="/" className="flex items-center gap-2 text-3xl">
            <img
              className="max-w-[30px] max-h-[100px]"
              src="/images/Logo/SS.png"
              alt="SkillSync Logo"
            />
            <span className="text-lg font-semibold text-secondary">SkillSync</span>
          </a>

          {/* Desktop Navigation */}
          <ul className="hidden md:flex gap-12">
            {navItems.map(({ path, title }) => (
              <li key={path} className="text-base text-primary">
                <NavLink
                  to={path}
                  className={({ isActive }) => (isActive ? "active" : "")}
                >
                  {title}
                </NavLink>
              </li>
            ))}
          </ul>

          {/* Login/Profile Section */}
          <div className="hidden md:block">
            {isLoggedIn && isLoggedIn() ? (
              <div className="relative">
                <button
                  onClick={handleProfileToggle}
                  className="flex items-center gap-2 py-2 px-3 border rounded-md hover:bg-gray-50"
                >
                  <FaUserCircle className="text-xl text-gray-600" />
                  <span className="text-gray-700">{user?.username} (R)</span>
                </button>

                {/* Profile Dropdown - Fixed positioning and styling */}
                {isProfileOpen && (
                  <div className="absolute right-0 mt-2 w-80 bg-white rounded-lg shadow-lg py-2 z-50">
                    {/* Header Section */}
                    <div className="px-4 py-3 border-b border-gray-100">
                      <div className="flex items-center gap-3">
                        <FaUserCircle className="text-3xl text-gray-600" />
                        <div>
                          <h3 className="text-base font-medium text-gray-900">
                            {user?.username} (R)
                          </h3>
                          <p className="text-sm text-gray-500">
                            {user?.email}
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Menu Items */}
                    <div className="py-1">
                      <button
                        onClick={() => {
                          setIsProfileModalOpen(true);
                          setIsProfileOpen(false);
                        }}
                        className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                      >
                        View Profile
                      </button>
                      <button
                        onClick={() => {
                          setIsPasswordModalOpen(true);
                          setIsProfileOpen(false);
                        }}
                        className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                      >
                        Change Password
                      </button>
                      <div className="border-t border-gray-100 my-1"></div>
                      <button
                        onClick={() => logOut(navigate)}
                        className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-50"
                      >
                        Logout
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="space-x-5">
                <Link to="/login" className="py-2 px-5 border rounded">
                  Login
                </Link>
                <Link
                  to="/signup"
                  className="py-2 px-5 border rounded bg-primary text-white"
                >
                  Signup
                </Link>
              </div>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden block">
            <button onClick={handleMenuToggler}>
              {isMenuOpen ? (
                <FaXmark className="w-5 h-5 text-primary" />
              ) : (
                <FaBarsStaggered className="w-5 h-5 text-primary" />
              )}
            </button>
          </div>

          {/* Mobile Menu */}
          {isMenuOpen && (
            <ul className="absolute top-16 left-0 w-full bg-white shadow-lg text-black flex flex-col items-start p-6 gap-4 md:hidden z-50">
              {navItems.map(({ path, title }) => (
                <li key={path} className="text-base w-full">
                  <NavLink
                    to={path}
                    className={({ isActive }) =>
                      isActive
                        ? "active"
                        : "block py-2 px-4 rounded hover:bg-gray-200"
                    }
                    onClick={() => setIsMenuOpen(false)}
                  >
                    {title}
                  </NavLink>
                </li>
              ))}
              {isLoggedIn && isLoggedIn() ? (
                <>
                  <li className="w-full">
                    <button
                      onClick={() => {
                        setIsProfileModalOpen(true);
                        setIsMenuOpen(false);
                      }}
                      className="block w-full text-left py-2 px-4 rounded hover:bg-gray-200"
                    >
                      Profile
                    </button>
                  </li>
                  <li className="w-full">
                    <button
                      onClick={() => {
                        setIsPasswordModalOpen(true);
                        setIsMenuOpen(false);
                      }}
                      className="block w-full text-left py-2 px-4 rounded hover:bg-gray-200"
                    >
                      Change Password
                    </button>
                  </li>
                  <li className="w-full">
                    <button
                      onClick={() => {
                        logOut(navigate);
                        setIsMenuOpen(false);
                      }}
                      className="w-full text-left py-2 px-4 rounded text-red-600 hover:bg-gray-200"
                    >
                      Logout
                    </button>
                  </li>
                </>
              ) : (
                <>
                  <li className="w-full">
                    <Link
                      to="/login"
                      className="block py-2 px-4 border rounded hover:bg-gray-200"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      Login
                    </Link>
                  </li>
                  <li className="w-full">
                    <Link
                      to="/signup"
                      className="block py-2 px-4 border rounded bg-secondary text-white hover:bg-secondary-dark"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      Signup
                    </Link>
                  </li>
                </>
              )}
            </ul>
          )}
        </nav>
      </header>

      {/* Profile Modal */}
      {isProfileModalOpen && (
        <div className="fixed inset-0 bg-gray-800 bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white w-96 p-6 rounded-lg shadow-lg">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold text-gray-700">Profile Details</h2>
              <button
                onClick={() => setIsProfileModalOpen(false)}
                className="text-gray-500 hover:text-red-600 transition duration-200"
              >
                ✖
              </button>
            </div>
            <div className="space-y-4">
              <div className="flex items-center justify-center mb-4">
                <FaUserCircle className="text-6xl text-gray-600" />
              </div>
              <div>
                <p className="text-sm text-gray-500">Username</p>
                <p className="text-lg font-medium">{user?.username}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Email</p>
                <p className="text-lg font-medium">{user?.email}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Role</p>
                <p className="text-lg font-medium capitalize">{user?.role}</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Change Password Modal */}
      {isPasswordModalOpen && (
        <div className="fixed inset-0 bg-gray-800 bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white w-96 p-6 rounded-lg shadow-lg">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold text-gray-700">Change Password</h2>
              <button
                onClick={() => setIsPasswordModalOpen(false)}
                className="text-gray-500 hover:text-red-600 transition duration-200"
              >
                ✖
              </button>
            </div>
            <form onSubmit={handlePasswordChange} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  New Password
                </label>
                <input
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 focus:border-secondary focus:outline-none focus:ring-1 focus:ring-secondary"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Confirm Password
                </label>
                <input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 focus:border-secondary focus:outline-none focus:ring-1 focus:ring-secondary"
                  required
                />
              </div>
              <div className="flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => setIsPasswordModalOpen(false)}
                  className="px-4 py-2 border rounded text-gray-600 hover:bg-gray-100"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-secondary text-white rounded hover:bg-secondary-dark"
                >
                  Change Password
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}

export default Navbar;
