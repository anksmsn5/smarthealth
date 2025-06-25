'use client';

import React, { useEffect, useState } from 'react';
import DataTable from 'react-data-table-component';
import { userOrders } from '@/lib/constants';
import Header from '@/app/Components/Header';
import Footer from '@/app/Components/userpanel/Footer';

const PurchaseTable = () => {
  const [data, setData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [userId, setUserId] = useState<number | null>(null);
  const [search, setSearch] = useState('');

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
      const res = await fetch(userOrders, {
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

  useEffect(() => {
    const filtered = data.filter((item: any) =>
      item.package.package_name.toLowerCase().includes(search.toLowerCase())
    );
    setFilteredData(filtered);
  }, [search, data]);

  const columns = [
    { name: 'Package Name', selector: (row: any) => row.package.package_name, sortable: true },
    { name: 'Amount', selector: (row: any) => `₹${row.package.amount}`, sortable: true },
     { name: 'Payment ID', selector: (row: any) => row.razorpay_payment_id, sortable: true },
      { name: 'Order ID', selector: (row: any) => row.razorpay_order_id, sortable: true },
    { name: 'Purchased At', selector: (row: any) => new Date(row.created_at).toLocaleString(), sortable: true },
  ];

  return (
    <>
    <Header/>
    <div className="min-h-screen flex flex-col bg-light">
      <div className="container flex-grow h-100">
        <div className="row banner-content">
          <div className="col-lg-12">
            <div className="row">
              <div className="col-md-12">
              <div className="card p-4 shadow" style={{width: '100%' }}>
                <h4 className="text-xl font-bold mb-4">Purchase History</h4>

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
    </>
  );
};

export default PurchaseTable;
