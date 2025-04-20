import { useEffect, useState } from "react";
import { create } from "zustand";
import { persist } from "zustand/middleware";
import axios from "axios";
import { baseURL } from "../../../oc.config";
import Swal from "sweetalert2";
 
export const useRawUser = create(
  persist(
    (set, get) => ({
      user: null,
      authToken: null,
      loading: false,
      isAuthanticated:false,
 
      getAuthHeader: () => ({
        headers: {
          Authorization: `Bearer ${localStorage.getItem("role")}`,
        },
      }),
      isLoggedIn: () => (get().authToken ? true : false),
 
      login: async (loginData, router) => {
        set(() => ({ loading: true }));
        try {
          const { data } = await axios.post(`${baseURL}user-login`, loginData);
          
          // Update the state with user information
          set(() => ({
            user: data.user,
            authToken: data.user.role, 
            isAuthenticated: true
          }));
          
          // Store the user's role in localStorage
          localStorage.setItem("role", data.user.role);
          
          router("/");
          
          if (data.user.role === 'employee') {
            Swal.fire("Success", "You are logged in successfully as an employee!", "success");
          } else if (data.user.role === 'recruiter') {
            Swal.fire("Success", "You are logged in successfully as a recruiter!", "success");
          } else {
            // Fallback message for other roles, if any
            Swal.fire("Success", "You are logged in successfully!", "success");
          }
        } catch (error) {
          Swal.fire("Error", error.response?.data?.message || "An unexpected error occurred.", "error");
          console.error(error);
        } finally {
          set(() => ({ loading: false }));
        }
      },
      
      logOut: async (router) => {
        set(() => ({ user: null, authToken: null }));
        localStorage.clear();
        sessionStorage.clear();
        router("/");
        Swal.fire("Success", "You are LogOut Successfully!", "success");
      },
 
      cleanUp: () => {
        set(() => ({ user: null }));
        localStorage.clear();
        sessionStorage.clear();
      },
    }),
    {
      name: "user",
      partialize: (state) => ({
        user: state.user,
        authToken: state.authToken,
        isAuthanticated:true
      }),
    }
  )
);
 
const useUser = () => {
  const result = useRawUser();
  const [zustate, setZustate] = useState({});
  useEffect(() => {
    setZustate(result);
  }, [result]);
 
  return zustate;
};
 
export default useUser;

