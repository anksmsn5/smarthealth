"use client";

import { useEffect, useState } from "react";
import LoginComponent from "./Login";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import {
  assignPackage,
  packagesApi,
  purchaseApi,
  createOrder,
  razorPayKey,
} from "@/lib/constants";
import CustomerForm from "./CustomerForm";

interface Feature {
  feature: string;
  subheading?: string;
  price: number | string;
}

interface Package {
  id: number;
  package_name: string;
  amount: number;
  features: Feature[];
}

function PackageDetailsModal({
  visible,
  onClose,
  pkg,
  onPurchase,
}: {
  visible: boolean;
  onClose: () => void;
  pkg: Package | null;
  onPurchase: () => void;
}) {
  if (!visible || !pkg) return null;

  return (
    <div className="modal-backdrop">
      <div className="modal-content text-start">
        <div className="d-flex justify-content-between align-items-center mb-3">
          <h3 className="mb-0">Package: {pkg.package_name}</h3>
          <h4 className="mb-0 text-success">₹{pkg.amount}</h4>
        </div>
        <hr />
        <div className="features mt-3">
          {pkg.features.map((item: any, index) => (
            <div className="plan-row" key={index}>
              <div className="plan-left">
                <div className="plan-text">
                  {item.feature}
                  <span>{item.subheading}</span>
                </div>
              </div>
              <div className="plan-right">
                {typeof item.price === "number" || !isNaN(Number(item.price))
                  ? `₹ ${item.price}`
                  : item.price}
              </div>
            </div>
          ))}
        </div>
        <div className="button-group mt-4">
          <span className="text-black">
            <b> Net Payable: {pkg.amount}+18% GST</b>
          </span>
          <button onClick={onPurchase} className="btn btn-primary me-2">
            Pay Now
          </button>
          <button onClick={onClose} className="btn btn-secondary ml-3">
            Close
          </button>
        </div>
      </div>
      <style jsx>{`
        .modal-backdrop {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(0, 0, 0, 0.6);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 999;
          overflow: auto;
          padding: 2rem;
        }
        .modal-content {
          background: #fff;
          padding: 2rem;
          border-radius: 8px;
          width: 100%;
          max-width: 1000px;
          max-height: 90vh;
          overflow-y: auto;
        }
        .features {
          margin-top: 1rem;
        }
        .plan-row {
          display: flex;
          justify-content: space-between;
          margin-bottom: 1rem;
          gap: 10px;
          border-bottom: 1px solid #ddd;
          padding-bottom: 0.5rem;
          flex-wrap: wrap;
        }
        .plan-left {
          flex: 1 1 70%;
        }
        .plan-right {
          flex: 1 1 30%;
          text-align: right;
          font-weight: bold;
          white-space: nowrap;
        }
        .plan-text {
          font-size: 1rem;
          font-weight: 500;
        }
        .plan-text span {
          display: block;
          font-size: 0.85rem;
          color: yellow;
          margin-top: 0.3rem;
        }
        .button-group {
          display: flex;
          justify-content: flex-end;
          flex-wrap: wrap;
          gap: 1rem;
        }
        @media (max-width: 768px) {
          .plan-row {
            flex-direction: column;
            align-items: flex-start;
          }
          .plan-right {
            text-align: left;
            margin-top: 0.5rem;
          }
          .modal-content {
            padding: 1.2rem;
          }
        }
      `}</style>
    </div>
  );
}

function LoginModal({
  visible,
  onClose,
  onRegisterClick,
}: {
  visible: boolean;
  onClose: () => void;
  onRegisterClick: () => void;
}) {
  if (!visible) return null;

  return (
    <div className="modal-backdrop">
      <div className="modal-content">
        <LoginComponent
          redirection={false}
          onSuccess={onClose}
          logintype="User"
        />
        <p className="mt-3">
          Don't have an account?{" "}
          <button className="btn btn-link" onClick={onRegisterClick}>
            Register
          </button>
        </p>
        <button onClick={onClose} className="btn btn-secondary mt-3">
          Close
        </button>
      </div>
      <style jsx>{`
        .modal-backdrop {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(0, 0, 0, 0.6);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 999;
        }
        .modal-content {
          background: #fff;
          padding: 2rem;
          border-radius: 8px;
          max-width: 400px;
          width: 90%;
          text-align: center;
        }
      `}</style>
    </div>
  );
}

