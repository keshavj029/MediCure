import React, { useContext, useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faUserMd,
  faMapMarkerAlt,
  faPhone,
  faClock,
  faStethoscope,
  faInfoCircle,
  faUserPlus,
  faEdit,
  faTimes,
  faSave,
  faUser,
  faCheckCircle,
  faBan,
  faPencilAlt,
  faTrash,
  faSignOutAlt
} from "@fortawesome/free-solid-svg-icons";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Footer from "../../components/Footer";
import { AuthContext } from "../../Context/AuthContext";
import { useNavigate } from "react-router-dom";

const statusColors = {
  scheduled: "text-blue-500 ",
  completed: "text-green-500 ",
  canceled: "text-red-500 "
};

const DoctorDashboard = () => {
  const [doctor, setDoctor] = useState(null);
  const [appointments, setAppointments] = useState([]);
  const [editingField, setEditingField] = useState(null);
  const [editedValue, setEditedValue] = useState("");
  const [editedStatus, setEditedStatus] = useState({});
  const token = localStorage.getItem("token");
  const { logout } = useContext(AuthContext);
  const navigate = useNavigate();
  // console.log("appointments", appointments, token);
  // console.log("appointments", appointments);
  useEffect(() => {
    const doctorId = localStorage.getItem("userId");

    if (doctorId) {
      axios
        .get(
          `https://doctor-appointment-hpp0.onrender.com/appointment/doctor/${doctorId}`,
          {
            role: "docotor",
            headers: {
              Authorization: `Bearer ${token}`
            }
          }
        )
        .then((response) => {
          const data = response.data;
          // console.log("response", data.appointment[0].doctor);
          // setDoctor(data.appointment[0].doctor);
          setAppointments(data.appointment);
        })
        .catch((error) => {
          console.error("Error fetching doctor data:", error);
        });
    }
  }, [token]);

  useEffect(() => {
    const doctorId = localStorage.getItem("userId");
    // console.log("doctorId: ", doctorId, token);
    if (doctorId) {
      axios
        .get(
          `https://doctor-appointment-hpp0.onrender.com/doctor/${doctorId}`,
          {
            headers: {
              Authorization: `Bearer ${token}`
            }
          }
        )
        .then((response) => {
          const data = response.data;
          // console.log("response", data.doctor);
          setDoctor(data.doctor);
        })
        .catch((error) => {
          console.error("Error fetching doctor data:", error);
        });
    }
  }, [token]);

  const updateDoctorDetail = async (field, value) => {
    // console.log("Doctorid", doctor._id);
    const token = localStorage.getItem("token");
    const userId = localStorage.getItem("userId");
    // console.log("token userId", token, userId);
    const requestBody = {
      [field]: value,
      role: "doctor"
    };
    try {
      const response = await axios.patch(
        `https://doctor-appointment-hpp0.onrender.com/doctor/${userId}`,
        requestBody,
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      if (response.status === 200) {
        const updatedDoctor = { ...doctor, [field]: value };
        setDoctor(updatedDoctor);
        setEditingField(null);
        toast.success(`Successfully updated ${field}`);
      } else {
        console.error("Failed to update patient detail");
      }
    } catch (error) {
      console.error("Error updating patient detail:", error);
      toast.error(`Error updating ${field}`);
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
  
    const requestBody = {
      status: newStatus,
      role: "doctor"
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

  const handleLogout = () => {
    logout();
    navigate("/login");
  };
  // console.log("A", appointments.length);
  return (
    <>
      <div className="min-h-screen font-sans bg-gray-100">
        <ToastContainer position="top-right" autoClose={3000} />{" "}
        <header className="fixed top-0 z-10 flex items-center justify-between w-full py-4 text-white bg-blue-600">
          <div className="container mx-auto text-center">
            <h1 className="text-3xl font-semibold">
              <FontAwesomeIcon icon={faUserMd} className="mr-2 text-4xl" />
              Welcome, Dr.{" "}
              {doctor ? `${doctor.firstName} ${doctor.lastName}` : "Loading..."}
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
          <div className="p-6 border border-gray-300 rounded-lg">
            <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
              <div className="flex items-center md:col-span-1">
                {doctor ? (
                  <div>
                    <h2 className="mb-2 text-3xl font-semibold text-blue-600">
                      <FontAwesomeIcon
                        icon={faUser}
                        className="mr-2 text-4xl"
                      />
                      {doctor.firstName} {doctor.lastName}
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
                            updateDoctorDetail("firstName", editedValue)
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
                        <p className="ml-2 text-lg">{doctor.firstName}</p>
                        <button
                          className="ml-2 text-blue-600"
                          onClick={() => {
                            setEditingField("firstName");
                            setEditedValue(doctor.firstName);
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
                            updateDoctorDetail("lastName", editedValue)
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
                        <p className="ml-2 text-lg">{doctor.lastName}</p>
                        <button
                          className="ml-2 text-blue-600"
                          onClick={() => {
                            setEditingField("lastName");
                            setEditedValue(doctor.lastName);
                          }}
                        >
                          <FontAwesomeIcon icon={faEdit} />
                        </button>
                      </div>
                    )}
                    {/* Edit icon and logic for Specialty */}
                    {editingField === "specialty" ? (
                      <div className="flex items-center mb-4">
                        <input
                          type="text"
                          value={editedValue}
                          onChange={(e) => setEditedValue(e.target.value)}
                        />
                        <button
                          className="ml-2 text-blue-600"
                          onClick={() =>
                            updateDoctorDetail("specialty", editedValue)
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
                        {/* Display the doctor's specialty */}
                        <FontAwesomeIcon
                          icon={faStethoscope}
                          className="w-5 h-5 mr-2 text-blue-600"
                        />
                        <p className="text-lg text-gray-600">Specialty:</p>
                        <p className="ml-2 text-lg">{doctor.specialty}</p>
                        <button
                          className="ml-2 text-blue-600"
                          onClick={() => {
                            setEditingField("specialty");
                            setEditedValue(doctor.specialty);
                          }}
                        >
                          <FontAwesomeIcon icon={faEdit} />
                        </button>
                      </div>
                    )}
                    {/* Edit icon and logic for Clinic Location */}
                    {editingField === "clinicLocation" ? (
                      <div className="flex items-center mb-4">
                        <input
                          type="text"
                          value={editedValue}
                          onChange={(e) => setEditedValue(e.target.value)}
                        />
                        <button
                          className="ml-2 text-blue-600"
                          onClick={() =>
                            updateDoctorDetail("clinicLocation", editedValue)
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
                          icon={faMapMarkerAlt}
                          className="w-5 h-5 mr-2 text-blue-600"
                        />
                        <p className="text-lg text-gray-600">
                          Clinic Location:
                        </p>
                        <p className="ml-2 text-lg">{doctor.clinicLocation}</p>
                        <button
                          className="ml-2 text-blue-600"
                          onClick={() => {
                            setEditingField("clinicLocation");
                            setEditedValue(doctor.clinicLocation);
                          }}
                        >
                          <FontAwesomeIcon icon={faEdit} />
                        </button>
                      </div>
                    )}

                    {/* Edit icon and logic for Contact Number */}
                    {editingField === "contactNumber" ? (
                      <div className="flex items-center mb-4">
                        <input
                          type="text"
                          value={editedValue}
                          onChange={(e) => setEditedValue(e.target.value)}
                        />
                        <button
                          className="ml-2 text-blue-600"
                          onClick={() =>
                            updateDoctorDetail("contactNumber", editedValue)
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
                        <p className="ml-2 text-lg">{doctor.contactNumber}</p>
                        <button
                          className="ml-2 text-blue-600"
                          onClick={() => {
                            setEditingField("contactNumber");
                            setEditedValue(doctor.contactNumber);
                          }}
                        >
                          <FontAwesomeIcon icon={faEdit} />
                        </button>
                      </div>
                    )}

                    {/* Edit icon and logic for Working Hours */}
                    {editingField === "workingHours" ? (
                      <div className="flex items-center mb-4">
                        <input
                          type="text"
                          value={editedValue}
                          onChange={(e) => setEditedValue(e.target.value)}
                        />
                        <button
                          className="ml-2 text-blue-600"
                          onClick={() =>
                            updateDoctorDetail("workingHours", editedValue)
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
                          icon={faClock}
                          className="w-5 h-5 mr-2 text-blue-600"
                        />
                        <p className="text-lg text-gray-600">Working Hours:</p>
                        <p className="ml-2 text-lg">
                          {doctor.workingHours} hours per day
                        </p>
                        <button
                          className="ml-2 text-blue-600"
                          onClick={() => {
                            setEditingField("workingHours");
                            setEditedValue(doctor.workingHours);
                          }}
                        >
                          <FontAwesomeIcon icon={faEdit} />
                        </button>
                      </div>
                    )}

                    {/* Edit icon and logic for About */}
                    {editingField === "about" ? (
                      <div className="flex items-center mb-4">
                        <textarea
                          value={editedValue}
                          onChange={(e) => setEditedValue(e.target.value)}
                        />
                        <button
                          className="ml-2 text-blue-600"
                          onClick={() =>
                            updateDoctorDetail("about", editedValue)
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
                          icon={faInfoCircle}
                          className="w-5 h-5 mr-2 text-blue-600"
                        />
                        <p className="text-lg text-gray-600">About:</p>
                        <p className="text-lg ml-7">{doctor.about}</p>
                        <button
                          className="ml-2 text-blue-600"
                          onClick={() => {
                            setEditingField("about");
                            setEditedValue(doctor.about);
                          }}
                        >
                          <FontAwesomeIcon icon={faEdit} />
                        </button>
                      </div>
                    )}
                  </div>
                ) : (
                  <p className="text-lg">Loading doctor data...</p>
                )}
              </div>

              <div className="md:col-span-1">
                <div className="relative mx-auto overflow-hidden rounded-full w-96 h-96">
                  <img
                    src={doctor ? doctor.profile : ""}
                    alt={doctor ? `${doctor.firstName} ${doctor.lastName}` : ""}
                    className="object-cover w-96 h-96"
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
          <h2 className="mt-8 text-3xl font-semibold text-blue-600">
            <FontAwesomeIcon
              icon={faInfoCircle}
              className="mr-2 text-4xl text-blue-600"
            />
            About Dr. {doctor ? doctor.firstName : "Loading..."}{" "}
            {doctor ? doctor.lastName : "Loading..."}
          </h2>
          {doctor ? (
            <>
              <p className="p-6 mt-4 text-lg border border-gray-300 rounded-lg">
                Dr. {doctor.firstName} {doctor.lastName} is a highly respected
                and accomplished medical professional in the field of{" "}
                {doctor.specialty}. With an extensive background in{" "}
                {doctor.specialty}, Dr. {doctor.lastName} has garnered a
                reputation for excellence and a commitment to improving the
                health and well-being of patients. Graduating with top honors
                from a renowned medical institution, Dr. {doctor.lastName}{" "}
                brings a wealth of knowledge and skill to every patient
                interaction.
              </p>

              <p className="p-6 mt-4 text-lg border border-gray-300 rounded-lg">
                The journey of healing and healthcare begins at{" "}
                {doctor.clinicLocation}, where Dr. {doctor.lastName} operates a
                modern and well-equipped medical practice. Patients can trust in
                the expertise and compassionate care provided by Dr.{" "}
                {doctor.lastName} and the dedicated team.
              </p>

              <p className="p-6 mt-4 text-lg border border-gray-300 rounded-lg">
                Dr. {doctor.lastName} believes in the importance of
                accessibility and is readily available to patients via phone at{" "}
                {doctor.contactNumber}. Whether you need to schedule an
                appointment or seek medical advice, Dr. {doctor.lastName} is
                just a call away.
              </p>

              <p className="p-6 mt-4 text-lg border border-gray-300 rounded-lg">
                With a commitment to the well-being of the community, Dr.{" "}
                {doctor.lastName}
                dedicates {doctor.workingHours} hours every day to patient care,
                ensuring that no medical concern goes unattended. This
                dedication extends to providing personalized treatment plans,
                tailored to meet the unique needs of each patient.
              </p>

              <p className="p-6 mt-4 text-lg border border-gray-300 rounded-lg">
                Beyond the clinical setting, Dr. {doctor.lastName} is known for
                involvement in health education and awareness programs,
                demonstrating a passion for improving public health. Patients
                not only receive expert medical care but also benefit from Dr.{" "}
                {doctor.lastName}'s guidance on preventive health measures.
              </p>

              <p className="p-6 mt-4 text-lg border border-gray-300 rounded-lg">
                Dr. {doctor.lastName} takes pride in fostering a welcoming and
                inclusive environment for patients of all backgrounds, ensuring
                that everyone feels comfortable and respected during
                consultations. Patients consistently commend Dr.{" "}
                {doctor.lastName} for exceptional bedside manner and the ability
                to explain complex medical concepts in an understandable way.
              </p>

              <p className="p-6 mt-4 text-lg border border-gray-300 rounded-lg">
                If you're looking for a healthcare provider who combines
                expertise, compassion, and a commitment to excellence, Dr.{" "}
                {doctor.lastName} is the ideal choice. Your health and
                well-being are the top priorities, and Dr. {doctor.lastName} is
                dedicated to guiding you on your path to optimal health.
                Experience the difference of patient-centered care with Dr.{" "}
                {doctor.firstName} {doctor.lastName}. Schedule your appointment
                today and embark on a journey toward a healthier, happier life
                under the care of a trusted medical professional.
              </p>
            </>
          ) : null}

          {appointments.length > 0 ? (
            <div className="mt-8">
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
                    <tr className="text-white bg-gradient-to-r from-blue-500 via-purple-500 to-indigo-500">
                      <th className="px-6 py-4 text-lg">Patient</th>
                      <th className="px-6 py-4 text-lg">Date</th>
                      <th className="px-6 py-4 text-lg">Time</th>
                      <th className="px-6 py-4 text-lg">Disease</th>
                      <th className="px-6 py-4 text-lg">Status</th>
                      <th className="px-6 py-4 text-lg">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {appointments.map((appointment, index) => (
                      <tr
                        key={appointment._id}
                        className={`group transition-all hover:bg-blue-200 ${
                          index % 2 === 0 ? "bg-gray-100" : "bg-white"
                        }`}
                      >
                        <td className="px-6 py-4 text-lg">{`${appointment.patient.firstName} ${appointment.patient.lastName}`}</td>
                        <td className="px-6 py-4 text-lg">
                          {appointment.appointmentDate}
                        </td>
                        <td className="px-6 py-4 text-lg">{`${appointment.startTime} - ${appointment.endTime}`}</td>
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
            </div>
          ) : null}
        </div>
      </div>
      <Footer />
    </>
  );
};

export default DoctorDashboard;
