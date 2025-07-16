'use client';

import React, { useEffect, useState } from 'react';
import DataTable from 'react-data-table-component';
import { reportUrl, TestOrderList } from '@/lib/constants';
import Header from '@/app/Components/Header';
import Footer from '@/app/Components/userpanel/Footer';

const TesOrderTable = () => {
  const [data, setData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [userId, setUserId] = useState<number | null>(null);
  const [search, setSearch] = useState('');

  // Fetch user ID from localStorage
  useEffect(() => {
    const storedUserId = localStorage.getItem('id');
    if (storedUserId) {
      setUserId(Number(storedUserId));
    } else {
      console.warn('No user_id found in localStorage');
      setLoading(false);
    }
  }, []);

  // Fetch lab test order data
  useEffect(() => {
    if (userId) {
      fetchPurchaseData(userId);
    }
  }, [userId]);

  const fetchPurchaseData = async (id: number) => {
    try {
      const res = await fetch(TestOrderList, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ user_id: id }),
      });
      const result = await res.json();
      setData(result.data);
      setFilteredData(result.data);
    } catch (err) {
      console.error('Error loading data:', err);
    } finally {
      setLoading(false);
    }
  };

  // Search filtering
  useEffect(() => {
    const filtered = data.filter((item: any) =>
      item.patient_name.toLowerCase().includes(search.toLowerCase()) ||
      item.order_code.toLowerCase().includes(search.toLowerCase())
    );
    setFilteredData(filtered);
  }, [search, data]);

  // Define columns
const columns = [
 {
  name: 'Order ID',
  selector: (row: any) => (
    <div className="d-flex flex-column">
      <span>{row.order_code}</span>
      {row.status === 'Uploaded' && row.report_path && (
        <a
          href={`${reportUrl}${row.report_path}`}
          className="badge bg-success text-white mt-1"
          download
          target="_blank"
          rel="noopener noreferrer"
        >
          <i className="fa fa-download me-1"></i>Download
        </a>
      )}
    </div>
  ),
  sortable: true,
}

,
  { name: 'Patient Name', selector: (row: any) => row.patient_name, sortable: true },
  { name: 'Email', selector: (row: any) => row.email, sortable: true },
  { name: 'Mobile', selector: (row: any) => row.mobile, sortable: true },
  { name: 'Age', selector: (row: any) => row.age, sortable: true },
  { name: 'Amount', selector: (row: any) => `₹${row.amount}`, sortable: true },
  { name: 'Schedule', selector: (row: any) =>
    {
      return (
        <>
     <span className="badge bg-success text-white mt-1">{row.date}</span><br/>
     <span className="badge bg-primary text-white mt-1">{row.time}</span>
     </>
    )}, sortable: true },
{
  name: 'Status',
  selector: (row: any) => {
    let btnClass = '';

    switch (row.status) {
      case 'Booked':
        btnClass = 'btn-danger';
        break;
      case 'Approved':
        btnClass = 'btn-primary';
        break;
      case 'In Collection':
        btnClass = 'btn-warning';
        break;
      case 'Collected':
        btnClass = 'btn-info';
        break;
      case 'Uploaded':
        btnClass = 'btn-success';
        break;
      default:
        btnClass = 'btn-secondary';
    }

    return (
      <button className={`btn btn-sm ${btnClass}`}>
        {row.status}
      </button>
    );
  },
  sortable: true,
}

];

  return (
    <>
      <Header />
      <div className="min-h-screen flex flex-col bg-light">
        <div className="container flex-grow h-100">
          <div className="row banner-content">
            <div className="col-lg-12">
              <div className="row">
                <div className="col-md-12">
                  <div className="card p-4 shadow" style={{ width: '100%' }}>
                    <h4 className="text-xl font-bold mb-4">Lab Test Order History</h4>

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
                            placeholder="Search by name or order ID"
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
      <Footer />
    </>
  );
};

export default TesOrderTable;
