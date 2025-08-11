'use client';

import React, { useEffect, useState } from 'react';
import DataTable from 'react-data-table-component';
import { baseUrl, prescriptionList } from '@/lib/constants';
import Header from '@/app/Components/Header';
import Footer from '@/app/Components/userpanel/Footer';
import DashboardStrip from '@/app/Components/userpanel/DashboardStrip';
import { FaDownload } from 'react-icons/fa';

const PurchaseTable = () => {
  const [hasMounted, setHasMounted] = useState(false); // 👈 Hydration fix
  const [data, setData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [userId, setUserId] = useState<number | null>(null);
  const [search, setSearch] = useState('');


  useEffect(() => {
    setHasMounted(true); // 👈 Hydration fix
  }, []);

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
      const res = await fetch(prescriptionList, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ user_id: id }),
      });
      const result = await res.json();
    
      setData(result.prescriptions);
      setFilteredData(result.prescriptions); // 👈 important
    } catch (err) {
      console.error('Error loading data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const filtered = data.filter((item: any) =>
      item?.package_name?.toLowerCase().includes(search.toLowerCase())
    );
    setFilteredData(filtered);
  }, [search, data]);

  const columns = [
    
    {
      name: 'Package Name',
      selector: (row: any) => row.package_name,
      sortable: true,
    },
     {
      name: 'Family Member Name',
      selector: (row: any) => row.member,
      sortable: true,
    },
{
  name: 'Upload Date',
  selector: (row: any) => {
    if (!row.uploaded_at) return 'N/A';

    const isoDateStr = row.uploaded_at.replace(' ', 'T');
    const date = new Date(isoDateStr);

    if (isNaN(date.getTime())) return 'Invalid Date';

    const day = date.getDate().toString().padStart(2, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0'); // Months are 0-indexed
    const year = date.getFullYear();
    const hours = date.getHours().toString().padStart(2, '0');
    const minutes = date.getMinutes().toString().padStart(2, '0');
    const seconds = date.getSeconds().toString().padStart(2, '0');

    return `${day}-${month}-${year} ${hours}:${minutes}:${seconds}`;
  },
  sortable: true,
},
    {
      name: 'Address',
      selector: (row: any) => row.address,
      sortable: true,
    },
    {
      name: 'State',
      selector: (row: any) => row.state,
      sortable: true,
    },
    {
      name: 'City',
      selector: (row: any) => row.city,
      sortable: true,
    },
    {
      name: 'Pincode',
      selector: (row: any) => row.pincode,
      sortable: true,
    },
    {
      name: 'Status',
      selector: (row: any) => row.status,
      sortable: true,
      cell: (row: any) => {
        let className = 'badge bg-success text-white';

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
             
              <a href={`${baseUrl}${row.file_path}`} target="_blank" className="badge bg-warning text-white ml-1">
              <FaDownload/>
              </a>
       
          </div>
        );
      },
    },
  ];

  // ✅ Hydration error prevention
  if (!hasMounted) return null;

  return (
    <>
      <Header />
      <div className="min-vh-100 d-flex flex-column bg-light py-4">
        <div className="container-fluid flex-grow h-100">
          <DashboardStrip title="List of Prescription(s)" />
          <div className="row banner-content">
            <div className="col-lg-12">
              <div className="card p-4 shadow" style={{ width: '100%' }}>
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
      <Footer />
    </>
  );
};

export default PurchaseTable;
