'use client';

import Image from 'next/image';
import iphone from '@/public/img/app2.png'; 
import iphone2 from '@/public/img/app3.png'; 

import Link from 'next/link';

export default function About() {
  return (
    <section className="about-area py-16">
      <div className="container mx-auto">
        <div className="row flex flex-wrap items-center">
          {/* Left phone mock-up */}
          <div className="col-lg-5 home-about-left mb-8 lg:mb-0">
            <Image
              src={iphone}
              alt="iPhone mock-up"
              className="img-fluid"
              priority
            />
          </div>

          {/* Text block */}
          <div className="offset-lg-1 col-lg-5 home-about-right mb-14 lg:mb-0">
            <h1 className="mb-6 leading-tight text-3xl font-semibold">
             Find the Right Doctors & Labs Instantly
            </h1>

            <p className="mb-8 text-gray-600">
           At Smart Health, we believe quality healthcare should be easy to access. Our powerful search tool is designed to help you quickly discover top doctors and diagnostic labs based on specialty, location, ratings, and availability — all in one place.
            </p>

            <h3>Connect with Trusted Doctors</h3>
            <p className="mb-8 text-gray-600">Whether you need a specialist consultation, a follow-up visit, or a second opinion, our platform features a wide range of highly-skilled doctors across every major specialty — from general medicine to dermatology, cardiology, orthopedics, pediatrics, and more.
With detailed profiles, real-time availability, and patient reviews, you can make an informed choice with confidence.</p>
<h3>Book Reliable Labs for Tests & Scans</h3>
<p className="mb-8 text-gray-600">Finding a certified diagnostic lab is now hassle-free. Browse accredited labs, check their services, read reviews, and even schedule your test — all without stepping outside your home.</p>
<p>Get accurate results, fast turnaround times, and the highest standards of safety and hygiene.</p>
            <Link href="#" className="primary-btn text-uppercase">
             Search Now
            </Link>
          </div>

          {/* Download buttons */}
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
              src={iphone2}
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
