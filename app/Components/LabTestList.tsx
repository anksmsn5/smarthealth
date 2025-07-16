"use client";

import { useEffect, useState } from "react";
import {
  FamilyMembers,
  orderTests,
  packageDetails,
  testLists,
} from "@/lib/constants";
import { FaMinus, FaPlus } from "react-icons/fa";
import toast from "react-hot-toast";
import Swal from "sweetalert2";

interface LabTest {
  id: number;
  test_name: string;
  price: number;
  discount: number;
  collection_charges: number;
  total: number;
}

export default function LabTestList() {
  const [tests, setTests] = useState<LabTest[]>([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [isformSubmit, setIsformSubmit] = useState(false);
  const [selectedTests, setSelectedTests] = useState<LabTest[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [address, setAddress] = useState("");
  const [pincode, setPincode] = useState("");
  const [state, setState] = useState("");
  const [city, setCity] = useState("");

  const [date, setDate] = useState("");
  const [time, setTime] = useState("");

  const [labtestvalue, setLabtestvalue] = useState<string>("");
  const [appointment, setAppointment] = useState<string>("");
  const [pharmacy, setPharmacy] = useState<string>("");

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
    else if (!/^\d{10}$/.test(mobile))
      newErrors.mobile = "Enter a valid 10-digit mobile number";

    if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))
      newErrors.email = "Invalid email";

    if (!age) newErrors.age = "Age is required";

    if (!relation) newErrors.relation = "Relation is required";

    if (!gender) newErrors.gender = "Gender is required";

    if (!address.trim()) newErrors.address = "Address is required";

    if (!pincode) newErrors.pincode = "Pincode is required";
    else if (!/^\d{6}$/.test(pincode))
      newErrors.pincode = "Enter a valid 6-digit pincode";

    setErrors(newErrors);

    return Object.keys(newErrors).length === 0;
  };

  useEffect(() => {
    const fetchStateCity = async () => {
      if (pincode.length === 6) {
        try {
          const res = await fetch(
            `https://api.postalpincode.in/pincode/${pincode}`
          );
          const data = await res.json();

          if (data[0].Status === "Success") {
            const location = data[0].PostOffice[0];
            setState(location.State);
            setCity(location.District);
          } else {
            setState("");
            setCity("");
            toast.error("Invalid Pincode");
          }
        } catch (err) {
          console.error("Error fetching state/city from pincode", err);
          toast.error("Failed to fetch location info");
        }
      }
    };

    fetchStateCity();
  }, [pincode]);

  useEffect(() => {
    const fetchFamilyMembers = async () => {
      const userId = localStorage.getItem("id");
      if (!userId) return;

      try {
        const res = await fetch(FamilyMembers, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ user_id: userId }),
        });

        const data = await res.json();
        if (res.ok) {
          console.log(data.data);
          setFamilyMembers(data.data);
        } else {
          setFamilyMembers([]);
        }
      } catch (err) {
        console.error("Failed to fetch family members:", err);
        setFamilyMembers([]);
      }
    };

    if (showModal) {
      fetchFamilyMembers();
    }
  }, [showModal]);

  const handleMemberSelect = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedId = e.target.value;
    setSelectedMemberId(selectedId);
    const mobile = localStorage.getItem("mobile");
    const email = localStorage.getItem("email");
    const address = localStorage.getItem("address");
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      const value = localStorage.getItem(key || "");
      console.log(`${key}: ${value}`);
    }
    setAddress(address || "");
    setEmail(email || "");
    setMobile(mobile || "");
    const member = familyMembers.find((m) => String(m.id) === selectedId);
    console.log("Selected member:", member);

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

  useEffect(() => {
    const fetchPackageDetails = async () => {
      const storedId = localStorage.getItem("package_id");
      const user_id = localStorage.getItem("id");
      if (!storedId) return;

      try {
        const response = await fetch(packageDetails, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ package_id: storedId, user_id }),
        });

        if (!response.ok) {
          toast.error("Error in fetching package details!");
        }

        const data = await response.json();
        setLabtestvalue(data.labtestvalue);
        setAppointment(data.appointment);
        setPharmacy(data.pharmacy);
      } catch (error) {
        toast.error("Error in fetching package details!");
      }
    };

    fetchPackageDetails();
  }, []);

  useEffect(() => {
    const stored = localStorage.getItem("selectedLabTests");
    if (stored) {
      setSelectedTests(JSON.parse(stored));
    }
  }, []);

  const loadTests = async (pg: number = 1, query: string = "") => {
    setLoading(true);
    try {
      const res = await fetch(
        `${testLists}?page=${pg}&search=${encodeURIComponent(query)}`
      );
      const data: LabTest[] = await res.json();
      setTests(data);
      setHasMore(data.length > 0);
    } catch (error) {
      console.error("Failed to load tests:", error);
      setHasMore(false);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const delayDebounce = setTimeout(() => {
      setPage(1);
      loadTests(1, search);
    }, 300);
    return () => clearTimeout(delayDebounce);
  }, [search]);

  const handlePageChange = (newPage: number) => {
    if (newPage < 1) return;
    setPage(newPage);
    loadTests(newPage, search);
  };

  const handleAdd = (test: LabTest) => {
    const alreadyAdded = selectedTests.find((t) => t.id === test.id);
    if (alreadyAdded) {
      toast.error("This test is already added.");
      return;
    }

    const baseAmount = selectedTests.reduce(
      (sum, t) => sum + parseFloat(t.total as any),
      0
    );
    const collectionCharge =
      selectedTests.length === 0
        ? parseFloat(test.collection_charges as any)
        : 0;
    const newTestTotal = parseFloat(test.total as any);
    const updatedTotalCost = baseAmount + newTestTotal + collectionCharge;

    const availableCredits = parseFloat(labtestvalue || "0");

    if (updatedTotalCost > availableCredits) {
      toast.error(`Insufficient lab credits. Max: ₹${availableCredits}`);
      return;
    }

    const updatedTests = [...selectedTests, test];
    setSelectedTests(updatedTests);
    localStorage.setItem("selectedLabTests", JSON.stringify(updatedTests));
    toast.success(`Test Added.`);
  };

  const handleRemove = (testId: number) => {
    const updatedTests = selectedTests.filter((t) => t.id !== testId);
    setSelectedTests(updatedTests);
    localStorage.setItem("selectedLabTests", JSON.stringify(updatedTests));
    toast.error(`Test removed.`);
  };

  const baseAmount = selectedTests.reduce(
    (sum, test) => sum + parseFloat(test.total as any),
    0
  );

  const collectionCharge =
    selectedTests.length > 0
      ? parseFloat(selectedTests[0].collection_charges as any)
      : 0;

  const totalAmount = baseAmount + collectionCharge;
  const availableCredits = parseFloat(labtestvalue || "0");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;
    const user_id = localStorage.getItem("id");
    setIsformSubmit(true);

    if (!user_id) {
      toast.error(`User not logged In`);
      return;
    }

    if (totalAmount > availableCredits) {
      toast.error("Total amount exceeds available lab credits.");
      return;
    }

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
      test_ids: selectedTests.map((test) => test.id),
      total_amount: totalAmount,
    };

    try {
      const res = await fetch(orderTests, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      const result = await res.json();

      if (res.ok) {
        Swal.fire({
          title: "Success!",
          text: `Order Placed Successfully.\nYour Order Code is: ${result.order_code}`,
          icon: "success",
          confirmButtonText: "OK",
        }).then(() => {
          window.location.href = "/userpanel/test-orders";
        });

        setShowModal(false);
        setPatientName("");
        setMobile("");
        setEmail("");
        setAge("");
        setGender("Male");
        setSelectedTests([]);
        localStorage.removeItem("selectedLabTests");
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
        <div className="alert alert-info d-flex justify-content-between align-items-center">
          <div>
            <strong>Tests Total:</strong> ₹{baseAmount} <br />
            <strong>Collection Charges:</strong> ₹{collectionCharge} <br />
            <strong>Total Amount:</strong>{" "}
            <span
              className={
                totalAmount > availableCredits ? "text-danger fw-bold" : ""
              }
            >
              ₹{totalAmount}
            </span>
          </div>
          {totalAmount > 0 && totalAmount <= availableCredits ? (
            <button
              className="btn btn-success btn-sm"
              onClick={() => setShowModal(true)}
            >
              Proceed
            </button>
          ) : totalAmount > availableCredits ? (
            <span className="text-danger">Exceeds available credits</span>
          ) : null}
        </div>

        <input
          type="text"
          placeholder="Search lab tests..."
          className="form-control mb-3"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        <div className="bg-white rounded p-0" style={{ minHeight: "300px" }}>
          {tests.length === 0 && !loading && (
            <p className="text-center text-muted">No tests found</p>
          )}

          {tests.map((test) => {
            const isAdded = selectedTests.some((t) => t.id === test.id);
            return (
              <div
                key={test.id}
                className="border rounded mb-3 p-3 position-relative shadow-sm"
              >
                <div className="d-flex justify-content-between align-items-start">
                  <div>
                    <h6 className="mb-2">{test.test_name}</h6>
                    <div className="d-flex flex-wrap gap-2 align-items-center">
                      <span className="text-muted">
                        <del>₹{test.price}</del>
                      </span>
                      <span className="badge text-black">₹{test.total}</span>
                      <span className="badge bg-danger text-white">
                        {test.discount}% OFF
                      </span>
                    </div>
                    <div className="mt-2">
                      <span className="badge bg-secondary text-white">
                        Collection Charges: ₹{test.collection_charges} Per Order
                      </span>
                    </div>
                  </div>

                  {isAdded ? (
                    <button
                      className="btn btn-sm btn-danger"
                      onClick={() => handleRemove(test.id)}
                    >
                      <FaMinus /> Remove
                    </button>
                  ) : (
                    <button
                      className="btn btn-sm btn-primary"
                      onClick={() => handleAdd(test)}
                    >
                      <FaPlus /> Add
                    </button>
                  )}
                </div>
              </div>
            );
          })}

          {loading && <p className="text-center mt-3">Loading...</p>}
        </div>

        <nav className="mt-3">
          <ul className="pagination justify-content-center mb-0">
            <li className={`page-item ${page === 1 ? "disabled" : ""}`}>
              <button
                className="page-link"
                onClick={() => handlePageChange(page - 1)}
              >
                Previous
              </button>
            </li>
            <li className="page-item disabled">
              <span className="page-link">Page {page}</span>
            </li>
            <li className={`page-item ${!hasMore ? "disabled" : ""}`}>
              <button
                className="page-link"
                onClick={() => handlePageChange(page + 1)}
              >
                Next
              </button>
            </li>
          </ul>
        </nav>
      </div>

      {/* MODAL */}
      {showModal && (
        <div
          className="modal d-block"
          tabIndex={-1}
          style={{ backgroundColor: "rgba(0,0,0,0.5)" }}
        >
          <div className="modal-dialog modal-lg">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Enter Patient Details</h5>
                <button
                  type="button"
                  className="btn-close"
                  onClick={() => setShowModal(false)}
                ></button>
              </div>
              <div
                className="modal-body"
                style={{
                  maxHeight: "80vh",
                  overflowY: "auto",
                }}
              >
                {familyMembers.length > 0 && (
                  <div className="mb-3">
                    <label className="form-label">Select Family Member</label>
                    <select
                      className="form-control"
                      value={selectedMemberId}
                      onChange={handleMemberSelect}
                    >
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
                    <div className="mb-3 col-md-12">
                      <label className="form-label">Patient Name</label>
                      <input
                        type="text"
                        className="form-control"
                        value={patientName}
                        onChange={(e) => setPatientName(e.target.value)}
                      />
                      {errors.patientName && (
                        <div className="text-danger">{errors.patientName}</div>
                      )}
                    </div>
                    <div className="mb-3 col-md-6">
                      <label className="form-label">Mobile Number</label>
                      <input
                        type="tel"
                        className="form-control"
                        value={mobile}
                        onChange={(e) => setMobile(e.target.value)}
                      />
                      {errors.mobile && (
                        <div className="text-danger">{errors.mobile}</div>
                      )}
                    </div>
                    <div className="mb-3 col-md-6">
                      <label className="form-label">Email</label>
                      <input
                        type="email"
                        className="form-control"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                      />
                      {errors.email && (
                        <div className="text-danger">{errors.email}</div>
                      )}
                    </div>
                    <div className="mb-3  col-md-4">
                      <label className="form-label">Age</label>
                      <input
                        type="number"
                        className="form-control"
                        value={age}
                        onChange={(e) => setAge(e.target.value)}
                      />
                      {errors.age && (
                        <div className="text-danger">{errors.age}</div>
                      )}
                    </div>
                    <div className="mb-3 col-md-4">
                      <label className="form-label">Relation</label>
                      <select
                        className="form-control"
                        value={relation}
                        onChange={(e) => setRelation(e.target.value)}
                      >
                        <option value="">Select Relation</option>
                        <option value="Father">Father</option>
                        <option value="Mother">Mother</option>
                        <option value="Son">Son</option>
                        <option value="Daughter">Daughter</option>
                        <option value="Spouse">Spouse</option>
                        <option value="Sibling">Sibling</option>
                        <option value="Self">Self</option>
                        <option value="Other">Other</option>
                      </select>
                      {errors.relation && (
                        <div className="text-danger">{errors.relation}</div>
                      )}
                    </div>
                    <div className="mb-3 col-md-4">
                      <label className="form-label">Gender</label>
                      <select
                        className="form-control"
                        value={gender}
                        onChange={(e) => setGender(e.target.value)}
                      >
                        <option value="">Select</option>
                        <option value="Male">Male</option>
                        <option value="Female">Female</option>
                        <option value="Other">Other</option>
                      </select>
                      {errors.gender && (
                        <div className="text-danger">{errors.gender}</div>
                      )}
                    </div>
                    <div className="mb-3 col-md-12">
                      <label className="form-label">Address</label>
                      <textarea
                        className="form-control"
                        rows={2}
                        value={address}
                        onChange={(e) => setAddress(e.target.value)}
                      />
                      {errors.address && (
                        <div className="text-danger">{errors.address}</div>
                      )}
                    </div>

                    <div className="mb-3 col-md-4">
                      <label className="form-label">Pincode</label>
                      <input
                        type="text"
                        className="form-control"
                        value={pincode}
                        onChange={(e) => setPincode(e.target.value)}
                        maxLength={6}
                      />
                      {errors.pincode && (
                        <div className="text-danger">{errors.pincode}</div>
                      )}
                    </div>

                    <div className="mb-3 col-md-4">
                      <label className="form-label">State</label>
                      <input
                        type="text"
                        className="form-control"
                        value={state}
                        readOnly
                      />
                      {errors.state && (
                        <div className="text-danger">{errors.state}</div>
                      )}
                    </div>

                    <div className="mb-3 col-md-4">
                      <label className="form-label">City</label>
                      <input
                        type="text"
                        className="form-control"
                        value={city}
                        readOnly
                      />
                      {errors.city && (
                        <div className="text-danger">{errors.city}</div>
                      )}
                    </div>

                    <div className="mb-3 col-md-4">
                      <label className="form-label">Collection Date</label>
                      <input
                        type="date"
                        className="form-control"
                        value={date}
                         onChange={(e) => setDate(e.target.value)}
                      />
                      {errors.city && (
                        <div className="text-danger">{errors.date}</div>
                      )}
                    </div>

                    <div className="mb-3 col-md-4">
                      <label className="form-label">Collection Time</label>
                      <input
                        type="time"
                        className="form-control"
                        value={time}
                         onChange={(e) => setTime(e.target.value)}
                      />
                      {errors.city && (
                        <div className="text-danger">{errors.time}</div>
                      )}
                    </div>

                    <div className="mb-3  col-md-12 d-flex">
                      <button
                        type="submit"
                        className="btn btn-primary"
                        disabled={isformSubmit}
                      >
                        {isformSubmit ? (
                          <>
                            <span
                              className="spinner-border spinner-border-sm me-2"
                              role="status"
                            />
                            Processing...
                          </>
                        ) : (
                          "Book Now"
                        )}
                      </button>
                      <button
                        type="button"
                        className="btn btn-danger ml-2"
                        onClick={() => setShowModal(false)}
                      >
                        Close
                      </button>
                    </div>
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
