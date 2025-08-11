"use client";

import { useEffect, useState } from "react";
import DefaultDoctor from "../../public/defaultdoctor.jpg";
import {
  FamilyMembers,
  bookAppointments,
  doctorsListApi,
  reportUrl,
} from "@/lib/constants";
import { FaPlus } from "react-icons/fa";
import toast from "react-hot-toast";
import Swal from "sweetalert2";

interface Doctor {
  id: number;
  doctor_id:number;
  name: string;
  image: string;
  address: string;
  qualification_names: [];
  specialization_names: [];
}

export default function DoctorsList() {
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [isformSubmit, setIsformSubmit] = useState(false);
  const [selectedDoctor, setSelectedDoctor] = useState<Doctor | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [address, setAddress] = useState("");
  const [pincode, setPincode] = useState("");
  const [state, setState] = useState("");
  const [city, setCity] = useState("");
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [familyMembers, setFamilyMembers] = useState<any[]>([]);
  const [selectedMemberId, setSelectedMemberId] = useState("");

  const [patientName, setPatientName] = useState("");
  const [mobile, setMobile] = useState("");
  const [email, setEmail] = useState("");
  const [age, setAge] = useState("");
  const [gender, setGender] = useState("");
  const [relation, setRelation] = useState("");
  const [errors, setErrors] = useState<any>({});

  const validateForm = () => {
    const newErrors: any = {};
    if (!patientName.trim()) newErrors.patientName = "Patient name is required";
    if (!mobile.trim()) newErrors.mobile = "Mobile number is required";
    else if (!/^\d{10}$/.test(mobile)) newErrors.mobile = "Enter a valid 10-digit mobile number";
    if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) newErrors.email = "Invalid email";
    if (!age) newErrors.age = "Age is required";
    if (!relation) newErrors.relation = "Relation is required";
    if (!gender) newErrors.gender = "Gender is required";
    if (!address.trim()) newErrors.address = "Address is required";
    if (!pincode) newErrors.pincode = "Pincode is required";
    else if (!/^\d{6}$/.test(pincode)) newErrors.pincode = "Enter a valid 6-digit pincode";
    if (!date) newErrors.date = "Appointment Date is required";
    if (!time) newErrors.time = "Appointment Time is required";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  useEffect(() => {
    if (pincode.length === 6) {
      fetch(`https://api.postalpincode.in/pincode/${pincode}`)
        .then((res) => res.json())
        .then((data) => {
          if (data[0].Status === "Success") {
            const location = data[0].PostOffice[0];
            setState(location.State);
            setCity(location.District);
          } else {
            setState("");
            setCity("");
            toast.error("Invalid Pincode");
          }
        })
        .catch(() => toast.error("Failed to fetch location info"));
    }
  }, [pincode]);

  useEffect(() => {
    const fetchFamilyMembers = async () => {
      const userId = localStorage.getItem("id");
      if (!userId) return;

      try {
        const res = await fetch(FamilyMembers, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ user_id: userId }),
        });

        const data = await res.json();
        if (res.ok) setFamilyMembers(data.data);
        else setFamilyMembers([]);
      } catch (err) {
        console.error("Failed to fetch family members:", err);
        setFamilyMembers([]);
      }
    };

    if (showModal) fetchFamilyMembers();
  }, [showModal]);

  const handleMemberSelect = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedId = e.target.value;
    setSelectedMemberId(selectedId);
    const member = familyMembers.find((m) => String(m.id) === selectedId);
    setMobile(localStorage.getItem("mobile") || "");
    setEmail(localStorage.getItem("email") || "");
    setAddress(localStorage.getItem("address") || "");

    if (member) {
      setPatientName(member.name || "");
      setAge(member.age || "");
      setGender(member.gender || "");
      setRelation(member.relation || "");
    } else {
      setPatientName("");
      setAge("");
      setMobile("");
      setEmail("");
      setGender("");
      setRelation("");
    }
  };

 const loadDoctors = async (pg: number = 1, query: string = "") => {
  setLoading(true);
  try {
    const res = await fetch(`${doctorsListApi}?page=${pg}&search=${encodeURIComponent(query)}`);
    const data: Doctor[] = await res.json();
    setDoctors(data);
    setHasMore(data.length === 10); // or use the exact page size
  } catch (error) {
    console.error("Failed to load doctors:", error);
    setHasMore(false);
  } finally {
    setLoading(false);
  }
};


  useEffect(() => {
    const debounce = setTimeout(() => {
      setPage(1);
      loadDoctors(1, search);
    }, 300);
    return () => clearTimeout(debounce);
  }, [search]);

  const handlePageChange = (newPage: number) => {
    if (newPage < 1) return;
    setPage(newPage);
    loadDoctors(newPage, search);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;
    const user_id = localStorage.getItem("id");
    console.log(selectedDoctor);
    if (!user_id || !selectedDoctor) {
      toast.error(`Required data missing`);
      return;
    }
const package_id=localStorage.getItem('package_id');
    const payload = {
      patient_name: patientName,
      user_id,
      mobile,
      email,
      age,
      gender,
      relation,
      address,
      state,
      city,
      pincode,
      date,
      time,
      doctor_id: selectedDoctor.doctor_id,
      package_id
    };
console.log(payload);
 
    setIsformSubmit(true);
    try {
      const res = await fetch(bookAppointments, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const result = await res.json();
      if (res.ok) {
        Swal.fire({
          title: "Success!",
          text: `Appointment Booked.\nOrder Code: ${result.order_code}`,
          icon: "success",
          confirmButtonText: "OK",
        }).then(() => {
          window.location.href = "/userpanel/appointments";
        });

        setShowModal(false);
        setSelectedDoctor(null);
        setPatientName("");
        setMobile("");
        setEmail("");
        setAge("");
        setGender("Male");
        setIsformSubmit(false);
      } else {
        toast.error("Failed to submit: " + result.message);
        setIsformSubmit(false);
      }
    } catch (err) {
      console.error(err);
      toast.error("Error submitting patient form.");
      setIsformSubmit(false);
    }
  };

  return (
    <div className="row justify-content-center">
      <div className="col-md-12">
        <input
          type="text"
          placeholder="Search doctors..."
          className="form-control mb-3"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        <div className="bg-white rounded p-0" style={{ minHeight: "300px" }}>
          {doctors.length === 0 && !loading && (
            <p className="text-center text-muted">No doctors found</p>
          )}
        {doctors.map((doctor) => (
  <div key={doctor.id} className="border rounded mb-3 p-3 shadow-sm">
    <div className="row align-items-center">
      {/* Column 1: Image */}
      <div className="col-md-2 text-center">
        <img
          src={`${reportUrl}${doctor.image}`}
          alt={doctor.name}
          className="rounded"
          style={{
            width: "80px",
            height: "80px",
            objectFit: "cover",
          }}
          onError={(e) => {
            e.currentTarget.onerror = null;
            e.currentTarget.src = DefaultDoctor.src;
          }}
        />
      </div>

      {/* Column 2: Name, Address, Qualifications, Specializations */}
      <div className="col-md-4">
        <h5 className="mb-1">{doctor.name}</h5>
        <p className="mb-1">{doctor.address}</p>

        {/* Qualifications */}
       
      </div>

     <div className="col-md-4">
 <div className="mb-1">
          {doctor.qualification_names?.length > 0 ? (
            doctor.qualification_names.map((q, idx) => (
              <span key={`q-${idx}`} className="badge bg-secondary me-1 m-1 text-white">
                {q}
              </span>
            ))
          ) : (
            <span className="text-muted">No Qualifications Listed</span>
          )}
        </div>

        {/* Specializations */}
        <div className="mb-1">
          {doctor.specialization_names?.length > 0 ? (
            doctor.specialization_names.map((s, idx) => (
              <span key={`s-${idx}`} className="badge bg-primary me-1 m-1 text-white">
                {s}
              </span>
            ))
          ) : (
            <span className="text-muted">No Specializations Listed</span>
          )}
        </div>

     </div>
    <div className="col-md-2 text-end">
  <button
    className="btn btn-success btn-sm"
    onClick={() => {
      setSelectedDoctor(doctor);
      setShowModal(true);
    }}
  >
    Book Appointment
  </button>
</div>
    </div>
  </div>
))}

          {loading && <p className="text-center mt-3">Loading...</p>}
        </div>

        <nav className="mt-3">
          <ul className="pagination justify-content-center mb-0">
            <li className={`page-item ${page === 1 ? "disabled" : ""}`}>
              <button className="page-link" onClick={() => handlePageChange(page - 1)}>Previous</button>
            </li>
            <li className="page-item disabled">
              <span className="page-link">Page {page}</span>
            </li>
            <li className={`page-item ${!hasMore ? "disabled" : ""}`}>
              <button className="page-link" onClick={() => handlePageChange(page + 1)}>Next</button>
            </li>
          </ul>
        </nav>
      </div>

      {/* MODAL */}
      {showModal && (
        <div className="modal d-block" tabIndex={-1} style={{ backgroundColor: "rgba(0,0,0,0.5)" }}>
          <div className="modal-dialog modal-lg">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Enter Patient Details</h5>
                <button type="button" className="btn-close" onClick={() => setShowModal(false)}></button>
              </div>
              <div className="modal-body" style={{ maxHeight: "80vh", overflowY: "auto" }}>
                {familyMembers.length > 0 && (
                  <div className="mb-3">
                    <label className="form-label">Select Family Member</label>
                    <select className="form-control" value={selectedMemberId} onChange={handleMemberSelect}>
                      <option value="">-- Select Member --</option>
                      {familyMembers.map((member) => (
                        <option key={member.id} value={member.id}>
                          {member.name} ({member.relation || "Self"})
                        </option>
                      ))}
                    </select>
                  </div>
                )}
                <form onSubmit={handleSubmit}>
  <div className="row">
    <div className="col-md-6 mb-3">
      <label className="form-label">Patient Name</label>
      <input
        type="text"
        className={`form-control ${errors.patientName ? "is-invalid" : ""}`}
        value={patientName}
        onChange={(e) => setPatientName(e.target.value)}
      />
      {errors.patientName && <div className="invalid-feedback">{errors.patientName}</div>}
    </div>

    <div className="col-md-6 mb-3">
      <label className="form-label">Mobile</label>
      <input
        type="text"
        className={`form-control ${errors.mobile ? "is-invalid" : ""}`}
        value={mobile}
        onChange={(e) => setMobile(e.target.value)}
      />
      {errors.mobile && <div className="invalid-feedback">{errors.mobile}</div>}
    </div>

    <div className="col-md-6 mb-3">
      <label className="form-label">Email</label>
      <input
        type="email"
        className={`form-control ${errors.email ? "is-invalid" : ""}`}
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      {errors.email && <div className="invalid-feedback">{errors.email}</div>}
    </div>

    <div className="col-md-3 mb-3">
      <label className="form-label">Age</label>
      <input
        type="number"
        className={`form-control ${errors.age ? "is-invalid" : ""}`}
        value={age}
        onChange={(e) => setAge(e.target.value)}
      />
      {errors.age && <div className="invalid-feedback">{errors.age}</div>}
    </div>

    <div className="col-md-3 mb-3">
      <label className="form-label">Gender</label>
      <select
        className={`form-control ${errors.gender ? "is-invalid" : ""}`}
        value={gender}
        onChange={(e) => setGender(e.target.value)}
      >
        <option value="">Select</option>
        <option value="Male">Male</option>
        <option value="Female">Female</option>
      </select>
      {errors.gender && <div className="invalid-feedback">{errors.gender}</div>}
    </div>

    <div className="col-md-6 mb-3">
      <label className="form-label">Relation</label>
      <select
        className={`form-control ${errors.relation ? "is-invalid" : ""}`}
        value={relation}
        onChange={(e) => setRelation(e.target.value)}
      >
        <option value="">Select</option>
        <option value="Self">Self</option>
        <option value="Father">Father</option>
        <option value="Mother">Mother</option>
        <option value="Spouse">Spouse</option>
        <option value="Child">Child</option>
        <option value="Sibling">Sibling</option>
      </select>
      {errors.relation && <div className="invalid-feedback">{errors.relation}</div>}
    </div>

    <div className="col-md-6 mb-3">
      <label className="form-label">Address</label>
      <textarea
        className={`form-control ${errors.address ? "is-invalid" : ""}`}
        rows={2}
        value={address}
        onChange={(e) => setAddress(e.target.value)}
      />
      {errors.address && <div className="invalid-feedback">{errors.address}</div>}
    </div>

    <div className="col-md-4 mb-3">
      <label className="form-label">Pincode</label>
      <input
        type="text"
        className={`form-control ${errors.pincode ? "is-invalid" : ""}`}
        value={pincode}
        onChange={(e) => setPincode(e.target.value)}
      />
      {errors.pincode && <div className="invalid-feedback">{errors.pincode}</div>}
    </div>

    <div className="col-md-4 mb-3">
      <label className="form-label">State</label>
      <input type="text" className="form-control" value={state} readOnly />
    </div>

    <div className="col-md-4 mb-3">
      <label className="form-label">City</label>
      <input type="text" className="form-control" value={city} readOnly />
    </div>

    <div className="col-md-6 mb-3">
      <label className="form-label">Appointment Date</label>
      <input
        type="date"
        className={`form-control ${errors.date ? "is-invalid" : ""}`}
        value={date}
        onChange={(e) => setDate(e.target.value)}
      />
      {errors.date && <div className="invalid-feedback">{errors.date}</div>}
    </div>

    <div className="col-md-6 mb-3">
      <label className="form-label">Appointment Time</label>
      <input
        type="time"
        className={`form-control ${errors.time ? "is-invalid" : ""}`}
        value={time}
        onChange={(e) => setTime(e.target.value)}
      />
      {errors.time && <div className="invalid-feedback">{errors.time}</div>}
    </div>
  </div>

  <div className="modal-footer">
    <button type="submit" className="btn btn-success" disabled={isformSubmit}>
      {isformSubmit ? "Booking..." : "Book Appointment"}
    </button>
    <button type="button" className="btn btn-secondary" onClick={() => setShowModal(false)}>
      Cancel
    </button>
  </div>
</form>

              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
