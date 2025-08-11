import { assignPackagetoExisting, myCustomer, packagesApi } from '@/lib/constants';
import React, { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
type Props = {
 
  onClose: () => void;
  onSuccess: () => void;
};
const Existing = ({ onClose, onSuccess }: Props) => {
  const [customers, setCustomers] = useState([]);
  const [packages, setPackages] = useState([]);

  const [formData, setFormData] = useState({
    customerId: '',
    packageId: '',
  });

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchDropdowns();
  }, []);

  const fetchDropdowns = async () => {
    try {
      const userId = localStorage.getItem('id');

      const [customersRes, packagesRes] = await Promise.all([
        fetch(myCustomer, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ userId }),
        }),
        fetch(packagesApi),
      ]);

      const customersData = await customersRes.json();
      const packagesData = await packagesRes.json();
 
      setCustomers(customersData.data);
      setPackages(packagesData.data);
    } catch (error) {
      console.error('Error fetching dropdown data:', error);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
  const userId = localStorage.getItem('id');
   const submissionData = {
      ...formData,
      userId,
    };

    try {
      const res = await fetch(assignPackagetoExisting, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(submissionData),
      });
const result = await res.json();
     if (res.ok && result.status === true) {
    toast.success("Package Assigned Successfully.");
    onSuccess();
  } else {
    const errorMsg = result.message || "Package Assignment Failed.";
    toast.error(errorMsg);
  }
    } catch (error) {
        toast.error("Package Assigned Failed.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="p-4 border rounded">
      <h3 className="mb-3">Assign package to  Customer</h3>

      {/* Customer dropdown */}
      <div className="mb-3">
        <label htmlFor="customerId">Customer</label>
        <select
          name="customerId"
          value={formData.customerId}
          onChange={handleChange}
          className="form-control"
          required
        >
          <option value="">-- Select Customer --</option>
          {customers.map((customer: any) => (
            <option key={customer.id} value={customer.id}>
              {customer.name} (M: {customer.mobile})
            </option>
          ))}
        </select>
      </div>

      {/* Package dropdown */}
      <div className="mb-3">
        <label htmlFor="packageId">Package</label>
        <select
          name="packageId"
          value={formData.packageId}
          onChange={handleChange}
          className="form-control"
          required
        >
          <option value="">-- Select Package --</option>
          {packages.map((pkg: any) => (
            <option key={pkg.id} value={pkg.id}>
              {pkg.package_name} ( INR {pkg.amount})
            </option>
          ))}
        </select>
      </div>

      <button type="submit" className="btn btn-primary" disabled={loading}>
        {loading ? 'Submitting...' : 'Submit'}
      </button>
    </form>
  );
};

export default Existing;
