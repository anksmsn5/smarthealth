"use client";

import React, { useState, useEffect } from "react";
import toast from "react-hot-toast";
import { changePassword, createPassword } from "@/lib/constants";
import Header from "@/app/Components/Header";
import Footer from "@/app/Components/userpanel/Footer";
import { useRouter } from "next/navigation";
const ChangePassword = () => {
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState("");
  const [userId, setUserId] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  useEffect(() => {
    const storedUserId = localStorage.getItem("id");
    setUserId(storedUserId);
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newPassword == "") {
      toast.error("Enter password.");
      return;
    }
    if (confirmPassword == "") {
      toast.error("Enter Confirm New  password.");
      return;
    }
    if (newPassword !== confirmPassword) {
      toast.error("New Password and confirm new password do not match.");
      return;
    }

    setLoading(true);

    try {
      const res = await fetch(createPassword, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userId,

          newPassword,
          confirmPassword,
        }),
      });

      const data = await res.json();

      if (res.ok) {
        toast.success("Password has been created successfully.");

        setNewPassword("");
        setConfirmPassword("");

        localStorage.removeItem("name");
        localStorage.removeItem("id");
        localStorage.removeItem("email");
        localStorage.removeItem("type");

        router.push("/user/login");
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
      <div className="min-vh-100 mt-5d-flex justify-content-center align-items-center bg-light">
        <div className="container d-flex justify-content-center">
          <div
            className="card p-4 shadow mt-5 mb-5"
            style={{ maxWidth: "400px", width: "100%" }}
          >
            <h4 className="mb-3">Create Password</h4>

            {message && <div className="alert alert-info">{message}</div>}

            <form onSubmit={handleSubmit}>
              <div className="mb-3">
                <label className="form-label">New Password</label>
                <input
                  type="password"
                  className="form-control"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                />
              </div>

              <div className="mb-3">
                <label className="form-label">Confirm New Password</label>
                <input
                  type="password"
                  className="form-control"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
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
      <Footer />
    </>
  );
};

export default ChangePassword;
