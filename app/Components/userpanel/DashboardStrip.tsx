"use client";

import { useEffect, useState } from "react";
import { FaFlask, FaCalendarCheck, FaPills } from "react-icons/fa";
import { packageDetails } from "@/lib/constants";
interface DashboardStripProps {

  title: string;
}

export default function DashboardStrip({ title }: DashboardStripProps) {
  const [packageName, setPackageName] = useState<string>("");
  const [labtestvalue, setLabtestvalue] = useState<string>("");
  const [appointment, setAppointment] = useState<string>("");
  const [pharmacy, setPharmacy] = useState<string>("");

  useEffect(() => {
    const storedPackage = localStorage.getItem("package_name");
    if (storedPackage) {
      setPackageName(storedPackage);
    }
  }, []);


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
        body: JSON.stringify({ package_id: storedId , user_id:user_id}),
      });

      if (!response.ok) {
        throw new Error("Failed to fetch package details");
      }

      const data = await response.json();
      setLabtestvalue(data.labtestvalue)
       setAppointment(data.appointment)
        setPharmacy(data.pharmacy)
 
    } catch (error) {
      console.error("Error fetching package details:", error);
      setPackageName(""); // reset if fetch fails
    }
  };

  fetchPackageDetails();
}, []);




  return (
    <div className="mb-4">
      {/* Heading and Package Badge in One Line on Desktop, Stacked on Mobile */}
      <div className="d-flex flex-column flex-md-row justify-content-between align-items-start align-items-md-center mb-3 gap-2">
        <h4 className="fw-bold m-0">{title}</h4>
        {packageName && packageName !== "undefined" ? (
          <span className="badge bg-primary text-white px-3 py-2">
            Currently Active Package: {packageName}
          </span>
        ) : (
          <span className="badge bg-danger text-white px-3 py-2">
            No Active Package
          </span>
        )}
      </div>

      {/* Icon Boxes: Stack on small screens, inline on larger screens */}
      <div className="d-flex flex-column flex-md-row justify-content-center align-items-stretch align-items-md-center gap-3">
        <div className="rounded px-3 py-2 text-white bg-primary d-flex align-items-center gap-2 m-2">
          <FaFlask size={16} className="mr-1"/> 
          <span className="fw-semibold">Lab Credit : ₹{labtestvalue ?? 0}</span>
        </div>

        <div className="rounded px-3 py-2 text-white bg-success d-flex align-items-center gap-2 m-2">
          <FaCalendarCheck size={16} className="mr-1"/> 
          <span className="fw-semibold">Appointment Credits : {appointment}</span>
        </div>

        <div className="rounded px-3 py-2 text-white bg-danger d-flex align-items-center gap-2 m-2">
          <FaPills size={16} className="mr-1"/> 
          <span className="fw-semibold">Medicines Credits : {pharmacy}</span>
        </div>
      </div>
    </div>
  );
}
