import React, { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faStethoscope,
  faUserMd,
  faMapMarkerAlt,
  faPhone,
  faClock,
  faCalendarCheck
} from "@fortawesome/free-solid-svg-icons";
import Modal from "react-modal";
import axios from "axios";
import AppointmentForm from "./AppointmentForm";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const DoctorCard = ({ doctor }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  const openModal = () => {
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  const handleAppointmentSubmit = (appointmentData) => {
    const patientId = localStorage.getItem("userId");

    appointmentData.patient = patientId;

    axios
      .post(
        "https://doctor-appointment-hpp0.onrender.com/appointment/",
        appointmentData
      )
      .then((response) => {
        toast.success("Appointment created successfully");
        // updateDoctorAppointments(response.data.doctor, response.data._id);
        // updatePatientAppointments(response.data.patient, response.data._id);
        closeModal();
      })
      .catch((error) => {
        toast.error("Error creating appointment");
        console.error("Error creating appointment:", error);
      });
  };

  return (
    <div className="p-4 mb-4 bg-white rounded-lg shadow-lg">
      <div className="relative h-64 mb-4">
        <img
          src={doctor.profile}
          alt={`${doctor.firstName} ${doctor.lastName}`}
          className="w-full h-full rounded-lg"
        />
        <div className="absolute bottom-0 left-0 p-2 text-white bg-indigo-700 rounded-tr-lg">
          <FontAwesomeIcon icon={faStethoscope} className="mr-2" />
          {doctor.specialty}
        </div>
      </div>
      <div className="mb-2 font-semibold text-indigo-700">
        Dr. {doctor.firstName} {doctor.lastName}
      </div>
      <div className="mb-2 text-sm text-gray-700">
        <FontAwesomeIcon icon={faMapMarkerAlt} className="mr-2" />
        {doctor.clinicLocation}
      </div>
      <div className="mb-2 text-sm text-gray-700">
        <FontAwesomeIcon icon={faPhone} className="mr-2" />
        {doctor.contactNumber}
      </div>
      <div className="mb-2 text-sm text-gray-700">
        <FontAwesomeIcon icon={faClock} className="mr-2" />
        Working Hours: {doctor.workingHours}
      </div>
      <div className="mb-2 text-sm text-gray-700">
        <FontAwesomeIcon icon={faUserMd} className="mr-2" />
        {doctor.about}
      </div>
      <div className="text-center">
        <button
          onClick={openModal}
          className="px-4 py-2 font-bold text-white transition-transform duration-300 ease-in-out transform bg-indigo-600 rounded-full hover:bg-indigo-700 focus:outline-none focus:shadow-outline-indigo active:bg-indigo-800 hover:scale-105"
        >
          <FontAwesomeIcon icon={faCalendarCheck} className="mr-2" />
          Book Appointment
        </button>
      </div>

      <Modal
        isOpen={isModalOpen}
        onRequestClose={closeModal}
        contentLabel="Book Appointment"
        className="modal-content"
        overlayClassName="modal-overlay"
      >
        <AppointmentForm
          doctor={doctor}
          onSubmit={handleAppointmentSubmit}
          onCancel={closeModal}
        />
      </Modal>
    </div>
  );
};

export default DoctorCard;
