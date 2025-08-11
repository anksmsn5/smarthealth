"use client";

import { useEffect, useState } from "react";
import { FaFlask, FaCalendarCheck, FaPills, FaHome } from "react-icons/fa";
import { packageDetails } from "@/lib/constants";
interface DashboardStripProps {
  title: string;
}

export default function DashboardStrip({ title }: DashboardStripProps) {
  const [packageName, setPackageName] = useState<string>("");
  const [labtestvalue, setLabtestvalue] = useState<string>("");
  const [appointment, setAppointment] = useState<string>("");
  const [pharmacy, setPharmacy] = useState<string>("");
  const [showModal, setShowModal] = useState(false);
  const [packages, setPackages] = useState<string[]>([]);

  useEffect(() => {
    const packageData = localStorage.getItem("packageName");
    if (!packageData) {
      getPackageData();
    } else {
      setPackageName(packageData || "");
    }
  }, []);

  const getPackageData = async () => {
    const storedId = localStorage.getItem("package");

    if (storedId) {
      const packageArray = JSON.parse(storedId);

      if (packageArray.length >= 1) {
        setPackages(packageArray);
        setShowModal(true);
      }
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
          body: JSON.stringify({ package_id: storedId, user_id: user_id }),
        });

        if (!response.ok) {
          throw new Error("Failed to fetch package details");
        }

        const data = await response.json();
        setLabtestvalue(data.labtestvalue);
        setAppointment(data.appointment);
        setPharmacy(data.pharmacy);
      } catch (error) {
        console.error("Error fetching package details:", error);
        setPackageName(""); // reset if fetch fails
      }
    };

    fetchPackageDetails();
  }, []);

  return (
    <>
      <div className="mb-4">
        <div className="d-flex flex-column flex-md-row justify-content-between align-items-start align-items-md-center mb-3 gap-2">
          <h4 className="fw-bold m-0">
            <a href="/userpanel/dashboard">
              <FaHome />
            </a>{" "}
            {title}
          </h4>
          {packageName && packageName !== "undefined" ? (
            <>
              <span className="badge bg-primary text-white px-3 py-2">
                Currently Active Package: {packageName}
              </span>
              <button
                className="badge bg-default px-3 py-2"
                onClick={() => {
                  getPackageData();
                }}
              >
                Switch Plan
              </button>
            </>
          ) : (
            <span className="badge bg-danger text-white px-3 py-2">
              No Active Package
            </span>
          )}
        </div>

        {/* Icon Boxes: Stack on small screens, inline on larger screens */}
        <div className="d-flex flex-column flex-md-row justify-content-center align-items-stretch align-items-md-center gap-3">
          <div className="rounded px-3 py-2 text-white bg-primary d-flex align-items-center gap-2 m-2">
            <FaFlask size={16} className="mr-1" />
            <span className="fw-semibold">
              Lab Credit : ₹{labtestvalue ?? 0}
            </span>
          </div>

          <div className="rounded px-3 py-2 text-white bg-success d-flex align-items-center gap-2 m-2">
            <FaCalendarCheck size={16} className="mr-1" />
            <span className="fw-semibold">
              Appointment Credits : {appointment}
            </span>
          </div>

          <div className="rounded px-3 py-2 text-white bg-danger d-flex align-items-center gap-2 m-2">
            <FaPills size={16} className="mr-1" />
            <span className="fw-semibold">Medicines Credits : {pharmacy}</span>
          </div>
        </div>
      </div>
      {showModal && (
        <>
          {/* Backdrop */}
          <div
            className="modal-backdrop fade show"
            style={{
              position: "fixed",
              top: 0,
              left: 0,
              backgroundColor: "rgb(0 0 0 / 87%)",
              zIndex: 1040,
            }}
          ></div>

          {/* Modal */}
          <div className="modal d-block">
            <div
              className="modal-dialog modal-dialog-scrollable"
              style={{ width: "100%", top: "25%" }}
            >
              <div
                className="modal-content"
                style={{
                  maxHeight: "90vh",
                  display: "flex",
                  flexDirection: "column",
                }}
              >
                <div className="modal-header bg-primary">
                  <h5 className="modal-title text-white">
                    Your Active Packages
                  </h5>
                </div>

                <div className="modal-body bg-white">
                  <div className="d-flex justify-content-center flex-wrap">
                    {packages.map((pkg: any, index: number) => (
                      <button
                        key={index}
                        className="btn m-2"
                        style={{
                          backgroundColor: "#4a90e2", // custom background color
                          color: "#fff", // white text
                          border: "none", // remove border
                          padding: "10px 20px",
                          borderRadius: "8px",
                          fontWeight: "500",
                        }}
                        onClick={() => {
                          localStorage.setItem("package_id", pkg.id);
                          localStorage.setItem("packageName", pkg.package_name);
                          window.location.reload();
                        }}
                      >
                        {pkg.package_name}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </>
  );
}
