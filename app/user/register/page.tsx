"use client";

import React, { useState } from "react";
import Header from "@/app/Components/Header";
import Footer from "@/app/Components/Footer";
import Link from "next/link";

type FormFields = {
  name: string;
  email: string;
  mobile: string;
  password: string;
  confirm_password: string;
};

export default function Register() {
  const [formData, setFormData] = useState<FormFields>({
    name: "",
    email: "",
    mobile: "",
    password: "",
    confirm_password: "",
  });

  const [errors, setErrors] = useState<Partial<Record<keyof FormFields, string>>>({});
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState<string | null>(null);
  const [apiError, setApiError] = useState<string | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    setErrors((prev) => ({
      ...prev,
      [name]: "",
    }));
  };

  const validate = () => {
    const newErrors: Partial<Record<keyof FormFields, string>> = {};

    if (!formData.name.trim()) newErrors.name = "Name is required.";
    if (!formData.email.includes("@")) newErrors.email = "Invalid email.";
    if (!formData.mobile.match(/^\d{10}$/)) newErrors.mobile = "Mobile must be 10 digits.";
    if (formData.password.length < 6) newErrors.password = "Password must be at least 6 characters.";
    if (formData.password !== formData.confirm_password)
      newErrors.confirm_password = "Passwords do not match.";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSuccess(null);
    setApiError(null);

    if (!validate()) return;

    setLoading(true);

    try {
      const res = await fetch("https://smarthealthbackend.shreevasudev.in/api/register/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (!res.ok) {
        if (data?.message) setApiError(data.message);
        else setApiError("Something went wrong.");
        return;
      }

      setSuccess("Registration successful!");
      setFormData({
        name: "",
        email: "",
        mobile: "",
        password: "",
        confirm_password: "",
      });
    } catch (err) {
      setApiError("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Header />
      <section className="banner-area">
        <div className="container">
          <div className="row banner-content">
            <div className="col-lg-12 d-flex align-items-center justify-content-between">
              <div className="row">
                <div className="col-md-7">
                  <form onSubmit={handleSubmit}>
                    <div className="row">
                      <div className="col-md-12 form-group">
                        <h3>Create Account</h3>
                      </div>

                      {(Object.keys(formData) as (keyof FormFields)[]).map((key) => (
                        <div className="col-md-12 form-group" key={key}>
                          <label>
                            {key
                              .replace("_", " ")
                              .replace(/\b\w/g, (l) => l.toUpperCase())}
                          </label>
                          <input
                            type={key.includes("password") ? "password" : "text"}
                            name={key}
                            className="form-control"
                            value={formData[key]}
                            onChange={handleChange}
                          />
                          {errors[key] && (
                            <small className="text-danger">{errors[key]}</small>
                          )}
                        </div>
                      ))}

                      {apiError && (
                        <div className="col-md-12 form-group text-danger">{apiError}</div>
                      )}
                      {success && (
                        <div className="col-md-12 form-group text-success">{success}</div>
                      )}

                      <div className="col-md-12 form-group">
                        <button
                          type="submit"
                          className="btn btn-primary"
                          disabled={loading}
                        >
                          {loading ? "Creating Account..." : "Create Account"}
                        </button>
                      </div>
                      <div className="col-md-12 form-group">
                        <Link href="/user/login">
                          Already have an account? Click to Login
                        </Link>
                      </div>
                    </div>
                  </form>
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
