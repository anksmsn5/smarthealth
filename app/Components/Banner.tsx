"use client";
import React from "react";
import Lottie from "lottie-react";
import doctorAnimation from "../../public/banner.json";
export default function Banner() {
  return (
    <div className="container-fluid banner">
<div className="container">
        <div className="row fullscreen  d-flex align-items-center justify-content-between">
          <div className="home-banner-content col-lg-6 col-md-6">
            <h2>
              Your Trusted Partner <br />
              for Doctor & Lab Appointments
            </h2>
            <p>
              Discover, compare, and book top-rated doctors and diagnostic labs
              with ease — all in one place. At Smart Health, we simplify your
              healthcare journey so you can focus on your well-being. Whether
              you need a quick consultation or a specialized test, we make sure
              that quality care is just a few clicks away.
            </p>
          </div>
          <div className="banner-img col-lg-6 col-md-6">
           <Lottie animationData={doctorAnimation} loop={true} />
          </div>
        </div>
		 </div>
      </div>
  );
}
