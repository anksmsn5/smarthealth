"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation"; // ✅ Import router
import { userDashboard } from "@/lib/constants";
import Header from "@/app/Components/Header";
import Swal from "sweetalert2";
import BookAppointmentModal from "@/app/Components/BookAppointmentModal";
import LabTestsModal from "@/app/Components/LabTestsModal";
import { FaPills, FaUserMd, FaVials } from "react-icons/fa";
import DashboardStrip from "@/app/Components/userpanel/DashboardStrip";

export default function Dashboard() {
  const router = useRouter();

  const [totalOrders, setTotalOrders] = useState<number | null>(null);
  const [packageName, setPackageName] = useState<number | null>(null);
  const [totalAppointments, setTotalAppointments] = useState<number | null>(
    null
  );
  const [totalTests, setTotalTests] = useState<number | null>(null);
  const [appointments, setAppointments] = useState<any>([]);
  const [labtests, setLabtests] = useState<[]>([]);
  const [showAppointmentModal, setShowAppointmentModal] = useState(false);
  const [showLabTestModal, setShowLabTestModal] = useState(false);
  const [userId, setUserId] = useState<string | null>(null);

  const [userProfile, setUserProfile] = useState({
    name: "",
    email: "",
    mobile: "",
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const user_id = localStorage.getItem("id");
        setUserId(user_id);
        if (!user_id) {
          console.error("No userId found in localStorage.");
          setLoading(false);
          return;
        }

        const response = await fetch(userDashboard, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ user_id }),
        });

        if (!response.ok) {
          throw new Error("Failed to fetch dashboard data");
        }

        const data = await response.json();

        setTotalOrders(data.data.total_orders || 0);
        setPackageName(data.data.package);
        setTotalAppointments(data.data.total_appointments);
        setTotalTests(data.data.total_labtests);
        setAppointments(data.data.latest_appointments);
        setLabtests(data.data.latest_labtests);
      } catch (error) {
        console.error("Error fetching dashboard data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  const handleBookAppointment = () => {
    if ((totalOrders ?? 0) >= 1) {
      setShowAppointmentModal(true);
    } else {
      Swal.fire({
        icon: "error",
        title: "No Active Package",
        text: "You must purchase a package before booking an appointment.",
      });
    }
  };

  const handleBookLabTests = () => {
    const pkg = localStorage.getItem("package_name");
    if (!pkg || pkg === "null" || pkg === "undefined") {
      Swal.fire({
        icon: "error",
        title: "No Active Package",
        text: "You must purchase a package before booking a Lab test.",
      });
    } else {
      router.push("/userpanel/order-test");
    }
  };

  return (
    <>
      <Header />
      <div className="min-vh-100 d-flex flex-column bg-light py-4">
        <div className="container flex-grow-1">
          <DashboardStrip title={"Dashboard"} />

          {loading ? (
            <p>Loading...</p>
          ) : (
            <>
              <div className="container my-4">
                <div className="row">
                  <div className="col-md-12 mb-4">
                    <b className="text-black">How we can help you today?</b>
                  </div>
                </div>

                <div className="row">
                  {/* ✅ Lab Test card with click handler */}
                  <div className="col-md-4 mb-4">
                    <div
                      className="text-decoration-none text-dark"
                      style={{ cursor: "pointer" }}
                      onClick={handleBookLabTests}
                    >
                      <div
                        className="border rounded p-4 text-center shadow-sm h-100"
                        style={{ backgroundColor: "#e0f7fa" }}
                      >
                        <FaVials size={40} className="mb-3 text-black" />
                        <h5>Lab Tests</h5>
                      </div>
                    </div>
                  </div>

                  {/* Doctor Appointment */}
                  <div className="col-md-4 mb-4">
                    <a
                      href="#"
                      className="text-decoration-none text-dark"
                    >
                      <div
                        className="border rounded p-4 text-center shadow-sm h-100"
                        style={{ backgroundColor: "#e8f5e9" }}
                      >
                        <FaUserMd size={40} className="mb-3 text-black" />
                        <h5>Doctor Appointment</h5>
                      </div>
                    </a>
                  </div>

                  {/* Medicines */}
                  <div className="col-md-4 mb-4">
                    <a
                      href="#"
                      className="text-decoration-none text-dark"
                    >
                      <div
                        className="border rounded p-4 text-center shadow-sm h-100"
                        style={{ backgroundColor: "#fff9c4" }}
                      >
                        <FaPills size={40} className="mb-3 text-black" />
                        <h5>Medicines</h5>
                      </div>
                    </a>
                  </div>
                </div>
              </div>

              <div className="row">
                <div className="col-md-6 mb-4">
                  <div className="card">
                    <div className="card-header bg-primary text-white">
                      Your Appointments
                    </div>
                    <div className="card-body">
                      <table className="table table-striped">
                        <thead>
                          <tr>
                            <th>ID</th>
                            <th>Date</th>
                            <th>Doctor</th>
                            <th>Status</th>
                          </tr>
                        </thead>
                        <tbody>
                          {appointments.length > 0 ? (
                            appointments.map((appt: any) => (
                              <tr key={appt.id}>
                                <td>{appt.id}</td>
                                <td>{appt.appointment_date}</td>
                                <td>{appt.doctor_name}</td>
                                <td>{appt.status}</td>
                              </tr>
                            ))
                          ) : (
                            <tr>
                              <td colSpan={4} className="text-center">
                                No appointments found
                              </td>
                            </tr>
                          )}
                        </tbody>
                      </table>
                      <button type="button" className="btn btn-primary">
                        View All
                      </button>
                    </div>
                  </div>
                </div>

                <div className="col-md-6 mb-4">
                  <div className="card">
                    <div className="card-header bg-primary text-white">
                      Lab Reports
                    </div>
                    <div className="card-body">
                      <table className="table table-striped">
                        <thead>
                          <tr>
                            <th>ID</th>
                            <th>Patient Name</th>
                            <th>Age</th>
                            <th>Status</th>
                          </tr>
                        </thead>
                        <tbody>
                          {labtests.length > 0 ? (
                            labtests.map((test: any, index: number) => (
                              <tr key={index}>
                                <td>{index + 1}</td>
                                <td>{test.patient_name}</td>
                                <td>{test.age}</td>
                                <td>
                                  <span
                                    className={`badge text-white ${
                                      test.status.toLowerCase() === "booked"
                                        ? "bg-danger"
                                        : "bg-success"
                                    }`}
                                  >
                                    {test.status}
                                  </span>
                                </td>
                              </tr>
                            ))
                          ) : (
                            <tr>
                              <td colSpan={4} className="text-center">
                                No lab tests found
                              </td>
                            </tr>
                          )}
                        </tbody>
                      </table>
                      <a
                        href="/userpanel/test-orders"
                        className="btn btn-primary"
                      >
                        View All
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            </>
          )}
        </div>
      </div>

      {showAppointmentModal && (
        <BookAppointmentModal
          show={showAppointmentModal}
          onHide={() => setShowAppointmentModal(false)}
          user_id={userId ? parseInt(userId) : 0}
        />
      )}

      {showLabTestModal && (
        <LabTestsModal
          show={showLabTestModal}
          onHide={() => setShowLabTestModal(false)}
        />
      )}
    </>
  );
}
