"use client";

import { useEffect, useState } from "react";
import { userDashboard } from "@/lib/constants";
import Header from "@/app/Components/Header";
import Swal from "sweetalert2";
import BookAppointmentModal from "@/app/Components/BookAppointmentModal";
import LabTestsModal from "@/app/Components/LabTestsModal";

export default function Dashboard() {
  const [totalOrders, setTotalOrders] = useState<number | null>(null);
  const [packageName, setPackageName] = useState<number | null>(null);
  const [totalAppointments, setTotalAppointments] = useState<number | null>(null);
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
        setUserId(user_id)
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
        icon: 'error',
        title: 'No Active Package',
        text: 'You must purchase a package before booking an appointment.',
      });
    }
  };

  const handleBookLabTests = () => {
    if ((totalOrders ?? 0) >= 1) {
      setShowLabTestModal(true);
    } else {
      Swal.fire({
        icon: 'error',
        title: 'No Active Package',
        text: 'You must purchase a package before booking a Lab test.',
      });
    }
  };
  return (
    <>
      <Header />
      <div className="min-vh-100 d-flex flex-column bg-light py-4">
        <div className="container flex-grow-1">
          <div className="d-flex justify-content-between align-items-center mb-4">
            <h4 className="fw-bold mb-0">Dashboard</h4>
            {totalOrders !== null && totalOrders >= 1 ? (
              <span className="badge bg-primary text-white px-3 py-2">
                Currently Active Package: {packageName}
              </span>
            ) : (
              <span className="badge bg-danger text-white px-3 py-2">
                No Active Package
              </span>
            )}
          </div>

          {loading ? (
            <p>Loading...</p>
          ) : (
            <div className="row">

              <div className="col-md-6 mb-4">
                <div className="card">
                  <div className="card-header bg-primary text-white">
                    Your Appointments
                  </div>
                  <div className="card-body">
                    <div className="d-flex justify-content-between mb-3">
                      <button type="button" className="btn btn-primary">View All</button>
                      <button type="button" className="btn btn-success" onClick={handleBookAppointment}>Book Appointment</button>
                    </div>

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
                            <td colSpan={4} className="text-center">No appointments found</td>
                          </tr>
                        )}
                      </tbody>
                    </table>

                  </div>
                </div>

              </div>

              <div className="col-md-6 mb-4">
                <div className="card">
                  <div className="card-header bg-primary text-white">
                    Lab Reports
                  </div>
                  <div className="card-body">
                    <div className="d-flex justify-content-between mb-3">
                      <button type="button" className="btn btn-primary">View All</button>
                      <button type="button" className="btn btn-success" onClick={handleBookLabTests}>Book Lab Test</button>
                    </div>

                    <table className="table table-striped">
                      <thead>
                        <tr>
                          <th>ID</th>
                          <th>Test Name</th>
                          <th>Test Date</th>
                          <th>Status</th>
                        </tr>
                      </thead>
                      <tbody>
                        {labtests.length > 0 ? (
                          labtests.map((test: any) => (
                            <tr key={test.id}>
                              <td>{test.id}</td>
                              <td>{test.test_name}</td>
                              <td>{test.test_date}</td>
                              <td>{test.status}</td>
                            </tr>
                          ))
                        ) : (
                          <tr>
                            <td colSpan={4} className="text-center">No lab tests found</td>
                          </tr>
                        )}
                      </tbody>
                    </table>

                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {showAppointmentModal && (
        <BookAppointmentModal show={showAppointmentModal} onHide={() => setShowAppointmentModal(false)} user_id={userId ? parseInt(userId) : 0}/>
      )}

      {showLabTestModal && (
        <LabTestsModal show={showLabTestModal} onHide={() => setShowLabTestModal(false)} />
      )}


    </>
  );
}
