"use client";

import React, { useEffect, useState } from "react";
import DataTable from "react-data-table-component";
import {
  DoctorAppointments,
  Prescription,
  SavePrescription,
} from "@/lib/constants";
import Header from "@/app/Components/Header";
import Footer from "@/app/Components/userpanel/Footer";
import { FaPlus } from "react-icons/fa";
import Swal from "sweetalert2";
import toast from "react-hot-toast";

const PurchaseTable = () => {
  const [data, setData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [userId, setUserId] = useState<number | null>(null);
  const [search, setSearch] = useState("");
  const [selectedAppointment, setSelectedAppointment] = useState<any>(null);
  const [showModal, setShowModal] = useState(false);
  const [viewPrescriptionModal, setViewPrescriptionModal] = useState(false);
  const [prescriptionDetails, setPrescriptionDetails] = useState<any>(null);
  const [problems, setProblems] = useState("");
  const [diagnosis, setDiagnosis] = useState("");
  const [tests, setTests] = useState("");
  const [finalRemarks, setFinalRemarks] = useState("");
  const [medicineFields, setMedicineFields] = useState([
    { name: "", frequency: "", remarks: "" },
  ]);

  useEffect(() => {
    const storedUserId = localStorage.getItem("id");
    if (storedUserId) {
      setUserId(Number(storedUserId));
    } else {
      console.warn("No user_id found in localStorage");
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (userId) {
      fetchPurchaseData(userId);
    }
  }, [userId]);

  const fetchPurchaseData = async (id: number) => {
    try {
      const res = await fetch(DoctorAppointments, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ user_id: id }),
      });
      const result = await res.json();
      setData(result);
      setFilteredData(result);
    } catch (err) {
      console.error("Error loading data:", err);
    } finally {
      setLoading(false);
    }
  };

  const addMedicineRow = () => {
    setMedicineFields([
      ...medicineFields,
      { name: "", frequency: "", remarks: "" },
    ]);
  };

  const removeMedicineRow = (index: number) => {
    const updated = [...medicineFields];
    updated.splice(index, 1);
    setMedicineFields(updated);
  };

  const handleMedicineChange = (
    index: number,
    field: string,
    value: string
  ) => {
    const updated = [...medicineFields];
    (updated[index] as any)[field] = value;
    setMedicineFields(updated);
  };

  useEffect(() => {
    const filtered = data.filter((item: any) =>
      item.doctor_name.toLowerCase().includes(search.toLowerCase())
    );
    setFilteredData(filtered);
  }, [search, data]);

  const openModal = (appointment: any) => {
    setSelectedAppointment(appointment);
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setSelectedAppointment(null);
  };

  const columns = [
    {
      name: "Appointment ID",
      selector: (row: any) => row.order_code,
      sortable: true,
    },
    {
      name: "Patient Name",
      selector: (row: any) => row.doctor_name,
      sortable: true,
    },
    {
      name: "Date",
      selector: (row: any) => {
        const date = new Date(row.date);
        return `${date.getDate().toString().padStart(2, "0")}-${(
          date.getMonth() + 1
        )
          .toString()
          .padStart(2, "0")}-${date.getFullYear()}`;
      },
      sortable: true,
    },
    {
      name: "Time",
      selector: (row: any) => {
        const [hours, minutes] = row.time.split(":");
        const date = new Date();
        date.setHours(+hours);
        date.setMinutes(+minutes);
        return date.toLocaleTimeString("en-US", {
          hour: "2-digit",
          minute: "2-digit",
          hour12: true,
        });
      },
      sortable: true,
    },
    {
      name: "Status",
      cell: (row: any) => {
        let className = "badge bg-success text-white";
        switch (row.status) {
          case "Booked":
            className = "badge bg-danger text-white";
            break;
          case "Approved":
            className = "badge bg-primary text-white";
            break;
          case "Cancelled":
            className = "badge bg-danger text-white";
            break;
          case "Re-Scheduled":
            className = "badge bg-warning text-dark";
            break;
        }
        const handleClick = () => {
          if (row.status === "Approved") {
            openModal(row);
          } else if (row.status === "Prescribed") {
            fetchPrescription(row.id);
          }
        };

      return (
  <>
    <span
      className={className} 
      style={{
        cursor: row.status === "Approved" ? "pointer" : "default",
        marginRight: row.status === "Prescribed" ? "10px" : "0",
      }}
      onClick={handleClick}
    >
      {row.status}
    </span>

    {row.status === "Prescribed" && (
      <span
        className='badge bg-success text-white'
        onClick={handleClick}
        style={{ cursor: "pointer" }}
      >
        View Prescription
      </span>
    )}
  </>
);

      },
      sortable: true,
    },
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log(selectedAppointment);
    const payload = {
      appointment_id: selectedAppointment?.id,
      user_id: selectedAppointment?.user_id,
      doctor_id: selectedAppointment?.doctor_id,
      problems,
      diagnosis,
      medicines: medicineFields,
      tests,
      final_remarks: finalRemarks,
    };

    try {
      const res = await fetch(SavePrescription, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (data.success) {
        toast.success("Prescription submitted successfully.");
        closeModal();
        location.reload();
      } else {
        toast.error("Error Prescription submission. Check all fields");
      }
    } catch (err) {
      console.error(err);
      alert("An error occurred.");
    }
  };

  const fetchPrescription = async (appointmentId: number) => {
    try {
      const res = await fetch(Prescription, {
        // 🔁 Replace with actual endpoint
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ appointment_id: appointmentId }),
      });
      const result = await res.json();
      if (result.success) {
        setPrescriptionDetails(result.data);

        setViewPrescriptionModal(true);
      } else {
        toast.error("Prescription not found.");
      }
    } catch (err) {
      console.error("Error fetching prescription:", err);
      toast.error("Error fetching prescription");
    }
  };

  return (
    <>
      <Header />
      <div className="min-h-screen flex flex-col bg-light">
        <div className="container flex-grow h-100">
          <div className="row banner-content">
            <div className="col-lg-12">
              <div className="row">
                <div className="col-md-12">
                  <div className="card p-4 shadow" style={{ width: "100%" }}>
                    <h4 className="text-xl font-bold mb-4">
                      Doctor Appointments
                    </h4>

                    <DataTable
                      columns={columns}
                      data={filteredData}
                      progressPending={loading}
                      pagination
                      responsive
                      subHeader
                      subHeaderComponent={
                        <div className="d-flex w-100">
                          <input
                            type="text"
                            className="form-control me-auto"
                            style={{ width: "30%" }}
                            placeholder="Search"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                          />
                        </div>
                      }
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      {viewPrescriptionModal && prescriptionDetails && (
        <>
          {/* Backdrop */}
          <div
            className="modal-backdrop fade show"
            style={{
              position: "fixed",
              top: 0,
              left: 0,
              backgroundColor: "rgba(0, 0, 0, 0.5)",
              zIndex: 1040,
            }}
          ></div>

          {/* Modal */}
          <div className="modal d-block">
            <div
              className="modal-dialog modal-dialog-scrollable"
              style={{ maxWidth: "900px", width: "100%" }}
            >
              <div
                className="modal-content"
                style={{
                  maxHeight: "90vh",
                  display: "flex",
                  flexDirection: "column",
                }}
              >
                <div className="modal-header">
                  <h5 className="modal-title">Prescription Details</h5>
                  <button
                    type="button"
                    className="btn-close"
                    aria-label="Close"
                    onClick={() => setViewPrescriptionModal(false)}
                  />
                </div>

                <div className="modal-body bg-white">
                  <div className="row">
                    
 
                    <div className="col-md-6">
                      <p>
                        <strong>Patient Name:</strong>{" "}
                        {prescriptionDetails.appointment.patient_name}
                      </p>
                      <p>
                        <strong>Patient Age:</strong>{" "}
                        {prescriptionDetails.appointment.age} Years
                      </p>
                      
                       <p>
                        <strong>Mobile No:</strong> {prescriptionDetails.appointment.mobile}
                      </p>
                       <p>
                        <strong>Address:</strong> {prescriptionDetails.appointment.address}
                      </p>
                    </div>
                    <div className="col-md-6">
                      <p>
                        <strong>Problems:</strong>{" "}
                        {prescriptionDetails.problems}
                      </p>
                      <p>
                        <strong>Diagnosis:</strong>{" "}
                        {prescriptionDetails.diagnosis}
                      </p>
                      <p>
                        <strong>Tests:</strong> {prescriptionDetails.tests}
                      </p>
                    </div>
                  </div>

                  <hr />
                  <h6>Medicines</h6>

                  <table className="table table-striped medicinetable">
                    <tr>
                      <th>Sr. No.</th>
                      <th>Medicine Name</th>
                      <th>Frequency</th>
                      <th>Remarks</th>
                    </tr>
                    {prescriptionDetails.medicines &&
                    prescriptionDetails.medicines.length > 0 ? (
                      prescriptionDetails.medicines.map(
                        (med: any, index: number) => (
                          <tr key={index}>
                            <td>{index+1}</td>
                            <td>{med.name}</td>
                            <td>{med.frequency}</td>
                            <td>{med.remarks}</td>
                          </tr>
                        )
                      )
                    ) : (
                      <p>No medicines listed.</p>
                    )}
                  </table>

                  <p>
                    <strong>Final Remarks:</strong>{" "}
                    {prescriptionDetails.final_remarks}
                  </p>
                </div>

                <div className="modal-footer">
                  <button
                    type="button"
                    className="btn btn-secondary"
                    onClick={() => setViewPrescriptionModal(false)}
                  >
                    Close
                  </button>
                </div>
              </div>
            </div>
          </div>
        </>
      )}

      {/* ✅ React Controlled Modal */}
      {showModal && (
        <>
          {/* Backdrop */}
          <div
            className="modal-backdrop fade show"
            style={{
              position: "fixed",
              top: 0,
              left: 0,

              backgroundColor: "rgba(0, 0, 0, 0.5)",
              zIndex: 1040,
            }}
          ></div>

          {/* Modal */}
          <div className="modal d-block">
            <div
              className="modal-dialog modal-dialog-scrollable"
              style={{
                maxWidth: "900px", // 👈 increase as needed (e.g., 900px or even 100%)
                width: "100%",
              }}
            >
              <div
                className="modal-content"
                style={{
                  maxHeight: "90vh", // limit height of modal overall
                  display: "flex",
                  flexDirection: "column",
                }}
              >
                <div className="modal-header">
                  <h5 className="modal-title">Prescription Form</h5>
                  <button
                    type="button"
                    className="btn-close"
                    aria-label="Close"
                    onClick={closeModal}
                  />
                </div>
                <form
                  onSubmit={handleSubmit}
                  style={{
                    overflowY: "auto",
                    flex: "1 1 auto", // fill remaining height
                  }}
                >
                  <div className="modal-body bg-white">
                    {selectedAppointment && (
                      <>
                        <p>
                          <strong>Appointment ID:</strong>{" "}
                          {selectedAppointment.order_code}
                        </p>
                        <p>
                          <strong>Patient Name:</strong>{" "}
                          {selectedAppointment.doctor_name}
                        </p>
                        <p>
                          <strong>Patient Age:</strong>{" "}
                          {selectedAppointment.age} Years
                        </p>
                      </>
                    )}

                    {/* Problem and Diagnose */}
                    <div className="mb-3">
                      <label className="form-label">Problems</label>
                      <input
                        type="text"
                        className="form-control"
                        placeholder="Enter problems"
                        value={problems}
                        onChange={(e) => setProblems(e.target.value)}
                      />
                    </div>
                    <div className="mb-3">
                      <label className="form-label">Diagnosis</label>
                      <input
                        type="text"
                        className="form-control"
                        placeholder="Enter diagnosis"
                        value={diagnosis}
                        onChange={(e) => setDiagnosis(e.target.value)}
                      />
                    </div>

                    {/* Dynamic Medicine Grid */}
                    <div className="mb-3">
                      <label className="form-label">Medicines</label>
                      {medicineFields.map((field, index) => (
                        <div className="row mb-2" key={index}>
                          <div className="col-md-4">
                            <input
                              type="text"
                              className="form-control"
                              placeholder="Medicine Name"
                              value={field.name}
                              onChange={(e) =>
                                handleMedicineChange(
                                  index,
                                  "name",
                                  e.target.value
                                )
                              }
                            />
                          </div>
                          <div className="col-md-4">
                            <select
                              className="form-control"
                              value={field.frequency}
                              onChange={(e) =>
                                handleMedicineChange(
                                  index,
                                  "frequency",
                                  e.target.value
                                )
                              }
                            >
                              <option value="">Select Frequency</option>
                              <option value="Once Daily">Once Daily</option>
                              <option value="Twice Daily">Twice Daily</option>
                              <option value="Thrice Daily">Thrice Daily</option>
                              <option value="As Needed">As Needed</option>
                            </select>
                          </div>
                          <div className="col-md-3">
                            <input
                              type="text"
                              className="form-control"
                              placeholder="Remarks"
                              value={field.remarks}
                              onChange={(e) =>
                                handleMedicineChange(
                                  index,
                                  "remarks",
                                  e.target.value
                                )
                              }
                            />
                          </div>
                          <div className="col-md-1 d-flex align-items-center justify-content-end">
                            {index > 0 && (
                              <button
                                type="button"
                                className="btn btn-danger btn-sm"
                                onClick={() => removeMedicineRow(index)}
                              >
                                &minus;
                              </button>
                            )}
                          </div>
                        </div>
                      ))}
                      <button
                        type="button"
                        className="btn btn-secondary btn-sm"
                        onClick={addMedicineRow}
                      >
                        <FaPlus /> Add More
                      </button>
                    </div>

                    {/* Final Fields */}
                    <div className="mb-3">
                      <label className="form-label">Tests to be done</label>
                      <input
                        type="text"
                        className="form-control"
                        placeholder="Enter tests"
                        value={tests}
                        onChange={(e) => setTests(e.target.value)}
                      />
                    </div>
                    <div className="mb-3">
                      <label className="form-label">Final Remarks</label>
                      <textarea
                        className="form-control"
                        placeholder="Enter final remarks"
                        value={finalRemarks}
                        onChange={(e) => setFinalRemarks(e.target.value)}
                      ></textarea>
                    </div>
                  </div>
                  <div className="modal-footer">
                    <button
                      type="button"
                      className="btn btn-secondary"
                      onClick={closeModal}
                    >
                      Close
                    </button>
                    <button type="submit" className="btn btn-primary">
                      Save Prescription
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </>
      )}

      <Footer />
    </>
  );
};

export default PurchaseTable;
