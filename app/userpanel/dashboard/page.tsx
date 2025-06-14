"use client";

import { useEffect, useState } from "react";
import { userDashboard } from "@/lib/constants";
import Header from "@/app/Components/Header";

export default function Dashboard() {
  const [totalOrders, setTotalOrders] = useState<number | null>(null);
  const [packageName, setPackageName] = useState<number | null>(null);
  const [userProfile, setUserProfile] = useState({
    name: "",
    email: "",
    mobile: "",
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
	const fetchDashboardData = async () => {
	  try {
		const user_id = localStorage.getItem("id");
  
		if (!user_id) {
		  console.error("No userId found in localStorage.");
		  setLoading(false);
		  return;
		}
  
		const response = await fetch(userDashboard, {
		  method: "POST",
		  headers: {
			"Content-Type": "application/json",
		  },
		  body: JSON.stringify({ user_id }),
		});
  
		if (!response.ok) {
		  throw new Error("Failed to fetch dashboard data");
		}
  
		const data = await response.json();
  
		setTotalOrders(data.data.total_orders);
		setPackageName(data.data.package);
	  } catch (error) {
		console.error("Error fetching dashboard data:", error);
	  } finally {
		setLoading(false);
	  }
	};
  
	fetchDashboardData();
  }, []);

  return (
    <>
    <Header/>
    <div className="min-vh-100 d-flex flex-column bg-light py-4">
      <div className="container flex-grow-1">
        <div className="d-flex justify-content-between align-items-center mb-4">
    <h4 className="fw-bold mb-0">Dashboard</h4>
   {totalOrders >= 1 ? (
  <span className="badge bg-primary text-white px-3 py-2">
    Currently Active Package: {packageName}
  </span>
) : (
  <span className="badge bg-danger text-white px-3 py-2">
    No Active Package
  </span>
)} 
  </div>

        {loading ? (
          <p>Loading...</p>
        ) : (
          <div className="row">
         
            <div className="col-md-6 mb-4">
              <div className="card">
  <div className="card-header bg-primary text-white">
   Your Appointments
  </div>
  <div className="card-body">
    <h5 className="card-title">Card Title</h5>
    <p className="card-text">This is some content inside the card body.</p>
    <a href="#" className="btn btn-primary">Go somewhere</a>
  </div>
</div>

            </div>

            <div className="col-md-6 mb-4">
               <div className="card">
  <div className="card-header bg-primary text-white">
   Lab Reports
  </div>
  <div className="card-body">
    <h5 className="card-title">Card Title</h5>
    <p className="card-text">This is some content inside the card body.</p>
    <a href="#" className="btn btn-primary">Go somewhere</a>
  </div>
</div>
            </div>
          </div>
        )}
      </div>
    </div>
    </>
  );
}
