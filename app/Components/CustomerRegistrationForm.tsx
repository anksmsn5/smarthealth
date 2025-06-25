"use client";

import { createCustomer, packagesApi } from "@/lib/constants";
import { useState, useEffect } from "react";
import toast from "react-hot-toast";

type CustomerForm = {
  name: string;
  email: string;
  phone: string;
  fatherName: string;
  address: string;
  state: string;
  city: string;
  country: string;
  pan: string;
  aadhar: string;
  dob: string;
  age: string;
  pincode: string;
};

type FamilyMember = {
  relation: string;
  name: string;
  age: string;
};

type Props = {
  referredby: number;
  onClose: () => void;
  onSuccess: () => void;
};

const relationOptions = [
  "Father",
  "Mother",
  "Spouse",
  "Son",
  "Daughter",
  "Other",
];

export default function CustomerRegistrationForm({ referredby, onClose, onSuccess }: Props) {
  const [formData, setFormData] = useState<CustomerForm>({
    name: "",
    email: "",
    phone: "",
    fatherName: "",
    address: "",
    state: "",
    city: "",
    country: "",
    pan: "",
    aadhar: "",
    dob: "",
    age: "",
    pincode: "",
  });

  const [familyMembers, setFamilyMembers] = useState<FamilyMember[]>([
    { relation: "", name: "", age: "" },
  ]);

  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [packages, setPackages] = useState<[]>([]);
  const [selectedPackage, setSelectedPackage] = useState<string>("");

  useEffect(() => {
    fetch(packagesApi)
      .then((res) => res.json())
      .then((data) => setPackages(data.data))
      .catch((err) => console.error("Failed to fetch packages:", err));
  }, []);

  useEffect(() => {
    if (formData.dob) {
      const dobDate = new Date(formData.dob);
      const today = new Date();
      let age = today.getFullYear() - dobDate.getFullYear();
      const m = today.getMonth() - dobDate.getMonth();
      if (m < 0 || (m === 0 && today.getDate() < dobDate.getDate())) age--;
      setFormData((prev) => ({ ...prev, age: age.toString() }));
    }
  }, [formData.dob]);

  const handleChange = async (
  e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
) => {
  const { name, value } = e.target;
  setFormData((prev) => ({ ...prev, [name]: value }));

  // Fetch address details on valid pincode
  if (name === "pincode" && /^\d{6}$/.test(value)) {
    try {
      const res = await fetch(`https://api.postalpincode.in/pincode/${value}`);
      const data = await res.json();

      if (data[0].Status === "Success" && data[0].PostOffice?.length) {
        const po = data[0].PostOffice[0];
        setFormData((prev) => ({
          ...prev,
          state: po.State,
          city: po.District,
          country: po.Country, // ✅ Fill country too
        }));
        setErrors((prev) => ({ ...prev, pincode: "" })); // clear any pincode error
      } else {
        setErrors((prev) => ({ ...prev, pincode: "Invalid pincode" }));
        setFormData((prev) => ({ ...prev, state: "", city: "", country: "" }));
      }
    } catch {
      setErrors((prev) => ({ ...prev, pincode: "Error fetching location" }));
      setFormData((prev) => ({ ...prev, state: "", city: "", country: "" }));
    }
  }
};


  const handleFamilyChange = (
    index: number,
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const updatedMembers = [...familyMembers];
    updatedMembers[index][e.target.name as keyof FamilyMember] = e.target.value;
    setFamilyMembers(updatedMembers);
  };

  const addFamilyMember = () =>
    setFamilyMembers((prev) => [...prev, { relation: "", name: "", age: "" }]);
  const removeFamilyMember = (index: number) =>
    setFamilyMembers((prev) => prev.filter((_, i) => i !== index));

  const validate = () => {
    const newErrors: { [key: string]: string } = {};
    if (!selectedPackage) newErrors.package = "Please select a package.";

    Object.entries(formData).forEach(([key, value]) => {
      if (!value && key !== "age") newErrors[key] = "This field is required";
    });

    if (formData.phone && !/^\d{10}$/.test(formData.phone)) newErrors.phone = "Phone must be 10 digits.";
    if (formData.aadhar && !/^\d{12}$/.test(formData.aadhar)) newErrors.aadhar = "Aadhar must be 12 digits.";
    if (formData.email && !/^\S+@\S+\.\S+$/.test(formData.email)) newErrors.email = "Invalid email address.";
    if (formData.pan && !/^[A-Z]{5}[0-9]{4}[A-Z]$/.test(formData.pan.toUpperCase())) newErrors.pan = "Invalid PAN format.";
    if (formData.pincode && !/^\d{6}$/.test(formData.pincode)) newErrors.pincode = "Pincode must be 6 digits.";

    familyMembers.forEach((m, i) => {
      if (!m.relation || !m.name || !m.age) newErrors[`familyMember-${i}`] = "All family member fields required.";
      else if (isNaN(Number(m.age)) || Number(m.age) <= 0) newErrors[`familyMember-${i}`] = "Valid family member age required.";
    });

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    try {
      const response = await fetch(createCustomer, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...formData, referredby, familyMembers, package_id: selectedPackage }),
      });

      const data = await response.json();
      if (response.ok && data.status) {
        onSuccess();
      } else {
        toast.error(data?.message || "Error submitting data.");
      }
    } catch (error: any) {
      toast.error(error.message || "Error occurred.");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="container my-4">
      <div className="row g-3">
        <div className="col-md-12">
          <label className="form-label">Select Package</label>
          <select
            className="form-control"
            value={selectedPackage}
            onChange={(e) => setSelectedPackage(e.target.value)}
          >
            <option value="">Select Package</option>
            {packages.map((pkg: any) => (
              <option key={pkg.id} value={pkg.id}>{pkg.package_name} (Rs. {pkg.amount})</option>
            ))}
          </select>
          {errors.package && <div className="text-danger">{errors.package}</div>}
        </div>

        {/* Input Fields */}
        {[
          { label: "Name", name: "name" },
          { label: "Email", name: "email" },
          { label: "Phone", name: "phone" },
          { label: "Father's Name", name: "fatherName" },
          { label: "PAN", name: "pan" },
          { label: "Aadhar Number", name: "aadhar" },
          { label: "Date of Birth", name: "dob", type: "date" },
        ].map(({ label, name, type = "text" }) => (
          <div className="col-md-6" key={name}>
            <label className="form-label">{label}</label>
            <input
              type={type}
              name={name}
              value={(formData as any)[name]}
              onChange={handleChange}
              className="form-control"
            />
            {errors[name] && <div className="text-danger">{errors[name]}</div>}
          </div>
        ))}

        <div className="col-md-6">
          <label className="form-label">Age</label>
          <input type="text" value={formData.age} disabled className="form-control" />
        </div>

        {/* Pincode */}
        <div className="col-md-6">
          <label className="form-label">Pincode</label>
          <input
            type="text"
            name="pincode"
            value={formData.pincode}
            onChange={handleChange}
            className="form-control"
          />
          {errors.pincode && <div className="text-danger">{errors.pincode}</div>}
        </div>

        {["state", "city", "country"].map((field) => (
          <div className="col-md-6" key={field}>
            <label className="form-label">{field.charAt(0).toUpperCase() + field.slice(1)}</label>
            <input
              name={field}
              value={(formData as any)[field]}
              onChange={handleChange}
              className="form-control" readOnly
            />
            {errors[field] && <div className="text-danger">{errors[field]}</div>}
          </div>
        ))}

        <div className="col-12">
          <label className="form-label">Address</label>
          <textarea
            name="address"
            value={formData.address}
            onChange={handleChange}
            className="form-control"
            rows={3}
          />
          {errors.address && <div className="text-danger">{errors.address}</div>}
        </div>
      </div>

      <hr className="my-4" />

      <div>
        <h4 className="mb-3">Family Members</h4>
        {familyMembers.map((member, index) => (
          <div key={index} className="row g-2 align-items-end mb-3">
            <div className="col-md-3">
              <label className="form-label">Relation</label>
              <select
                name="relation"
                value={member.relation}
                onChange={(e) => handleFamilyChange(index, e)}
                className="form-control"
              >
                <option value="">Select Relation</option>
                {relationOptions.map((rel) => (
                  <option key={rel} value={rel}>{rel}</option>
                ))}
              </select>
            </div>
            <div className="col-md-4">
              <label className="form-label">Name</label>
              <input
                name="name"
                value={member.name}
                onChange={(e) => handleFamilyChange(index, e)}
                className="form-control"
              />
            </div>
            <div className="col-md-3">
              <label className="form-label">Age</label>
              <input
                name="age"
                type="number"
                value={member.age}
                onChange={(e) => handleFamilyChange(index, e)}
                className="form-control"
              />
            </div>
            <div className="col-md-2">
              <button
                type="button"
                onClick={() => removeFamilyMember(index)}
                className="btn btn-outline-danger btn-sm mt-4"
              >
                Remove
              </button>
            </div>
            {errors[`familyMember-${index}`] && (
              <div className="text-danger w-100">{errors[`familyMember-${index}`]}</div>
            )}
          </div>
        ))}
        <button
          type="button"
          onClick={addFamilyMember}
          className="btn btn-outline-primary btn-sm"
        >
          + Add Family Member
        </button>
      </div>

      <div className="mt-4">
        <button type="submit" className="btn btn-primary">Submit</button>
      </div>
    </form>
  );
}
