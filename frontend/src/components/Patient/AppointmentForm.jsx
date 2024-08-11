import React, { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCalendarAlt,
  faClock,
  faExclamationCircle,
  faSave,
  faTimes
} from "@fortawesome/free-solid-svg-icons";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const AppointmentForm = ({ doctor, onSubmit, onCancel }) => {
  const [appointmentData, setAppointmentData] = useState({
    patient: "",
    doctor: doctor._id,
    appointmentDate: "",
    startTime: "",
    endTime: "",
    status: "scheduled",
    disease: ""
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    if (
      name === "appointmentDate" ||
      name === "startTime" ||
      name === "endTime"
    ) {
      const selectedDate = new Date(value);

      if (selectedDate < new Date()) {
        toast.error(`${name} cannot be set to a past date or time.`, {
          position: "top-right",
          autoClose: 3000
        });

        setAppointmentData({
          ...appointmentData,
          [name]: appointmentData[name]
        });
        return;
      }
    }
    setAppointmentData({ ...appointmentData, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(appointmentData);
  };

  return (
    <div className="fixed top-0 left-0 z-50 flex items-center justify-center w-full h-full bg-opacity-10 backdrop-blur-xs">
      <div className="w-full max-w-md p-6 bg-white rounded-lg shadow-lg bg-opacity-20 backdrop-blur-3xl">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-3xl font-semibold text-slate-600">
            Book Appointment
          </h2>
          <button
            type="button"
            onClick={onCancel}
            className="text-slate-600 hover:text-slate-400 focus:outline-none"
          >
            <FontAwesomeIcon icon={faTimes} size="lg" />
          </button>
        </div>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block mb-2 text-sm font-bold text-slate-600 text-bold">
              <FontAwesomeIcon
                icon={faCalendarAlt}
                className="mr-2 text-slate-600"
              />
              Appointment Date
            </label>
            <input
              type="date"
              name="appointmentDate"
              value={appointmentData.appointmentDate}
              onChange={handleInputChange}
              className="w-full px-4 py-3 border-2 rounded-lg border-slate-600 focus:outline-none focus:border-indigo-700"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block mb-2 text-sm font-bold text-indigo-600">
              <FontAwesomeIcon
                icon={faClock}
                className="mr-2 text-slate-600"
              />
              Start Time
            </label>
            <input
              type="time"
              name="startTime"
              value={appointmentData.startTime}
              onChange={handleInputChange}
              className="w-full px-4 py-3 border-2 rounded-lg border-stone-500 focus:outline-none focus:border-border-600"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block mb-2 text-sm font-bold text-slate-600">
              <FontAwesomeIcon
                icon={faClock}
                className="mr-2 text-slate-600"
              />
              End Time
            </label>
            <input
              type="time"
              name="endTime"
              value={appointmentData.endTime}
              onChange={handleInputChange}
              className="w-full px-4 py-3 border-2 rounded-lg border-stone-500 focus:outline-none focus:border-stone-600"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block mb-2 text-sm font-bold text-slate-600">
              <FontAwesomeIcon
                icon={faExclamationCircle}
                className="mr-2 text-slate-600"
              />
              Disease
            </label>
            <input
              type="text"
              name="disease"
              value={appointmentData.disease}
              onChange={handleInputChange}
              className="w-full px-4 py-3 border-2 rounded-lg border-stone-500 focus:outline-none focus:border-stone-600"
              required
            />
          </div>
          <div className="text-center">
            <button
              type="submit"
              className="px-6 py-3 font-bold transition-transform duration-300 ease-in-out transform bg-red-300 rounded-lg text-slate-500 hover:bg-slate-300 focus:outline-none focus:shadow-outline-indigo active:bg-slate-800 hover:scale-105"
            >
              <FontAwesomeIcon icon={faSave} className="mr-2" />
              Book Appointment
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AppointmentForm;
