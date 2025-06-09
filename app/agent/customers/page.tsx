'use client';

import React, { useEffect, useState } from 'react';
import DataTable from 'react-data-table-component';
import { Modal } from 'react-bootstrap';
import { agentsCustomer,deleteCustomer } from '@/lib/constants';
import CustomerForm from '@/app/Components/CustomerForm';
import Swal from 'sweetalert2';
const Customers = () => {
  const [data, setData] = useState<any[]>([]);
  const [filteredData, setFilteredData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [userId, setUserId] = useState<number | null>(null);
  const [search, setSearch] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editCustomer, setEditCustomer] = useState<any | null>(null); // for edit data

  // Get userId from localStorage
  useEffect(() => {
    const storedUserId = localStorage.getItem('id');
    if (storedUserId) {
      setUserId(Number(storedUserId));
    } else {
      console.warn('No user_id found in localStorage');
      setLoading(false);
    }
  }, []);

  // Fetch customers when userId is set
  useEffect(() => {
    if (userId) {
      fetchCustomerData(userId);
    }
  }, [userId]);

  const fetchCustomerData = async (id: number) => {
    setLoading(true);
    try {
      const res = await fetch(agentsCustomer, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ user_id: id }),
      });
      const result = await res.json();
      console.log('API response:', result);

      const customerList = Array.isArray(result.data) ? result.data : [result.data];

      setData(customerList);
      setFilteredData(customerList);
    } catch (err) {
      console.error('Error loading data:', err);
    } finally {
      setLoading(false);
    }
  };

  // Filter data on search input
  useEffect(() => {
    const filtered = data.filter((item) =>
      item.name?.toLowerCase().includes(search.toLowerCase())
    );
    setFilteredData(filtered);
  }, [search, data]);

  // Handle Edit button click
  const handleEdit = (customer: any) => {
 
    setEditCustomer(customer);
    setShowModal(true);
  };

  // Handle Delete button click
  const handleDelete = async (customer_id: number) => {
    const result = await Swal.fire({
      title: 'Are you sure?',
      text: 'This action will delete the user permanently!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Yes, delete it!',
    });
  
    if (result.isConfirmed) {
      try {
        const res = await fetch(deleteCustomer, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ customer_id: customer_id }),
        });
  
        const data = await res.json();
  
        if (data.status) {
          Swal.fire('Deleted!', data.message, 'success');
          if (userId) {
            fetchCustomerData(userId);
          }
        } else {
          Swal.fire('Error!', data.message, 'error');
        }
      } catch (error) {
        Swal.fire('Error!', 'Something went wrong.', 'error');
      }
    }
  };

  const columns = [
    {
      name: 'S.No.',
      cell: (_row: any, index: number) => index + 1,
      width: '80px',
    },
    { name: 'Customer Name', selector: (row: any) => row.name, sortable: true },
    { name: 'Email', selector: (row: any) => row.email, sortable: true },
    { name: 'Mobile', selector: (row: any) => row.mobile, sortable: true },
    {
      name: 'Actions',
      cell: (row: any) => (
        <>
          <button
            className="btn btn-sm btn-warning me-2"
            onClick={() => handleEdit(row)}
          >
            Edit
          </button>
          <button
            className="btn btn-sm btn-danger ml-5"
            onClick={() => handleDelete(row.id)}
          >
            Delete
          </button>
        </>
      ),
      ignoreRowClick: true,
      allowOverflow: true,
      button: true,
      width: '160px',
    },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-light">
      <div className="container flex-grow h-100">
        <div className="row banner-content">
          <div className="col-lg-12">
            <div className="row">
              <div className="col-md-12">
                <div className="card p-4 shadow mt-3 mb-3" style={{ width: '100%' }}>
                  <div className="d-flex justify-content-between align-items-center mb-4">
                    <h4 className="text-xl font-bold m-0">Customers</h4>
                    <button
                      className="btn btn-primary"
                      onClick={() => {
                        setEditCustomer(null);
                        setShowModal(true);
                      }}
                    >
                      Add Customer
                    </button>
                  </div>
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
      </div>

      {/* Modal for Add/Edit Customer */}
      <Modal show={showModal} onHide={() => setShowModal(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>{editCustomer ? 'Edit Customer' : 'Add Customer'}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <CustomerForm
            onClose={() => {
              setShowModal(false);
              if (userId) fetchCustomerData(userId);
            }}
            onSuccess={() => {
              setShowModal(false);
              if (userId) fetchCustomerData(userId);
            }}
            type={7}
            referredby={userId || ''}
            customerData={editCustomer} // pass data for edit, null for add
          />
        </Modal.Body>
      </Modal>
    </div>
  );
};

export default Customers;
