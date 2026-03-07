"use client";

import React, { useState } from "react";
import OtpLoginModal from "./OtpLoginModal";

export default function BuyButton({ product }: any) {
  const [showOtp, setShowOtp] = useState(false);

  const handleBuy = () => {
    const token = localStorage.getItem("token");

    if (!token) {
      setShowOtp(true);
      return;
    }

    startPayment();
  };

  const startPayment = () => {
    console.log("Start Razorpay for", product);
  };

  return (
    <>
      <button className="btn btn-primary" onClick={handleBuy}>
        Pay Now
      </button>

      <OtpLoginModal
        show={showOtp}
        onClose={() => setShowOtp(false)}
        onSuccess={() => {
          setShowOtp(false);
          startPayment();
        }}
      />
    </>
  );
}