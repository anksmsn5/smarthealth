"use client";

import { useEffect, useState } from "react";
import { userDashboard, agentDashboard } from "@/lib/constants";
import Header from "@/app/Components/Header";

export default function Dashboard() {
  const [totalOrders, setTotalOrders] = useState<number | null>(null);
  const [totalUsers, setTotalUsers] = useState<number | null>(null);
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
  
		const response = await fetch(agentDashboard, {
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
		setTotalUsers(data.data.total_users);
		setUserProfile(data.data.profile);
	  } catch (error) {
		console.error("Error fetching dashboard data:", error);
	  } finally {
		setLoading(false);
	  }
	};
  
	fetchDashboardData();
  }, []);

  return (
    <><Header/>
    <div className="min-vh-100 d-flex flex-column bg-light py-4">
      <div className="container flex-grow-1">
        <h4 className="mb-4 fw-bold">Dashboard</h4>

        {loading ? (
          <p>Loading...</p>
        ) : (
          <div className="row">
            <div className="col-md-6 mb-4">
              <div className="card shadow-sm">
                <div className="card-body">
                  <div className="row">
                    <div className="col-md-6">
                    <h5 className="card-title">Total Orders</h5>
                  <a className="display-4 text-primary fw-bold" href="#">
                    {totalOrders}
                  </a>
                    </div>
                    <div className="col-md-6">
                    <h5 className="card-title">Total Customers</h5>
                  <a className="display-4 text-primary fw-bold" href="#">
                    {totalUsers}
                  </a>
                    </div>
                    </div>
                 
                  
                </div>
              </div>
            </div>

            <div className="col-md-6 mb-4">
              <div className="card shadow-sm">
                <div className="card-body">
                  <h5 className="card-title">Your Profile</h5>
                  <p className="mb-2">
                    <strong>Name:</strong> {userProfile.name}
                  </p>
                  <p className="mb-2">
                    <strong>Email:</strong> {userProfile.email}
                  </p>
                  <p className="mb-0">
                    <strong>Mobile:</strong> {userProfile.mobile}
                  </p>
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