function RegistrationModal({
  visible,
  onClose,
}: {
  visible: boolean;
  onClose: () => void;
}) {
  if (!visible) return null;

  return (
    <div className="modal-backdrop">
      <div className="modal-content">
        <CustomerForm
          redirection={false}
          onSuccess={onClose}
          type={7}
          referredby=""
        />
        <button onClick={onClose} className="btn btn-secondary mt-3">
          Close
        </button>
      </div>
      <style jsx>{`
        .modal-backdrop {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(0, 0, 0, 0.6);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 999;
        }
        .modal-content {
          background: #fff;
          padding: 2rem;
          border-radius: 8px;
          max-width: 400px;
          width: 90%;
          text-align: center;
        }
      `}</style>
    </div>
  );
}

export default function Packages({
  customer_id,
  agent_id,
  purchasing_from,
}: {
  customer_id?: number;
  agent_id?: number;
  purchasing_from?: string;
}) {
  const [packages, setPackages] = useState<Package[]>([]);
  const [loading, setLoading] = useState(true);
  const [hasMounted, setHasMounted] = useState(false);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [showRegisterModal, setShowRegisterModal] = useState(false);
  const [loggedIn, setLoggedIn] = useState(false);
  const [selectedPackage, setSelectedPackage] = useState<Package | null>(null);
  const router = useRouter();

  useEffect(() => {
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.async = true;
    document.body.appendChild(script);
    return () => {
      document.body.removeChild(script);
    };
  }, []);

  const onConfirm = async () => {
    const userId = localStorage.getItem("id");
    const packageId = selectedPackage?.id;

    if (!userId || !packageId) {
      toast.error("Login required or invalid package");
      return;
    }

    const amount = selectedPackage.amount;
    const tax = amount * 0.18; // 18% tax
    const finalAmount = amount + tax;
    try {
      // Step 1: Call PHP backend to create Razorpay order
      const orderRes = await fetch(createOrder, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          amount: finalAmount,
          customer_id: userId,
        }),
      });

      const order = await orderRes.json();
      console.log(order);
      if (!order.order_id) {
        toast.error("Failed to create Razorpay order");
        return;
      }

      // Step 2: Initialize Razorpay
      const options = {
        key: razorPayKey,
        amount: order.amount,
        currency: order.currency,
        name: "Smart Health",
        description: "Package Purchase",
        order_id: order.order_id,
        handler: async function (response: any) {
          // Step 3: On success, call PHP REST API to confirm payment
          const confirmRes = await fetch(purchaseApi, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              user_id: userId,
              package_id: packageId,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_order_id: response.razorpay_order_id,
              razorpay_signature: response.razorpay_signature,
              customer_id,
              agent_id,
              purchasing_from,
            }),
          });

          const confirmData = await confirmRes.json();

          if (confirmRes.ok) {
            toast.success("Package Purchased Successfully!");
            router.push("/userpanel/orders");
          } else {
            toast.error(confirmData.message || "Failed to store payment.");
          }
        },

        theme: {
          color: "#3399cc",
        },
      };

      const rzp = new (window as any).Razorpay(options);
      rzp.open();
    } catch (err) {
      console.error(err);
      toast.error("Payment failed. Try again.");
    }
  };

  useEffect(() => {
    setHasMounted(true);
    setLoggedIn(!!localStorage.getItem("id"));

    fetch(packagesApi)
      .then((res) => res.json())
      .then((data) => {
        setPackages(data.data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Failed to fetch packages:", err);
        setLoading(false);
      });
  }, []);

  const handlePurchaseClick = (pkg: Package) => {
    setSelectedPackage(pkg);
    setShowDetailsModal(true);
  };

  const handleAssignClick = async (
    pkg: Package,
    agent_id: number,
    customer_id: number
  ) => {
    if (!agent_id || !customer_id) {
      toast.error("Agent ID or Customer ID missing.");
      return;
    }

    try {
      const response = await fetch(assignPackage, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          agent_id,
          customer_id,
          package_id: pkg.id,
        }),
      });

      const result = await response.json();

      if (response.ok) {
        if (agent_id) {
          toast.success("Package assigned successfully.");
          window.location.reload();
        } else {
          toast.success("Package Purchased successfully.");
        }

        // optionally navigate or refresh
      } else {
        toast.error(result.message || "Failed to assign package.");
      }
    } catch (error) {
      console.error("Error:", error);
      toast.error("Server error. Please try again.");
    }
  };

  const onRegisterClick = () => {
    setShowLoginModal(false);
    setShowRegisterModal(true);
  };

  if (!hasMounted) return null;

  return (
    <section className={!agent_id ? "pricing-area" : ""}>
      <div className="container">
        {!agent_id ? (
          <div className="row d-flex justify-content-center">
            <div className="col-lg-6">
              <div className="section-title text-center">
                <h2>Our Plans</h2>
                <p>Start your journey with Smart Health. Purchase our Plans.</p>
              </div>
            </div>
          </div>
        ) : (
          <>
            <div className="row d-flex justify-content-center">
              <div className="col-lg-6">
                <div className="section-title text-center">
                  <h2>Our Plans</h2>
                  <p>Select a Package and Assign !</p>
                </div>
              </div>
            </div>
          </>
        )}

        {loading ? (
          <div className="text-center">Loading packages...</div>
        ) : (
          <div className="row">
            {packages.map((pkg) => (
              <div className="col-lg-6 col-md-6 mt-5 d-flex" key={pkg.id}>
                <div className="single-price w-100 d-flex flex-column p-3">
                  <div className="card-header bg-primary p-4 text-white text-center">
                    <h4 className="text-white uppercase-text">
                      {pkg.package_name}
                    </h4>
                  </div>

                  <div className="flex-grow-1 d-flex flex-column justify-content-between">
                    <div className="features-list">
                      {pkg.features.map((item: any, index) => (
                        <div className="plan-row mt-3" key={index}>
                          <div className="plan-left">
                            <div
                              className="plan-text"
                              dangerouslySetInnerHTML={{ __html: item.feature }}
                            ></div>
                          </div>
                          <div className="plan-right">
                            {typeof item.price === "number" ||
                            !isNaN(Number(item.price))
                              ? `₹ ${item.price}`
                              : item.price}
                          </div>
                        </div>
                      ))}
                    </div>
                    <h2 className="mt-3 text-center">{pkg.amount}/- INR</h2>
                  </div>

                  <div className="text-center mt-auto mb-3">
                    {!agent_id ? (
                      <button
                        className="primary-btn price-btn"
                        onClick={() => handlePurchaseClick(pkg)}
                      >
                        Details
                      </button>
                    ) : (
                      <button
                        className="primary-btn price-btn"
                        onClick={() =>
                          handleAssignClick(pkg, agent_id, customer_id || 0)
                        }
                      >
                        Assign Package
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <PackageDetailsModal
        visible={showDetailsModal}
        onClose={() => setShowDetailsModal(false)}
        pkg={selectedPackage}
        onPurchase={() => {
          if (loggedIn) {
            onConfirm();
          } else {
            setShowLoginModal(true);
          }
        }}
      />

      <LoginModal
        visible={showLoginModal}
        onClose={() => setShowLoginModal(false)}
        onRegisterClick={onRegisterClick}
      />

      <RegistrationModal
        visible={showRegisterModal}
        onClose={() => setShowRegisterModal(false)}
      />
    </section>
  );
}
