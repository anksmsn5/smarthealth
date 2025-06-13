"use client";

import React from "react";
import Footer from "@/app/Components/Footer";
import CustomerForm from "@/app/Components/CustomerForm";
import Header from "@/app/Components/Header";

export default function Register() {
  return (
    <>
    <Header/>
      <section className="banner-area">
        <div className="container">
          <div className="row banner-content">
            <div className="col-lg-12 d-flex align-items-center justify-content-between">
              <div className="row">
                {/* 🧾 Form Section */}
                <div className="col-md-7">
                  <CustomerForm referredby="" type={3} redirection={true}/> {/* Replace with dynamic value if needed */}
                </div>

                {/* 📣 Info Section */}
                <div className="col-md-5 right-part">
                  <a href="/">Home</a>
                  <span className="fa fa-caret-right"></span>
                  <a href="/agent/register">Agent Register</a>

                  <p>
                    Welcome to Smart Health — your partner in better health and a
                    better life.
                  </p>
                  <p>
                    Join our community of patients taking control of their health
                    journey. Register now to access personalized health tools, expert
                    guidance, and resources designed to help you live better every
                    day.
                  </p>
                  <h4>With your free account, you can:</h4>
                  <ol>
                    <li>Track your symptoms and progress</li>
                    <li>Access personalized health insights</li>
                    <li>Schedule and manage appointments</li>
                    <li>Store and share medical reports securely</li>
                    <li>Connect with healthcare professionals</li>
                  </ol>
                  <p>Your journey to better health starts here.</p>
                  <p>It only takes a minute — and it's completely free.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </>
  );
}
