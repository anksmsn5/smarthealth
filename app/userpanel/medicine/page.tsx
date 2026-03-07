"use client";
import Header from "@/app/Components/Header";
import LabTestList from "@/app/Components/LabTestList";
import DashboardStrip from "@/app/Components/userpanel/DashboardStrip";
import Footer from "@/app/Components/userpanel/Footer";
import { FamilyMembers, uploadPrescription } from "@/lib/constants";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import Swal from "sweetalert2";

export default function Medicine() {
  const [formData, setFormData] = useState({
    address: "",
    pincode: "",
    state: "",
    city: "",
    selectedMemberId: "",
    user_id: null,
    package_id: null,
    file: null as File | null,
  });

  const [familyMembers, setFamilyMembers] = useState<any[]>([]);
  const [selectedMemberId, setSelectedMemberId] = useState("");
  const [loading, setLoading] = useState(false); // Loader state

  const handleChange = (e: any) => {
    const { name, value, files } = e.target;
    if (name === "file") {
      setFormData({ ...formData, file: files[0] });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const resetForm = () => {
    setFormData({
      address: "",
      pincode: "",
      state: "",
      city: "",
      selectedMemberId: "",
      user_id: null,
      package_id: null,
      file: null,
    });
    (document.getElementById("file-input") as HTMLInputElement).value = "";
  };

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    setLoading(true); // Start loader

    const user_id = localStorage.getItem("id");
    const package_id = localStorage.getItem("package_id");

    if (!formData.file) {
      Swal.fire("Warning", "Please upload a file.", "warning");
      setLoading(false);
      return;
    }

    if (!user_id) {
      Swal.fire("Warning", "User not logged in.", "warning");
      setLoading(false);
      return;
    }

    if (!package_id) {
      Swal.fire("Warning", "Package Not Selected.", "warning");
      setLoading(false);
      return;
    }

    const allowedTypes = ["application/pdf", "image/jpeg", "image/jpg"];
    if (!allowedTypes.includes(formData.file.type)) {
      Swal.fire("Error", "Only PDF, JPG, and JPEG files are allowed.", "error");
      setLoading(false);
      return;
    }

    const data = new FormData();
    data.append("file", formData.file);
    data.append("selectedMemberId", formData.selectedMemberId);
    data.append("package_id", package_id);
    data.append("user_id", user_id);
    data.append("address", formData.address);
    data.append("pincode", formData.pincode);
    data.append("state", formData.state);
    data.append("city", formData.city);

    try {
      const res = await fetch(uploadPrescription, {
        method: "POST",
        body: data,
      });

      const result = await res.json();

      if (result.status) {
        Swal.fire({
          title: "Success",
          text: result.message,
          icon: "success",
          showCancelButton: true,
          confirmButtonText: "View Prescriptions",
          cancelButtonText: "Close",
        }).then((swalResult) => {
          if (swalResult.isConfirmed) {
            window.location.href = "/userpanel/prescriptions";
          }
        });

        resetForm();
      } else {
        Swal.fire("Error", result.message, "error");
      }
    } catch (error) {
      console.error("Upload failed", error);
      Swal.fire("Error", "Something went wrong.", "error");
    } finally {
      setLoading(false); // Stop loader
    }
  };

  const handleMemberSelect = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedId = e.target.value;
    setFormData((prev) => ({
      ...prev,
      selectedMemberId: selectedId,
    }));
  };

  useEffect(() => {
    if (formData.pincode.length === 6) {
      fetch(`https://api.postalpincode.in/pincode/${formData.pincode}`)
        .then((res) => res.json())
        .then((data) => {
          if (data[0].Status === "Success") {
            const location = data[0].PostOffice[0];
            setFormData((prev) => ({
              ...prev,
              state: location.State,
              city: location.District,
            }));
          } else {
            setFormData((prev) => ({
              ...prev,
              state: "",
              city: "",
            }));
            toast.error("Invalid Pincode");
          }
        })
        .catch(() => toast.error("Failed to fetch location info"));
    }
  }, [formData.pincode]);

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
    const storedAddress = localStorage.getItem("address");
    if (storedAddress) {
      setFormData((prev) => ({
        ...prev,
        address: storedAddress,
      }));
    }

     const storedState = localStorage.getItem("state");
    if (storedState) {
      setFormData((prev) => ({
        ...prev,
        state: storedState,
      }));
    }

     const storedCity = localStorage.getItem("city");
    if (storedCity) {
      setFormData((prev) => ({
        ...prev,
        city: storedCity,
      }));
    }

     const storedPincode = localStorage.getItem("pincode");
    if (storedPincode) {
      setFormData((prev) => ({
        ...prev,
        pincode: storedPincode,
      }));
    }
    fetchFamilyMembers();
  }, []);

  return (
    <>
      <Header />
      <div className="min-vh-100 d-flex justify-content-center align-items-start bg-light py-4">
        <div className="container">
          <div className="row justify-content-center">
            <div className="col-lg-12 col-md-12">
              <DashboardStrip title={"Upload Prescription"} />
              <div className="card shadow-sm border-0">
                <div className="card-header bg-primary text-white d-flex justify-content-between align-items-center">
                  <h4 className="mb-0 text-white">Upload Prescription</h4>
                  <a
                    href="/userpanel/prescriptions"
                    className="btn btn-light btn-sm text-primary"
                  >
                    View Prescriptions
                  </a>
                </div>

                <div className="card-body">
                  <p>
                    Please upload prescription so that Smart Health team can
                    provide you the desired medicines.
                  </p>
                  <form onSubmit={handleSubmit} encType="multipart/form-data">
                    <div className="row">
                      <div className="form-group mb-3 col-md-12">
                        <label className="form-label">
                          Select Family Member
                        </label>
                        <select
                          className="form-control"
                           value={formData.selectedMemberId}
                          onChange={handleMemberSelect}
                        >
                          <option value="">-- Select Member --</option>
                          {familyMembers.map((member) => (
                            <option key={member.id} value={member.name}>
                              {member.name} ({member.relation || "Self"})
                            </option>
                          ))}
                        </select>
                      </div>

                      <div className="form-group mb-3 col-md-12">
                        <label>Prescription (PDF, JPG, JPEG only)</label>
                        <input
                          type="file"
                          className="form-control"
                          name="file"
                          id="file-input"
                          accept=".pdf,.jpg,.jpeg"
                          onChange={handleChange}
                          required
                        />
                      </div>

                      <div className="form-group mb-3 col-md-12">
                        <label>Address</label>
                        <textarea
                          className="form-control"
                          name="address"
                          value={formData.address}
                          onChange={handleChange}
                          required
                        ></textarea>
                      </div>

                      <div className="form-group mb-3 col-md-4">
                        <label>Pincode</label>
                        <input
                          type="text"
                          className="form-control"
                          name="pincode"
                          value={formData.pincode}
                          onChange={handleChange}
                          required
                        />
                      </div>

                      <div className="form-group mb-3 col-md-4">
                        <label>State</label>
                        <input
                          type="text"
                          className="form-control"
                          name="state"
                          value={formData.state}
                          onChange={handleChange}
                          required
                        />
                      </div>

                      <div className="form-group mb-3 col-md-4">
                        <label>City</label>
                        <input
                          type="text"
                          className="form-control"
                          name="city"
                          value={formData.city}
                          onChange={handleChange}
                          required
                        />
                      </div>

                      <div className="form-group mb-3 col-md-12 text-end">
                        <button
                          type="submit"
                          className="btn btn-primary"
                          disabled={loading} // Disable when loading
                        >
                          {loading ? (
                            <span>
                              <i className="fa fa-spinner fa-spin"></i> Uploading...
                            </span>
                          ) : (
                            "Submit Prescription"
                          )}
                        </button>
                      </div>
                    </div>
                  </form>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}
