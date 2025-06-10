"use client";

import React, { useState } from "react";
import Header from "@/app/Components/Header";
import Footer from "@/app/Components/Footer";
import Link from "next/link";
import toast from 'react-hot-toast';
import { userRegister } from "@/lib/constants";
import CustomerForm from "@/app/Components/CustomerForm";

type FormFields = {
  name: string;
  email: string;
  mobile: string;
  password: string;
  confirm_password: string;
};

export default function Register() {






  return (
    <>
      <Header />
      <section className="banner-area">
        <div className="container">
          <div className="row banner-content">
            <div className="col-lg-12 d-flex align-items-center justify-content-between">
              <div className="row">
                <div className="col-md-7">
                  <div className="row">
                    <div className="col-md-12">
                      <CustomerForm type={7} redirection={true}/>
                    </div>
                    <div className="col-md-12 form-group">
                      <Link href="/user/login">
                        Already have an account? Click to Login
                      </Link>
                    </div>
                  </div>

                </div>

                <div className="col-md-5 right-part">
                  <a href="/">home</a>
                  <span className="fa fa-caret-right"></span>
                  <a href="/user/login">Register</a>

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
