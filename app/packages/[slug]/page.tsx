import BuyButton from "@/app/Components/BuyButton";
import Footer from "@/app/Components/Footer";
import Header from "@/app/Components/Header";
import {
  createOrder,
  packagesApi,
  purchaseApi,
  razorPayKey,
} from "@/lib/constants";
import DownloadBrochure from "@/app/Components/DownloadBrochure";
import React from "react";
import { Card } from "react-bootstrap";
import toast from "react-hot-toast";

interface PackagesInterface {
  id: number;
  package_name: string;
  slug: string;
  features: Feature[] | string;
  amount: number;
}

interface Feature {
  feature: string;
  subheading: string | null;
  price: string;
  type: string;
}

// Fix: params is now a Promise
interface healthProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  const res = await fetch(packagesApi);
  const resdata = await res.json();
  const data: PackagesInterface[] = resdata.data;

  return data.map((pkg) => ({
    slug: pkg.slug,
  }));
}

export default async function PackageDetails({ params }: healthProps) {
  // Await params since it's now a Promise
  const { slug } = await params;

  const res = await fetch(packagesApi + "/" + slug, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });

  if (!res.ok) {
    return <div>Product not found</div>;
  }

  const data = await res.json();
  const product: PackagesInterface = data.data[0];
  const rawFeatures = product.features;

  let features: Feature[] = [];
  if (Array.isArray(product.features)) {
    features = product.features;
  } else {
    try {
      features = JSON.parse(product.features);
    } catch (error) {
      console.error("Invalid JSON format for features");
    }
  }

  return (
    <>
      <Header />
      <section className="banner-area">
        <div className="container-fluid banner">
          <div className="row banner-content">
            <div className="col-lg-12 d-flex align-items-center justify-content-between">
              <div className="right-part breadcrumbs">
                <a href="/">home</a>
                <span className="fa fa-caret-right"></span>
                <a href={`/packages/${product.slug}`}>{product.package_name}</a>
              </div>
            </div>
          </div>
        </div>
      </section>
      <section className="feature-area">
        <div className="container">
          <div className="row">
            <div className="col-lg-12 mt-5">
              <div className="section-title text-center ml-30">
                <h3 className="fs-5"> {product.package_name}</h3>
                <p>
                  <b>Price:</b> ₹{product.amount}
                </p>
              </div>
            </div>

            <div className="col-lg-12">
              <div className="section-title text-start ml-30">
                <h4 className="fs-3">Package Features</h4>
                <p>
                  Explore the comprehensive features included in this package.
                </p>
              </div>
            </div>
          </div>
          <div className="row">
            <div className="col-md-6">
              {features.map((item, index) => (
                <div key={index} className="col-md-12">
                  <div className="card h-100   border-0 rounded-4 feature-card">
                    <div className="card-body d-flex">
                      {/* Icon */}
                      <div className="me-3 text-primary fs-4 mr-1">
                        <i className="bi bi-check"></i>
                      </div>

                      {/* Content */}
                      <div className="w-100">
                        <h5 className="fw-normal">
                          <b className="text-black fw-semibold">
                            {" "}
                            {item.price}{" "}
                          </b>
                          - {item.feature}
                        </h5>

                        {item.subheading && (
                          <p className="text-muted small mb-1">
                            {item.subheading}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))}

              <div className="card-footer">
                <BuyButton product={product} />
                <DownloadBrochure
                  packageName={product.package_name}
                  amount={product.amount}
                  features={features}
                />
              </div>
            </div>
            <div className="col-md-6">
              <video width="100%" autoPlay loop muted className="rounded-lg">
                <source src="/details.mp4" type="video/mp4" />
                Your browser does not support the video tag.
              </video>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </>
  );
}
