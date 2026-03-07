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
          <div className="col-lg-6 home-about-left mb-0 lg:mb-0">
          <Image
              src="/img/about2.jpg" width={500} height={500}
              alt="iPhone mock-up"
              className="img-fluid mt-4"
              priority
            />
          </div>

          {/* Text block */}
          <div className="col-lg-6 home-about-right mb-14 lg:mb-0">
            <h1 className="mb-1 leading-tight text-3xl font-semibold ">
             Find the Right Doctors & Labs Instantly
            </h1>

            <p className="mb-1 text-gray-600">
           At Smart Health, we believe quality healthcare should be easy to access. Our powerful search tool is designed to help you quickly discover top doctors and diagnostic labs based on specialty, location, ratings, and availability — all in one place.
            </p>

            <h3>Connect with Trusted Doctors</h3>
            <p className="mb-1 text-gray-600">Whether you need a specialist consultation, a follow-up visit, or a second opinion, our platform features a wide range of highly-skilled doctors across every major specialty — from general medicine to dermatology, cardiology, orthopedics, pediatrics, and more.
With detailed profiles, real-time availability, and patient reviews, you can make an informed choice with confidence.</p>
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
<div className="container whyusdiv mt-5 mb-5">
  <div className="row">

    <div className="col-12 col-md-4 text-center mb-5">
      <img src="/img/why1.jpg" alt="Best Diagnosis" className="img-fluid mb-3 rounded" />
      <h5 className="fw-bold">Best Diagnosis</h5>
      <p className="text-muted">
        Advanced technology and expert doctors ensure accurate and reliable diagnostic results.
      </p>
    </div>

    <div className="col-12 col-md-4 text-center mb-5">
      <img src="/img/why2.jpg" alt="Safe Collection" className="img-fluid mb-3 rounded" />
      <h5 className="fw-bold">Safe Collection</h5>
      <p className="text-muted">
        Hygienic and safe sample collection at your home by trained professionals.
      </p>
    </div>

    <div className="col-12 col-md-4 text-center mb-5">
      <img src="/img/why3.jpg" alt="Quick Reporting" className="img-fluid mb-3 rounded" />
      <h5 className="fw-bold">Quick Reporting</h5>
      <p className="text-muted">
        Get your reports delivered digitally within the shortest turnaround time.
      </p>
    </div>

    <div className="col-12 col-md-4 text-center mb-5">
      <img src="/img/why4.jpg" alt="Accuracy" className="img-fluid mb-3 rounded" />
      <h5 className="fw-bold">Accuracy</h5>
      <p className="text-muted">
        High precision lab testing with strict quality control standards.
      </p>
    </div>

    <div className="col-12 col-md-4 text-center mb-5">
      <img src="/img/why5.jpg" alt="Pan India" className="img-fluid mb-3 rounded" />
      <h5 className="fw-bold">Pan India</h5>
      <p className="text-muted">
        Wide service coverage across major cities and towns throughout India.
      </p>
    </div>

    <div className="col-12 col-md-4 text-center mb-5">
      <img src="/img/why6.jpg" alt="Satisfied Families" className="img-fluid mb-3 rounded" />
      <h5 className="fw-bold">Millions of Satisfied Families</h5>
      <p className="text-muted">
        Trusted by millions for reliable healthcare services and diagnostics.
      </p>
    </div>

  </div>
</div>


      </div>
    </section>
  );
}
