import React, { useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const RegistrationForm = () => {
  const navigate = useNavigate();
  const [role, setRole] = useState("patient");
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    dateOfBirth: "",
    gender: "",
    contactNumber: "",
    address: {
      street: "",
      city: "",
      state: "",
      postalCode: ""
    },
    bloodGroup: "",
    specialty: "",
    clinicLocation: "",
    workingHours: "",
    about: ""
  });
  const [isLoading, setIsLoading] = useState(false);

  const handleRoleChange = (e) => {
    setRole(e.target.value);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    if (name.startsWith("address.")) {
      setFormData({
        ...formData,
        address: {
          ...formData.address,
          [name.substring(8)]: value
        }
      });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const response = await axios.post(
        role === "doctor"
          ? "https://doctor-appointment-hpp0.onrender.com/doctor/register"
          : "https://doctor-appointment-hpp0.onrender.com/patient/register",
        formData
      );
      // console.log("formData", response.data);
      if (response.data.status) {
        toast.success("Registration successful!");
        navigate("/login");
      } else {
        toast.error("Registration failed. Please try again.");
      }
    } catch (error) {
      console.error("Error registering user:", error);
      toast.error(
        "An error occurred while registering. Please try again later."
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div>
      <div className="container max-w-screen-md p-8 mx-auto border rounded-lg shadow-md bg-opacity-10 backdrop-blur-xl">
        <h2 className="mb-6 text-3xl font-bold text-center text-Slate-700">
          Registration
        </h2>
        <div className="mb-4">
          <div className="flex items-center space-x-4">
            <label className="block mb-2 text-sm font-bold text-Slate-700">
              Role
            </label>
            <div className="flex items-center -mt-2 font-bold text-Slate-600">
              <label className="mr-4">
                <input
                  type="radio"
                  name="role"
                  value="patient"
                  checked={role === "patient"}
                  onChange={handleRoleChange}
                  className="mr-2 leading-tight text-Slate-600"
                />
                Patient
              </label>
              <label>
                <input
                  type="radio"
                  name="role"
                  value="doctor"
                  checked={role === "doctor"}
                  onChange={handleRoleChange}
                  className="mr-2 leading-tight text-Slate-600"
                />
                Doctor
              </label>
            </div>
          </div>
        </div>
        <form
          onSubmit={handleSubmit}
          className={`mb-4 ${role === "doctor" ? "hidden" : ""}`}
        >
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            {[
              { label: "First Name", name: "firstName", type: "text" },
              { label: "Last Name", name: "lastName", type: "text" },
              { label: "Email", name: "email", type: "email" },
              { label: "Password", name: "password", type: "password" },
              { label: "Date of Birth", name: "dateOfBirth", type: "date" },
              { label: "Contact Number", name: "contactNumber", type: "tel"}
            ].map((field) => (
              <div key={field.name} className="mb-4">
                <label className="block mb-2 text-sm font-bold text-Slate-700">
                  {field.label}
                </label>
                <input
                  type={field.type}
                  name={field.name}
                  value={formData[field.name]}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 text-gray-700 placeholder-gray-400 border-b-4 rounded-lg border-Stone-500 focus:outline-none focus:border-Stone-600"
                  placeholder={`Enter ${field.label}`}
                  required
                />
              </div>
            ))}
          </div>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div className="mb-4">
              <label className="block mb-2 text-sm font-bold text-Slate-700">
                Gender<span className="text-red-500">*</span>
              </label>
              <select
                name="gender"
                value={formData.gender}
                onChange={handleInputChange}
                className={`w-full border-b-4 border-Stone-500 rounded-lg py-2 px-3 focus:outline-none focus:border-Stone-600 text-gray-700 placeholder-gray-400`}
              >
                <option value="" disabled>
                  Select your gender
                </option>
                {["male", "female", "other"].map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </select>
            </div>
            <div className="mb-4">
              <label className="block mb-2 text-sm font-bold text-Slate-700">
                Blood Group<span className="text-red-500">*</span>
              </label>
              <select
                name="bloodGroup"
                value={formData.bloodGroup}
                onChange={handleInputChange}
                className={`w-full border-b-4 border-Stone-500 rounded-lg py-2 px-3 focus:outline-none focus:border-Stone-600 text-gray-700 placeholder-gray-400`}
              >
                <option value="" disabled>
                  Select your blood group
                </option>
                {[
                  "A+",
                  "A-",
                  "B+",
                  "B-",
                  "AB+",
                  "AB-",
                  "O+",
                  "O-",
                  "Other"
                ].map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            {[
              { label: "Street", name: "street", type: "text" },
              { label: "City", name: "city", type: "text" },
              { label: "State", name: "state", type: "text" },
              { label: "Postal Code", name: "postalCode", type: "text" }
            ].map((field) => (
              <div key={field.name} className="mb-4">
                <label className="block mb-2 text-sm font-bold text-Slate-700">
                  {field.label}
                </label>
                <input
                  type={field.type}
                  name={field.name}
                  value={
                    field.name.startsWith("address.")
                      ? formData.address[field.name.split(".")[1]]
                      : formData[field.name]
                  }
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 text-gray-700 placeholder-gray-400 border-b-4 rounded-lg border-Stone-500 focus:outline-none focus:border-Stone-600"
                  placeholder={`Enter ${field.label}`}
                  required
                />
              </div>
            ))}
          </div>
          <div className="text-center">
            <button
              type="submit"
              className="w-full px-6 py-3 mt-10 font-bold transition-transform duration-300 ease-in-out transform bg-red-300 rounded-full text-slate-700 hover:bg-Stone-200 focus:outline-none focus:shadow-outline-slate active:bg-stone-200 hover:scale-105"
              disabled={isLoading}
            >
              {isLoading ? "Registering..." : "Register as Patient"}{" "}
            </button>
          </div>
          <div className="mt-4 text-center">
            <span className="text-black">Already registered?</span>{" "}
            <Link to="/login" className="text-Red-300 hover:underline">
              Login here.
            </Link>
          </div>
        </form>
        {/* Doctor form section */}
        <form
          onSubmit={handleSubmit}
          className={`mb-4 ${role === "doctor" ? "" : "hidden"}`}
        >
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            {[
              { label: "First Name", name: "firstName", type: "text" },
              { label: "Last Name", name: "lastName", type: "text" },
              { label: "Email", name: "email", type: "email" },
              { label: "Password", name: "password", type: "password" },
              { label: "Specialty", name: "specialty", type: "text" },
              {
                label: "Clinic Location",
                name: "clinicLocation",
                type: "text"
              },
              { label: "Contact Number", name: "contactNumber", type: "tel" },
              { label: "Working Hours", name: "workingHours", type: "text" }
            ].map((field) => (
              <div key={field.name} className="mb-4">
                <label className="block mb-2 text-sm font-bold text-Slate-700">
                  {field.label}
                </label>
                <input
                  type={field.type}
                  name={field.name}
                  value={formData[field.name]}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 text-gray-700 placeholder-gray-400 border-b-4 rounded-lg border-Stone-500 focus:outline-none focus:border-Stone-600"
                  placeholder={`Enter ${field.label}`}
                  required
                />
              </div>
            ))}
          </div>
          <div className="mb-4">
            <label className="block mb-2 text-sm font-bold text-Slate-700">
              About
            </label>
            <textarea
              name="about"
              value={formData.about}
              onChange={handleInputChange}
              className="w-full px-3 py-2 text-gray-700 placeholder-gray-400 border-b-4 rounded-lg border-Stone-500 focus:outline-none focus:border-Stone-600"
              placeholder="Tell us about yourself"
              rows="4"
            ></textarea>
          </div>
          <div className="text-center">
            <button
              type="submit"
              className="w-full px-6 py-3 mt-10 font-bold transition-transform duration-300 ease-in-out transform rounded-full text-slate bg-Slate-600 hover:bg-Slate-700 focus:outline-none focus:shadow-outline-slate active:bg-Slate-800 hover:scale-105"
              disabled={isLoading}
            >
              {isLoading ? "Registering..." : "Register as Doctor"}{" "}
            </button>
          </div>
          <div className="mt-4 text-center">
            <span className="text-black">Already registered?</span>{" "}
            <Link to="/login" className="font-bold text-Slate-700">
              Login here.
            </Link>
          </div>
        </form>
      </div>
      <ToastContainer />
    </div>
  );
};

export default RegistrationForm;
