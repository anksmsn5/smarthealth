'use client';

import Image from 'next/image';
import iphone from '@/public/img/app2.jpg'; 
import iphone2 from '@/public/img/app3.jpg'; 

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
              We Believe that <br />
              Interior beautifies the <br />
              Total Architecture
            </h1>

            <p className="mb-8 text-gray-600">
              Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do
              eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut
              enim ad minim veniam.
            </p>

            <Link href="#" className="primary-btn text-uppercase">
              Get Details
            </Link>
          </div>

          {/* Download buttons */}
          <div className="col-lg-6 home-about-right home-about-right2">
            <h1 className="mb-6 leading-tight text-3xl font-semibold">
              We Believe that <br />
              Interior beautifies the <br />
              Total Architecture
            </h1>

            <p className="mb-8 text-gray-600">
              Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do
              eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut
              enim ad minim veniam.
            </p>

            <div className="download-button flex gap-4">
              <Link
                href="#"
                className="buttons flex items-center gap-3 px-4 py-2 border rounded"
              >
                <i className="fa fa-apple" aria-hidden="true" />
                <span className="desc">
                  <span className="block text-xs">Available</span>
                  <span className="block font-medium">on App Store</span>
                </span>
              </Link>

              <Link
                href="#"
                className="buttons dark flex items-center gap-3 px-4 py-2 border rounded"
              >
                <i className="fa fa-android" aria-hidden="true" />
                <span className="desc">
                  <span className="block text-xs">Available</span>
                  <span className="block font-medium">on Play Store</span>
                </span>
              </Link>
            </div>
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
