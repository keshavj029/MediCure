import React, { useContext, useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faPhone,
  faUserPlus,
  faEnvelope,
  faVenusMars,
  faCalendar,
  faTint,
  faUser,
  faEdit,
  faSave,
  faTimes,
  faTrash,
  faClock,
  faCheckCircle,
  faBan,
  faPencilAlt,
  faSignOutAlt
} from "@fortawesome/free-solid-svg-icons";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Breadcrumb from "../../components/Breadcrumb";
import EditAppointmentModal from "../../components/Patient/EditAppointmentModal";
import Footer from "../../components/Footer";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../../Context/AuthContext";

const statusColors = {
  scheduled: "text-blue-500 ",
  completed: "text-green-500 ",
  canceled: "text-red-500 "
};

const MyAppointment = () => {
  const [patient, setPatient] = useState(null);
  const [appointments, setAppointments] = useState([]);
  const [editingField, setEditingField] = useState(null);
  const [editedValue, setEditedValue] = useState("");
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [editAppointmentData, setEditAppointmentData] = useState(null);
  const [editedStatus, setEditedStatus] = useState({});
  const token = localStorage.getItem("token");
  // console.log("patientData", patient);
  // console.log("appointmentData", appointments);
  const navigate = useNavigate();
  const { logout } = useContext(AuthContext);

  useEffect(() => {
    const patientId = localStorage.getItem("userId");

    const fetchPatientData = async () => {
      try {
        if (patientId) {
          const response = await axios.get(
            `https://doctor-appointment-hpp0.onrender.com/appointment/patient/${patientId}`,
            {
              headers: {
                Authorization: `Bearer ${token}`
              }
            }
          );

          const data = response.data;
          // setPatient(data.appointment[0].patient);
          setAppointments(data.appointment);
        }
      } catch (error) {
        console.error("Error fetching patient data:", error);
      }
    };

    fetchPatientData();
  }, [token]);

  useEffect(() => {
    const patientId = localStorage.getItem("userId");
    // console.log("patientId: ", patientId, token);
    if (patientId) {
      axios
        .get(
          `https://doctor-appointment-hpp0.onrender.com/patient/${patientId}`,
          {
            headers: {
              Authorization: `Bearer ${token}`
            }
          }
        )
        .then((response) => {
          const data = response.data;
          // console.log("response", data);
          setPatient(data.patient);
        })
        .catch((error) => {
          console.error("Error fetching doctor data:", error);
        });
    }
  }, [token]);

  const updatePatientDetail = async (field, value) => {
    try {
      const token = localStorage.getItem("token");
      const userId = localStorage.getItem("userId");
      // console.log("token userId", token, userId);
      const requestBody = {
        [field]: value,
        role: "patient"
      };

      const response = await axios.patch(
        `https://doctor-appointment-hpp0.onrender.com/patient/${userId}`,
        requestBody,
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      if (response.status === 200) {
        const updatedPatient = { ...patient, [field]: value };
        setPatient(updatedPatient);
        setEditingField(null);
        toast.success(`Successfully updated ${field}`);
      } else {
        console.error("Failed to update patient detail");
      }
    } catch (error) {
      if (error.response && error.response.status === 403) {
        toast.error("You don't have permission to update this field.");
      } else {
        console.error("Error updating patient detail:", error);
        toast.error(`Error updating ${field}`);
      }
    }
  };

  const openEditModal = (appointment) => {
    setEditAppointmentData(appointment);
    setEditModalOpen(true);
  };

  const closeEditModal = () => {
    setEditModalOpen(false);
  };

  const updateAppointmentData = async (updatedData) => {
    const token = localStorage.getItem("token");
    // console.log("token", token);
    const requestBody = {
      updatedData,
      role: "patient"
    };
    try {
      const response = await axios.patch(
        `https://doctor-appointment-hpp0.onrender.com/appointment/${editAppointmentData._id}`,
        requestBody,
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      if (response.status === 200) {
        const updatedAppointments = appointments.map((appointment) =>
          appointment._id === editAppointmentData._id
            ? { ...appointment, ...updatedData }
            : appointment
        );
        setAppointments(updatedAppointments);
        setEditModalOpen(false);
        toast.success("Appointment updated successfully");
      } else {
        console.error("Failed to update appointment");
      }
    } catch (error) {
      console.error("Error updating appointment:", error);
      toast.error("Error updating appointment");
    }
  };

  const deleteAppointment = async (appointmentId) => {
    const token = localStorage.getItem("token");
    // console.log("token", token);
    try {
      const response = await axios.delete(
        `https://doctor-appointment-hpp0.onrender.com/appointment/${appointmentId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      if (response.status === 200) {
        const updatedAppointments = appointments.filter(
          (appointment) => appointment._id !== appointmentId
        );
        setAppointments(updatedAppointments);
        toast.success("Appointment deleted successfully");
      } else {
        console.error("Failed to delete appointment");
      }
    } catch (error) {
      console.error("Error deleting appointment:", error);
      toast.error("Error deleting appointment");
    }
  };

  const updateEditedStatus = (appointmentId, status) => {
    setEditedStatus((prevState) => ({
      ...prevState,
      [appointmentId]: status
    }));
  };

  const handleStatusChange = (event, appointment) => {
    const newStatus = event.target.value;
    updateEditedStatus(appointment._id, newStatus);
  };

  const saveEditedStatus = async (appointmentId) => {
    const newStatus = editedStatus[appointmentId];
    const token = localStorage.getItem("token");
    // console.log("token", token);
    const requestBody = {
      status: newStatus,
      role: "patient"
    };

    try {
      const response = await axios.patch(
        `https://doctor-appointment-hpp0.onrender.com/appointment/${appointmentId}`,
        requestBody,
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      if (response.status === 200) {
        const updatedAppointments = appointments.map((appointment) =>
          appointment._id === appointmentId
            ? { ...appointment, status: newStatus }
            : appointment
        );
        setAppointments(updatedAppointments);
        toast.success("Appointment status updated successfully");
      } else {
        console.error("Failed to update appointment status");
      }
    } catch (error) {
      console.error("Error updating appointment status:", error);
      toast.error("Error updating appointment status");
    }
  };

  function formatTimeToAMPM(time) {
    const [hours, minutes] = time.split(":");
    let period = "AM";
    let formattedHours = parseInt(hours, 10);

    if (formattedHours >= 12) {
      period = "PM";
      if (formattedHours > 12) {
        formattedHours -= 12;
      }
    }

    return `${formattedHours}:${minutes} ${period}`;
  }

  const breadcrumbs = [
    { title: "Home", link: "/patient-dashboard" },
    { title: "My Appointment", link: "/myappointment" }
  ];
  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <>
      <div className="min-h-screen font-sans bg-gray-100">
        <ToastContainer position="top-right" autoClose={3000} />{" "}
        <header className="fixed top-0 z-10 flex items-center justify-between w-full py-4 text-white bg-blue-600">
          <div className="container mx-auto text-center">
            <h1 className="text-3xl font-semibold">
              <FontAwesomeIcon icon={faUser} className="mr-2 text-4xl" />
              Welcome,{" "}
              {patient
                ? `${patient.firstName} ${patient.lastName}`
                : "Loading..."}
            </h1>
          </div>
          <button
            className="flex px-4 py-1 mr-4 text-white transition-transform duration-300 ease-in-out transform bg-red-600 rounded-full hover:bg-red-700 focus:outline-none focus:shadow-outline-red active:bg-red-800 hover:scale-105"
            onClick={handleLogout}
          >
            <FontAwesomeIcon icon={faSignOutAlt} className="mt-1 mr-2" />
            <h1>Logout</h1>
          </button>
        </header>
        <div className="container mx-auto py-8 mt-12 w-[95%]">
          <Breadcrumb items={breadcrumbs} />
          <div className="p-6 border border-gray-300 rounded-lg">
            <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
              <div className="flex items-center md:col-span-1">
                {patient ? (
                  <div>
                    <h2 className="mb-2 text-3xl font-semibold text-blue-600">
                      <FontAwesomeIcon
                        icon={faUser}
                        className="mr-2 text-4xl"
                      />
                      {patient.firstName} {patient.lastName}
                    </h2>
                    {/* Edit icon and logic for First Name */}
                    {editingField === "firstName" ? (
                      <div className="flex items-center mb-4">
                        <input
                          type="text"
                          value={editedValue}
                          onChange={(e) => setEditedValue(e.target.value)}
                        />
                        <button
                          className="ml-2 text-blue-600"
                          onClick={() =>
                            updatePatientDetail("firstName", editedValue)
                          }
                        >
                          <FontAwesomeIcon icon={faSave} />
                        </button>
                        <button
                          className="ml-2 text-red-600"
                          onClick={() => {
                            setEditingField(null);
                            setEditedValue("");
                          }}
                        >
                          <FontAwesomeIcon icon={faTimes} />
                        </button>
                      </div>
                    ) : (
                      <div className="flex items-center mb-4">
                        <FontAwesomeIcon
                          icon={faUser}
                          className="mr-2 text-xl text-blue-600"
                        />
                        <p className="text-lg text-gray-600">First Name:</p>
                        <p className="ml-2 text-lg">{patient.firstName}</p>
                        <button
                          className="ml-2 text-blue-600"
                          onClick={() => {
                            setEditingField("firstName");
                            setEditedValue(patient.firstName);
                          }}
                        >
                          <FontAwesomeIcon icon={faEdit} />
                        </button>
                      </div>
                    )}
                    {/* Last Name */}
                    {editingField === "lastName" ? (
                      <div className="flex items-center mb-4">
                        <input
                          type="text"
                          value={editedValue}
                          onChange={(e) => setEditedValue(e.target.value)}
                        />
                        <button
                          className="ml-2 text-blue-600"
                          onClick={() =>
                            updatePatientDetail("lastName", editedValue)
                          }
                        >
                          <FontAwesomeIcon icon={faSave} />
                        </button>
                        <button
                          className="ml-2 text-red-600"
                          onClick={() => {
                            setEditingField(null);
                            setEditedValue("");
                          }}
                        >
                          <FontAwesomeIcon icon={faTimes} />
                        </button>
                      </div>
                    ) : (
                      <div className="flex items-center mb-4">
                        <FontAwesomeIcon
                          icon={faUser}
                          className="mr-2 text-xl text-blue-600"
                        />
                        <p className="text-lg text-gray-600">Last Name:</p>
                        <p className="ml-2 text-lg">{patient.lastName}</p>
                        <button
                          className="ml-2 text-blue-600"
                          onClick={() => {
                            setEditingField("lastName");
                            setEditedValue(patient.lastName);
                          }}
                        >
                          <FontAwesomeIcon icon={faEdit} />
                        </button>
                      </div>
                    )}
                    {/* Email */}
                    {editingField === "email" ? (
                      <div className="flex items-center mb-4">
                        <input
                          type="email"
                          value={editedValue}
                          onChange={(e) => setEditedValue(e.target.value)}
                        />
                        <button
                          className="ml-2 text-blue-600"
                          onClick={() =>
                            updatePatientDetail("email", editedValue)
                          }
                        >
                          <FontAwesomeIcon icon={faSave} />
                        </button>
                        <button
                          className="ml-2 text-red-600"
                          onClick={() => {
                            setEditingField(null);
                            setEditedValue("");
                          }}
                        >
                          <FontAwesomeIcon icon={faTimes} />
                        </button>
                      </div>
                    ) : (
                      <div className="flex items-center mb-4">
                        <FontAwesomeIcon
                          icon={faEnvelope}
                          className="w-5 h-5 mr-2 text-blue-600"
                        />
                        <p className="text-lg text-gray-600">Email:</p>
                        <p className="ml-2 text-lg">{patient.email}</p>
                        <button
                          className="ml-2 text-blue-600"
                          onClick={() => {
                            setEditingField("email");
                            setEditedValue(patient.email);
                          }}
                        >
                          <FontAwesomeIcon icon={faEdit} />
                        </button>
                      </div>
                    )}

                    {/* Gender */}
                    {editingField === "gender" ? (
                      <div className="flex items-center mb-4">
                        <input
                          type="radio"
                          value="male"
                          checked={editedValue === "male"}
                          onChange={() => setEditedValue("male")}
                        />
                        <label className="ml-2">Male</label>
                        <input
                          type="radio"
                          value="female"
                          checked={editedValue === "female"}
                          onChange={() => setEditedValue("female")}
                        />
                        <label className="ml-2">Female</label>
                        <button
                          className="ml-2 text-blue-600"
                          onClick={() =>
                            updatePatientDetail("gender", editedValue)
                          }
                        >
                          <FontAwesomeIcon icon={faSave} />
                        </button>
                        <button
                          className="ml-2 text-red-600"
                          onClick={() => {
                            setEditingField(null);
                            setEditedValue("");
                          }}
                        >
                          <FontAwesomeIcon icon={faTimes} />
                        </button>
                      </div>
                    ) : (
                      <div className="flex items-center mb-4">
                        <FontAwesomeIcon
                          icon={faVenusMars}
                          className="w-5 h-5 mr-2 text-blue-600"
                        />
                        <p className="text-lg text-gray-600">Gender:</p>
                        <p className="ml-2 text-lg">{patient.gender}</p>
                        <button
                          className="ml-2 text-blue-600"
                          onClick={() => {
                            setEditingField("gender");
                            setEditedValue(patient.gender);
                          }}
                        >
                          <FontAwesomeIcon icon={faEdit} />
                        </button>
                      </div>
                    )}

                    {/* Date of Birth */}
                    {editingField === "dateOfBirth" ? (
                      <div className="flex items-center mb-4">
                        <input
                          type="date"
                          value={editedValue}
                          onChange={(e) => setEditedValue(e.target.value)}
                        />
                        <button
                          className="ml-2 text-blue-600"
                          onClick={() =>
                            updatePatientDetail("dateOfBirth", editedValue)
                          }
                        >
                          <FontAwesomeIcon icon={faSave} />
                        </button>
                        <button
                          className="ml-2 text-red-600"
                          onClick={() => {
                            setEditingField(null);
                            setEditedValue("");
                          }}
                        >
                          <FontAwesomeIcon icon={faTimes} />
                        </button>
                      </div>
                    ) : (
                      <div className="flex items-center mb-4">
                        <FontAwesomeIcon
                          icon={faCalendar}
                          className="w-5 h-5 mr-2 text-blue-600"
                        />
                        <p className="text-lg text-gray-600">Date of Birth:</p>
                        <p className="ml-2 text-lg">{patient.dateOfBirth}</p>
                        <button
                          className="ml-2 text-blue-600"
                          onClick={() => {
                            setEditingField("dateOfBirth");
                            setEditedValue(patient.dateOfBirth);
                          }}
                        >
                          <FontAwesomeIcon icon={faEdit} />
                        </button>
                      </div>
                    )}

                    {/* Contact Number */}
                    {editingField === "contactNumber" ? (
                      <div className="flex items-center mb-4">
                        <input
                          type="tel"
                          value={editedValue}
                          onChange={(e) => setEditedValue(e.target.value)}
                        />
                        <button
                          className="ml-2 text-blue-600"
                          onClick={() =>
                            updatePatientDetail("contactNumber", editedValue)
                          }
                        >
                          <FontAwesomeIcon icon={faSave} />
                        </button>
                        <button
                          className="ml-2 text-red-600"
                          onClick={() => {
                            setEditingField(null);
                            setEditedValue("");
                          }}
                        >
                          <FontAwesomeIcon icon={faTimes} />
                        </button>
                      </div>
                    ) : (
                      <div className="flex items-center mb-4">
                        <FontAwesomeIcon
                          icon={faPhone}
                          className="w-5 h-5 mr-2 text-blue-600"
                        />
                        <p className="text-lg text-gray-600">Contact Number:</p>
                        <p className="ml-2 text-lg">{patient.contactNumber}</p>
                        <button
                          className="ml-2 text-blue-600"
                          onClick={() => {
                            setEditingField("contactNumber");
                            setEditedValue(patient.contactNumber);
                          }}
                        >
                          <FontAwesomeIcon icon={faEdit} />
                        </button>
                      </div>
                    )}

                    {/* Blood Group */}
                    {editingField === "bloodGroup" ? (
                      <div className="flex items-center mb-4">
                        <select
                          value={editedValue}
                          onChange={(e) => setEditedValue(e.target.value)}
                        >
                          <option value="A+">A+</option>
                          <option value="A-">A-</option>
                          <option value="B+">B+</option>
                          <option value="B-">B-</option>
                          <option value="O+">O+</option>
                          <option value="O-">O-</option>
                          <option value="AB+">AB+</option>
                          <option value="AB-">AB-</option>
                        </select>
                        <button
                          className="ml-2 text-blue-600"
                          onClick={() =>
                            updatePatientDetail("bloodGroup", editedValue)
                          }
                        >
                          <FontAwesomeIcon icon={faSave} />
                        </button>
                        <button
                          className="ml-2 text-red-600"
                          onClick={() => {
                            setEditingField(null);
                            setEditedValue("");
                          }}
                        >
                          <FontAwesomeIcon icon={faTimes} />
                        </button>
                      </div>
                    ) : (
                      <div className="flex items-center mb-4">
                        <FontAwesomeIcon
                          icon={faTint}
                          className="w-5 h-5 mr-2 text-blue-600"
                        />
                        <p className="text-lg text-gray-600">Blood Group:</p>
                        <p className="text-lg ml-7">{patient.bloodGroup}</p>
                        <button
                          className="ml-2 text-blue-600"
                          onClick={() => {
                            setEditingField("bloodGroup");
                            setEditedValue(patient.bloodGroup);
                          }}
                        >
                          <FontAwesomeIcon icon={faEdit} />
                        </button>
                      </div>
                    )}
                  </div>
                ) : (
                  <p className="text-lg">Loading patient data...</p>
                )}
              </div>

              <div className="md:col-span-1">
                <div className="relative mx-auto overflow-hidden rounded-full w-96 h-96">
                  <img
                    src={
                      patient
                        ? patient.gender === "female"
                          ? "https://png.pngtree.com/png-vector/20190130/ourlarge/pngtree-cute-girl-avatar-material-png-image_678035.jpg"
                          : "https://yt3.googleusercontent.com/ytc/AGIKgqNO2Cz7ILUFn2DRPVjta3eANRPAhbI8eMeqcSjA=s900-c-k-c0x00ffffff-no-rj"
                        : ""
                    }
                    alt={
                      patient ? `${patient.firstName} ${patient.lastName}` : ""
                    }
                    className="object-cover w-96 h-96 mix-blend-multiply"
                  />
                  <div className="absolute inset-0 flex items-center justify-center transition-opacity bg-black bg-opacity-50 opacity-0 hover:bg-opacity-70 group-hover:opacity-100">
                    <p className="text-lg font-semibold text-white">
                      View Profile
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="p-6 mt-8 border border-gray-300 rounded-lg">
            <h2 className="mt-8 text-3xl font-semibold text-blue-600">
              <FontAwesomeIcon icon={faUserPlus} className="mr-2 text-4xl" />
              Appointments
            </h2>
            <p className="text-lg text-gray-600">
              Total Appointments: {appointments.length}
            </p>
          </div>

          <hr className="my-6 border-t border-gray-300" />

          <div className="mt-8">
            {appointments.length > 0 ? (
              <>
                <h2 className="mb-4 text-3xl font-semibold text-blue-600">
                  <FontAwesomeIcon
                    icon={faUserPlus}
                    className="mr-2 text-4xl text-blue-600"
                  />
                  Upcoming Appointments
                </h2>
                <div className="overflow-x-auto">
                  <table className="min-w-full overflow-hidden text-center text-gray-800 bg-white border-collapse rounded-lg">
                    <thead>
                      <tr className="text-center text-white bg-gradient-to-r from-blue-500 via-purple-500 to-indigo-500">
                        <th className="px-6 py-4 text-lg">Doctor</th>
                        <th className="px-6 py-4 text-lg">Date</th>
                        <th className="px-6 py-4 text-lg">Time</th>
                        <th className="px-6 py-4 text-lg">Disease</th>
                        <th className="px-6 py-4 text-lg">Status</th>
                        <th className="px-6 py-4 text-lg">Actions</th>{" "}
                      </tr>
                    </thead>
                    <tbody>
                      {appointments.map((appointment, index) => (
                        <tr
                          key={appointment._id}
                          className={`group transition-all hover:bg-indigo-200 ${
                            index % 2 === 0 ? "bg-gray-100" : "bg-white"
                          }`}
                        >
                          <td className="px-6 py-4 text-lg">{`${appointment.doctor.firstName} ${appointment.doctor.lastName}`}</td>
                          <td className="px-6 py-4 text-lg">
                            {appointment.appointmentDate}
                          </td>
                          <td className="px-6 py-4 text-lg">{`${formatTimeToAMPM(
                            appointment.startTime
                          )} - ${formatTimeToAMPM(appointment.endTime)}`}</td>

                          <td className="relative px-6 py-4 text-lg group-hover:overflow-visible">
                            <span className="">{appointment.disease}</span>
                            <div className="absolute left-0 hidden p-4 transition-all transform bg-white border border-gray-300 shadow-lg opacity-0 top-10 w-60 group-hover:opacity-100 group-hover:translate-y-2">
                              <p className="text-sm font-normal text-gray-600">
                                {appointment.additionalInfo}
                              </p>
                            </div>
                          </td>
                          <td className="px-6 py-4 text-lg">
                            {editingField === appointment._id ? (
                              <div className="flex items-center">
                                <select
                                  value={
                                    editedStatus[appointment._id] ||
                                    appointment.status
                                  }
                                  onChange={(event) =>
                                    handleStatusChange(event, appointment)
                                  }
                                  className="mr-2"
                                >
                                  <option value="scheduled">Scheduled</option>
                                  <option value="completed">Completed</option>
                                  <option value="canceled">Canceled</option>
                                </select>
                                <button
                                  className="text-blue-600"
                                  onClick={() => {
                                    saveEditedStatus(appointment._id);
                                    setEditingField(null);
                                  }}
                                >
                                  <FontAwesomeIcon icon={faSave} />
                                </button>
                              </div>
                            ) : (
                              <div
                                className={`px-4 py-2 text-lg ${
                                  statusColors[appointment.status]
                                }`}
                              >
                                {appointment.status}
                                <span className="ml-3 mr-2">
                                  {appointment.status === "scheduled" && (
                                    <FontAwesomeIcon icon={faClock} />
                                  )}
                                  {appointment.status === "completed" && (
                                    <FontAwesomeIcon icon={faCheckCircle} />
                                  )}
                                  {appointment.status === "canceled" && (
                                    <FontAwesomeIcon icon={faBan} />
                                  )}
                                </span>
                                <button
                                  className={`${
                                    statusColors[appointment.status]
                                  } ml-2 text-sm`}
                                  onClick={() => {
                                    setEditingField(appointment._id);
                                    setEditedStatus({
                                      ...editedStatus,
                                      [appointment._id]: appointment.status
                                    });
                                  }}
                                >
                                  <FontAwesomeIcon icon={faPencilAlt} />
                                </button>
                              </div>
                            )}
                          </td>

                          <td className="px-6 py-4 text-lg">
                            <button
                              className="ml-2 text-blue-600"
                              onClick={() => openEditModal(appointment)}
                            >
                              <FontAwesomeIcon icon={faEdit} />
                            </button>
                            <button
                              className="ml-2 text-red-600"
                              onClick={() => deleteAppointment(appointment._id)}
                            >
                              <FontAwesomeIcon icon={faTrash} />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </>
            ) : null}
          </div>
          {editModalOpen && (
            <EditAppointmentModal
              appointment={editAppointmentData}
              closeModal={closeEditModal}
              updateAppointment={updateAppointmentData}
            />
          )}
        </div>
      </div>

      <Footer />
    </>
  );
};

export default MyAppointment;