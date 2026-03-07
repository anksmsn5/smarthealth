"use client";
import React from "react";
import Lottie from "lottie-react";
import doctorAnimation from "../../public/banner.json";
import Image from "next/image";
export default function Banner() {
  return (
    <div className="container-fluid banner">
      <div className="container">
        <div className="row fullscreen  d-flex align-items-center justify-content-between">
          <div className="banner-img col-lg-6 col-md-6">
            <Image
              src="/img/about.jpg"
              alt="Doctor Animation"
              width={500}
              height={500}
              className="img-fluid"
            />
          </div>
          <div className="col-lg-6 col-md-6">
            <h2 className="text-white">
              Your Trusted Partner <br />
              for Doctor & Lab Appointments
            </h2>
            <p className="text-white mt-1">
              Discover, compare, and book top-rated doctors and diagnostic labs
              with ease — all in one place. At Smart Health, we simplify your
              healthcare journey so you can focus on your well-being. Whether
              you need a quick consultation or a specialized test, we make sure
              that quality care is just a few clicks away.
            </p>
            <a
              href="/smarthealth.apk"
              download={true}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block mt-4"
            >
              <img
                src="/android.png"
                alt="Download on Google Play"
                style={{ height: "60px" }}
              />
            </a>
          </div>
          
        </div>
      </div>
    </div>
  );
}
