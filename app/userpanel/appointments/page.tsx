'use client';

import React, { useEffect, useState } from 'react';
import DataTable from 'react-data-table-component';
import { Appointments, Prescription } from '@/lib/constants';
import Header from '@/app/Components/Header';
import Footer from '@/app/Components/userpanel/Footer';
import toast from 'react-hot-toast';
import DashboardStrip from '@/app/Components/userpanel/DashboardStrip';

const PurchaseTable = () => {
  const [data, setData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [userId, setUserId] = useState<number | null>(null);
  const [search, setSearch] = useState('');
 const [viewPrescriptionModal, setViewPrescriptionModal] = useState(false);
  const [prescriptionDetails, setPrescriptionDetails] = useState<any>(null);

const handleViewPrescription = async (row: any) => {
  try {
    const res = await fetch(Prescription, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ appointment_id: row.id }),
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


  useEffect(() => {
    const storedUserId = localStorage.getItem('id');
    if (storedUserId) {
      setUserId(Number(storedUserId));
    } else {
      console.warn('No user_id found in localStorage');
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
      const res = await fetch(Appointments, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ user_id: id }),
      });
      const result = await res.json();
      setData(result);
      console.log(result);
      setFilteredData(result);
    } catch (err) {
      console.error('Error loading data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const filtered = data.filter((item: any) =>
      item.doctor_name.toLowerCase().includes(search.toLowerCase())
    );
    setFilteredData(filtered);
  }, [search, data]);

 const columns = [
  {
    name: 'Appointment ID',
    selector: (row: any) => row.order_code,
    sortable: true,
  },
  {
    name: 'Doctor Name',
    selector: (row: any) => row.doctor_name,
    sortable: true,
  },
  {
    name: 'Date',
    selector: (row: any) => {
      const date = new Date(row.date);
      return `${date.getDate().toString().padStart(2, '0')}-${(date.getMonth() + 1)
        .toString()
        .padStart(2, '0')}-${date.getFullYear()}`;
    },
    sortable: true,
  },
  {
    name: 'Time',
    selector: (row: any) => {
      const [hours, minutes] = row.time.split(':');
      const date = new Date();
      date.setHours(+hours);
      date.setMinutes(+minutes);
      return date.toLocaleTimeString('en-US', {
        hour: '2-digit',
        minute: '2-digit',
        hour12: true,
      });
    },
    sortable: true,
  },
{
  name: 'Status',
  selector: (row: any) => row.status,
  sortable: true,
  cell: (row: any) => {
    let className = 'badge bg-success text-white'; // default

    switch (row.status) {
      case 'Booked':
        className = 'badge bg-danger text-white';
        break;
      case 'Approved':
        className = 'badge bg-primary text-white';
        break;
      case 'Cancelled':
        className = 'badge bg-danger text-white';
        break;
      case 'Re-Scheduled':
        className = 'badge bg-warning text-dark';
        break;
      case 'Prescribed':
        className = 'badge bg-success text-white';
        break;
    }

    return (
      <div className="d-flex align-items-center gap-2">
        <span className={className}>{row.status}</span>
        {row.status === 'Prescribed' && (
          <span
            className="badge bg-info text-white ml-1"
            style={{ cursor: 'pointer' }}
            onClick={() => handleViewPrescription(row)}
          >
            View
          </span>
        )}
                {row.status === 'Approved' && (
          <a href={`${row.gmeet_link}`} target="_blank"
            className="badge bg-warning text-white ml-1">
            Meeting Link
          </a>
        )}
      </div>
    );
  },
}


];


  return (
    <>
    <Header/>
    <div className="min-vh-100 d-flex flex-column bg-light py-4">
      <div className="container flex-grow h-100">
         <DashboardStrip title={"List of Appointments"} />
        <div className="row banner-content">
          <div className="col-lg-12">
            <div className="row">
              <div className="col-md-12">
              <div className="card p-4 shadow" style={{width: '100%' }}>
               

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
                        style={{ width: '30%' }}
                        placeholder="Search "
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
    <Footer/>
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
    </>
  );
};

export default PurchaseTable;
