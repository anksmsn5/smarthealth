"use client";

import { generateOtp, verifyOtp } from "@/lib/constants";
import React, { useState } from "react";
import toast from "react-hot-toast";
import "./OtpLogin.css";
interface Props {
  show: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export default function OtpLoginModal({ show, onClose, onSuccess }: Props) {
  const [mobile, setMobile] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [otp, setOtp] = useState(["", "", "", ""]);

  if (!show) return null;

  const sendOtp = async () => {
    try {
      const res = await fetch(generateOtp, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ mobile }),
      });

      const data = await res.json();

      if (data.status) {
        toast.success("OTP sent");
        setOtpSent(true);
      } else {
        toast.error(data.message || "Failed to send OTP");
      }
    } catch (error) {
      toast.error("Failed to send OTP");
    }
  };

  const verifyOtps = async () => {
    const enteredOtp = otp.join("");

    try {
      const res = await fetch(verifyOtp, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          mobile,
          otp: enteredOtp,
        }),
      });

      const data = await res.json();

      if (data.status) {
        localStorage.setItem("token", data.token);
        toast.success("Login successful");
        onSuccess();
      } else {
        toast.error(data.message || "Invalid OTP");
      }
    } catch (error) {
      toast.error("Invalid OTP");
    }
  };

  const handleOtpChange = (value: string, index: number) => {
    if (!/^[0-9]?$/.test(value)) return;

    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    if (value && index < 3) {
      const next = document.getElementById(`otp-${index + 1}`);
      next?.focus();
    }
  };

  return (
    <div className="otp-overlay">
      <div className="otp-modal">
        <h4 className="mb-3 text-center">Login to Continue</h4>

        {!otpSent ? (
          <>
            <input
              type="text"
              placeholder="Enter Mobile Number"
              className="form-control mb-3"
              value={mobile}
              onChange={(e) => setMobile(e.target.value)}
            />

            <button className="btn btn-primary w-100" onClick={sendOtp}>
              Send OTP
            </button>
          </>
        ) : (
          <>
            <div className="d-flex justify-content-between mb-3">
              {otp.map((digit, index) => (
                <input
                  key={index}
                  id={`otp-${index}`}
                  type="text"
                  maxLength={1}
                  value={digit}
                  onChange={(e) => handleOtpChange(e.target.value, index)}
                  className="otp-input"
                />
              ))}
            </div>

            <button className="btn btn-success w-100" onClick={verifyOtps}>
              Verify OTP
            </button>
          </>
        )}

        <button className="btn btn-link mt-3" onClick={onClose}>
          Close
        </button>
      </div>
    </div>
  );
}