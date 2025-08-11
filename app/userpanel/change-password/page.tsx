"use client";

import React, { useState, useEffect } from "react";
import toast from "react-hot-toast";
import { changePassword } from "@/lib/constants";
import Header from "@/app/Components/Header";
import DashboardStrip from "@/app/Components/userpanel/DashboardStrip";
import Footer from '@/app/Components/userpanel/Footer';
const ChangePassword = () => {
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState("");
  const [userId, setUserId] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const storedUserId = localStorage.getItem("id");
    setUserId(storedUserId);
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (newPassword !== confirmPassword) {
      toast.error("New Password and confirm new password do not match.");
      return;
    }

    setLoading(true);

    try {
      const res = await fetch(changePassword, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userId,
          oldPassword,
          newPassword,
          confirmPassword,
        }),
      });

      const data = await res.json();

      if (res.ok) {
        toast.success("Password has been changed successfully.");
        setOldPassword("");
        setNewPassword("");
        setConfirmPassword("");
      } else {
        toast.error(data.message || "Failed to change password.");
      }
    } catch (error) {
      toast.error("Server Error!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Header />
<div className="min-vh-100 d-flex flex-column bg-light py-4">
        <div className="container flex-grow h-100">
  <DashboardStrip title={"Change Password"} />
          <div className="row banner-content mt-5">
            <div className="col-lg-12">
              <div className="row">
                <div className="col-md-12">
                  <div className="card p-4 shadow" style={{ maxWidth:"500px",width: '100%', margin:"auto" }}>
                  <form onSubmit={handleSubmit}>
                  <div className="mb-3">
                    <label className="form-label">Old Password</label>
                    <input
                      type="password"
                      className="form-control"
                      value={oldPassword}
                      onChange={(e) => setOldPassword(e.target.value)}
                      required
                    />
                  </div>

                  <div className="mb-3">
                    <label className="form-label">New Password</label>
                    <input
                      type="password"
                      className="form-control"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      required
                    />
                  </div>

                  <div className="mb-3">
                    <label className="form-label">Confirm New Password</label>
                    <input
                      type="password"
                      className="form-control"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      required
                    />
                  </div>

                  <button
                    type="submit"
                    className="btn btn-primary w-100"
                    disabled={loading}
                  >
                    {loading ? "Updating..." : "Update Password"}
                  </button>
                </form>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
 <Footer/>
    </>
  );
};

export default ChangePassword;
