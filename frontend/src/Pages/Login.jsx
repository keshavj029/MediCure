import React, { useContext, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { AuthContext } from "../Context/AuthContext";

const Login = () => {
  const history = useNavigate();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    role: "patient"
  });
  const { login } = useContext(AuthContext);
  const [isLoading, setIsLoading] = useState(false);
  // console.log("login", login);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    // console.log("handleInputChange", name, value);
    setFormData({ ...formData, [name]: value });
  };

  const handleRoleChange = (e) => {
    // console.log("Role change", e.target.value);
    setFormData({ ...formData, role: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const response = await axios.post(
        `https://doctor-appointment-hpp0.onrender.com/${formData.role}/login`,
        formData
      );

      if (response.data.status) {
        toast.success("Login successful!");
        // console.log("UserId: " + response.data.userId, response.data);
        localStorage.setItem("token", response.data.token);
        localStorage.setItem("userId", response.data.userId);

        if (formData.role === "patient") {
          history("/patient-dashboard");
          login();
        } else if (formData.role === "doctor") {
          history("/doctor-dashboard");
          login();
        } 
        else if (formData.role === "admin") {
          history("/admin-dashboard");
          login();
        }
      } else {
        toast.error("Login failed. Please check your credentials.");
      }
    } catch (error) {
      console.error("Error logging in:", error);
      toast.error(
        "An error occurred while logging in. Please try again later."
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center h-screen ">
      <div className="w-full max-w-md p-6 rounded-lg shadow-lg bg-opacity-10 backdrop-blur-xl">
        <h2 className="mb-6 text-3xl font-bold text-center text-Slate-700">
          Login
        </h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block mb-2 text-sm font-bold text-Slate-700">
              Email<span className="text-red-500">*</span>
            </label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-b-4 rounded-lg border-Stone-500 focus:outline-none focus:ring-2 focus:ring-Stone-600 focus:border-transparent"
              placeholder="Enter your email"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block mb-2 text-sm font-bold text-Slate-700">
              Password<span className="text-red-500">*</span>
            </label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-b-4 rounded-lg border-Stone-500 focus:outline-none focus:ring-2 focus:ring-Stone-600 focus:border-transparent"
              placeholder="Enter your password"
              required
            />
          </div>

          <div className="flex items-center space-x-4">
            <label className="block mb-2 text-sm font-bold text-Stone-700">
              Role
            </label>
            <div className="flex items-center space-x-4">
              <label className="flex items-center">
                <input
                  type="radio"
                  name="role"
                  value="patient"
                  checked={formData.role === "patient"}
                  onChange={handleRoleChange}
                  className="mr-2 -mt-2"
                />
                <span className="-mt-2 text-sm font-bold text-Stone-700">
                  Patient
                </span>
              </label>

              <label className="flex items-center">
                <input
                  type="radio"
                  name="role"
                  value="doctor"
                  checked={formData.role === "doctor"}
                  onChange={handleRoleChange}
                  className="mr-2 -mt-2"
                />
                <span className="-mt-2 text-sm font-bold text-Stone-700">
                  Doctor
                </span>
              </label>

         {/*     <label className="flex items-center">
                <input
                  type="radio"
                  name="role"
                  value="admin"
                  checked={formData.role === "admin"}
                  onChange={handleRoleChange}
                  className="mr-2 -mt-2"
                />
                <span className="-mt-2 text-sm font-bold text-Stone-700">
                  Admin
                </span> 
              </label> */}
            </div>
          </div>
          <div className="text-center">
            <button
              type="submit"
              className="w-full px-6 py-3 mt-10 font-bold transition-transform duration-300 ease-in-out transform bg-red-300 rounded-full text-slate hover:bg-stone-300 focus:outline-none focus:shadow-outline-slate active:bg-Slate-800 hover:scale-105"
              disabled={isLoading}
            >
              {isLoading ? "Please wait, logging in..." : "Login"}{" "}
            </button>
          </div>
          <div className="mt-4 text-center">
            New user?
            <Link to="/" className="text-Slate-700 hover:underline">
              Register here.
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Login;
