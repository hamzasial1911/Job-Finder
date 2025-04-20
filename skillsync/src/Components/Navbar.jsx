import React, { useState, useEffect } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { FaBarsStaggered, FaXmark } from "react-icons/fa6";
import { FaUserCircle } from "react-icons/fa";
import useUser from "./hooks/useUser";

function Navbar() {
  const { user, logOut, isLoggedIn } = useUser();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const navigate = useNavigate();
  const [userRole, setUserRole] = useState(null);

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

  return (
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
                    <Link
                      to="/profile"
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                    >
                      View Profile
                    </Link>
                    <Link
                      to="/change-password"
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                    >
                      Change Password
                    </Link>
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
                  <Link
                    to="/profile"
                    className="block py-2 px-4 rounded hover:bg-gray-200"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Profile
                  </Link>
                </li>
                <li className="w-full">
                  <Link
                    to="/change-password"
                    className="block py-2 px-4 rounded hover:bg-gray-200"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Change Password
                  </Link>
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
  );
}

export default Navbar;
