'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import toast from 'react-hot-toast';
import { userRegister } from '@/lib/constants';

type FormFields = {
  id?: string;
  name: string;
  email: string;
  mobile: string;
  password: string;
  confirm_password: string;
};

type CustomerFormProps = {
  referredby?: string | number | undefined;
  type: string | number;
  onClose?: () => void;
  onSuccess?: () => void;
  customerData?: Partial<FormFields> & { id?: number };
};

const CustomerForm: React.FC<CustomerFormProps> = ({ referredby, type, onClose, customerData }) => {
  const [formData, setFormData] = useState<FormFields>({
    id: '',
    name: '',
    email: '',
    mobile: '',
    password: '',
    confirm_password: '',
  });

  const [errors, setErrors] = useState<Partial<Record<keyof FormFields, string>>>({});
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState<string | null>(null);
  const [apiError, setApiError] = useState<string | null>(null);

    useEffect(() => {
    if (customerData) {
      setFormData({
        id: customerData.id || '',
        name: customerData.name || '',
        email: customerData.email || '',
        mobile: customerData.mobile || '',
        password: '',
        confirm_password: '',
      });
    }
  }, [customerData]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    setErrors((prev) => ({
      ...prev,
      [name]: '',
    }));
  };

  const validate = () => {
    const newErrors: Partial<Record<keyof FormFields, string>> = {};

    if (!formData.name.trim()) newErrors.name = 'Name is required.';
    if (!formData.email.includes('@')) newErrors.email = 'Invalid email.';
    if (!formData.mobile.match(/^\d{10}$/)) newErrors.mobile = 'Mobile must be 10 digits.';

    const isEditMode = !!customerData?.id;
    const hasPassword =formData.password.trim().length > 0 || formData.confirm_password.trim().length > 0;

    
    if (!isEditMode || hasPassword) {
      if (formData.password.length < 6)
        newErrors.password = 'Password must be at least 6 characters.';
      if (formData.password !== formData.confirm_password)
        newErrors.confirm_password = 'Passwords do not match.';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSuccess(null);
    setApiError(null);

    if (!validate()) return;

    setLoading(true);

    try {
      const payload: any = {
        ...formData,
        type: type, // customer type
      };

      // Only include referredby if it exists and is a valid number
      if (referredby && !isNaN(Number(referredby))) {
        payload.referredby = Number(referredby);
      }

      const res = await fetch(userRegister, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (!res.ok) {
        toast.error(data?.message || 'Something went wrong.');
        return;
      }

      toast.success('Registration successful!');
      setFormData({
        id: '',
        name: '',
        email: '',
        mobile: '',
        password: '',
        confirm_password: '',
      });

      if (onClose) {
        onClose();
      }

    } catch (err) {
      setApiError('Network error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="row">
      {!onClose && (
        <div className="col-md-12 form-group">
          <h3>
            Create {type === 3 ? 'Agent' : type === 7 ? 'Customer' : 'User'} Account
          </h3>
        </div>
      )}

{(Object.keys(formData) as (keyof FormFields)[]).map((key) => {
  if (key === 'id') return null; // hide the id field

  return (
    <div className="col-md-12 form-group" key={key}>
      <label>
        {key.replace('_', ' ').replace(/\b\w/g, (l) => l.toUpperCase())}
      </label>
      <input
        type={key.includes('password') ? 'password' : 'text'}
        name={key}
        className="form-control"
        value={formData[key]}
        onChange={handleChange}
      />
      {errors[key] && <small className="text-danger">{errors[key]}</small>}
    </div>
  );
})}


        {apiError && (
          <div className="col-md-12 form-group text-danger">{apiError}</div>
        )}
        {success && (
          <div className="col-md-12 form-group text-success">{success}</div>
        )}

        <div className="col-md-12 form-group">
          <button type="submit" className="btn btn-primary" disabled={loading}>
            {loading ? 'Creating Account...' : 'Create Account'}
          </button>
          {onClose && (
        <button
          type="button"
          className="btn btn-secondary ml-5"
          onClick={onClose}
        >
          Close
        </button>
      )}
        </div>

      </div>
    </form>
  );
};

export default CustomerForm;
