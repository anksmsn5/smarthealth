'use client';

import Image from 'next/image';
import Lottie from "lottie-react";
import prescription from "../../public/prescription.json";

import Link from 'next/link';

export default function About() {
  return (
    <section className="about-area py-16">
      <div className="container mx-auto">
        <div className="row flex flex-wrap items-center">
          {/* Left phone mock-up */}
          <div className="col-lg-6 home-about-left mb-8 lg:mb-0">
            <Lottie animationData={prescription} loop={true} />
          </div>

          {/* Text block */}
          <div className="offset-lg-1 col-lg-5 home-about-right mb-14 lg:mb-0">
            <h1 className="mb-6 leading-tight text-3xl font-semibold ">
             Find the Right Doctors & Labs Instantly
            </h1>

            <p className="mb-8 text-gray-600">
           At Smart Health, we believe quality healthcare should be easy to access. Our powerful search tool is designed to help you quickly discover top doctors and diagnostic labs based on specialty, location, ratings, and availability — all in one place.
            </p>

            <h3>Connect with Trusted Doctors</h3>
            <p className="mb-8 text-gray-600">Whether you need a specialist consultation, a follow-up visit, or a second opinion, our platform features a wide range of highly-skilled doctors across every major specialty — from general medicine to dermatology, cardiology, orthopedics, pediatrics, and more.
With detailed profiles, real-time availability, and patient reviews, you can make an informed choice with confidence.</p>

          </div>
 <div className="col-lg-12 home-about-right mb-1 lg:mb-0">
<h3>Book Reliable Labs for Tests & Scans</h3>
<p className="mb-0 text-gray-600">Finding a certified diagnostic lab is now hassle-free. Browse accredited labs, check their services, read reviews, and even schedule your test — all without stepping outside your home.</p>
<p className="mb-8 text-gray-600">Get accurate results, fast turnaround times, and the highest standards of safety and hygiene.</p>
             

 </div>
  </div>
   <div className="row flex flex-wrap items-center">
      <div className='col-md-12'>
        <h1 className="mb-6 leading-tight text-3xl text-center mt-5 font-semibold">
           Why Choose Smart Health
            </h1>
      </div>
   </div>
<div className="row flex flex-wrap items-center mt-2 mb-10 whyusdiv">
  <div className="col-6 col-md-4 col-lg-2 text-center mb-4">
    <img src="/surgery.gif" alt="Icon 1" className="img-fluid mb-2 mt-5 rounded" />
    <h5>Best Diagnosis</h5>
  </div>

  <div className="col-6 col-md-4 col-lg-2 text-center mb-4">
    <img src="/vaccine.gif" alt="Icon 2" className="img-fluid mb-2 mt-5" />
    <h5>Safe Collection</h5>
  </div>

  <div className="col-6 col-md-4 col-lg-2 text-center mb-4">
    <img src="/file-delivery.gif" alt="Icon 3" className="img-fluid mb-2 mt-5" />
    <h5>Quick Reporting</h5>
  </div>

  <div className="col-6 col-md-4 col-lg-2 text-center mb-4">
    <img src="/goals.gif" alt="Icon 4" className="img-fluid mb-2 mt-5" />
    <h5>Accuracy</h5>
  </div>

  <div className="col-6 col-md-4 col-lg-2 text-center mb-4">
    <img src="/india.gif" alt="Icon 5" className="img-fluid mb-2 mt-5" />
    <h5>Pan India</h5>
  </div>

  <div className="col-6 col-md-4 col-lg-2 text-center mb-4">
    <img src="/family.gif" alt="Icon 6" className="img-fluid mb-2 mt-5" />
    <h5>Millions of satisfied families</h5>
  </div>
</div>





          <div className="row flex flex-wrap items-center mt-5">
          <div className="col-lg-6 home-about-right home-about-right2">
            <h1 className="mb-6 leading-tight text-3xl font-semibold">
            Book Doctors Appointments with Ease
            </h1>

            <p className="mb-8 text-gray-600">
             Say goodbye to long wait times and stressful booking processes. With Smart Health, you can easily schedule an appointment with your preferred doctor — anytime, anywhere. Our platform is designed to give you a smooth, hassle-free experience every step of the way.
            </p>
            <h3>Why Book with Smart Health?</h3>
        <ol className="ps-3 mt-3">
  <li className="mb-3">🔍 Find the right doctor by specialty, experience, and ratings</li>
  <li className="mb-3">📅 Check real-time availability and choose a slot that suits you</li>
  <li className="mb-3">🧑‍⚕️ Browse detailed doctor profiles, including qualifications and reviews</li>
  <li className="mb-3">📲 Book & confirm instantly — no more phone calls or waiting on hold</li>
  <li className="mb-3">🔔 Get appointment reminders so you never miss a visit</li>
  <li className="mb-3">🔐 Secure & Private — we protect your personal data at all times</li>
</ol>

          </div>

          {/* Second phone mock-up */}
          <div className="col-lg-5 home-about-left mt-14 lg:mt-0">
            <Image
              src="/appointment.gif" width={400} height={400}
              alt="iPhone mock-up"
              className="img-fluid"
              priority
            />
          </div>
        </div>
      </div>
    </section>
  );
}
