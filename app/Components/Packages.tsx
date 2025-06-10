'use client';

import { useEffect, useState } from 'react';
import LoginComponent from './Login';
import toast from 'react-hot-toast';
import { useRouter } from 'next/navigation';
import { packagesApi, purchaseApi } from '@/lib/constants';
import CustomerForm from './CustomerForm';

interface Package {
  id: number;
  package_name: string;
  amount: number;
  features: string[];
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
                {typeof item.price === 'number' || !isNaN(Number(item.price))
                  ? `₹ ${item.price}`
                  : item.price}
              </div>
            </div>
          ))}
        </div>
        <div className="button-group mt-4">
          <button onClick={onPurchase} className="btn btn-success me-2">
            Purchase Now
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
        <LoginComponent redirection={false} onSuccess={onClose} logintype="User" />
        <p className="mt-3">
          Don't have an account?{' '}
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
        <CustomerForm redirection={false} onSuccess={onClose} type={7} />
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

export default function Packages() {
  const [packages, setPackages] = useState<Package[]>([]);
  const [loading, setLoading] = useState(true);
  const [hasMounted, setHasMounted] = useState(false);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [showRegisterModal, setShowRegisterModal] = useState(false);
  const [loggedIn, setLoggedIn] = useState(false);
  const [selectedPackage, setSelectedPackage] = useState<Package | null>(null);
  const router = useRouter();

  const onConfirm = async () => {
    const userId = localStorage.getItem('id');
    const packageId = selectedPackage?.id;

    if (!userId) {
      toast.error('User Not Logged In.');
      return;
    }

    setLoading(true);

    try {
      const response = await fetch(purchaseApi, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          user_id: userId,
          package_id: packageId,
        }),
      });

      const result = await response.json();

      if (response.ok) {
        toast.success('Package Purchased Successfully.');
        router.push('/userpanel/orders');
      } else {
        toast.error('Some error occurred.');
      }
    } catch (error) {
      toast.error('Error connecting to server.');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    setHasMounted(true);
    setLoggedIn(!!localStorage.getItem('id'));

    fetch(packagesApi)
      .then((res) => res.json())
      .then((data) => {
        setPackages(data.data);
        setLoading(false);
      })
      .catch((err) => {
        console.error('Failed to fetch packages:', err);
        setLoading(false);
      });
  }, []);

  const handlePurchaseClick = (pkg: Package) => {
    setSelectedPackage(pkg);
    setShowDetailsModal(true);
  };

  const onRegisterClick = () => {
    setShowLoginModal(false);
    setShowRegisterModal(true);
  };

  if (!hasMounted) return null;

  return (
    <section className="pricing-area">
      <div className="container">
        <div className="row d-flex justify-content-center">
          <div className="col-lg-6">
            <div className="section-title text-center">
              <h2>Our Plans</h2>
              <p>Start your journey with Smart Health. Purchase our Plans.</p>
            </div>
          </div>
        </div>

        {loading ? (
          <div className="text-center">Loading packages...</div>
        ) : (
          <div className="row">
            {packages.map((pkg) => (
              <div className="col-lg-6 col-md-6 mt-5 d-flex" key={pkg.id}>
                <div className="single-price w-100 d-flex flex-column p-3">
                  <div className="card-header bg-primary p-4 text-white text-center">
                    <h4 className="text-white uppercase-text">{pkg.package_name}</h4>
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
                            {typeof item.price === 'number' || !isNaN(Number(item.price))
                              ? `₹ ${item.price}`
                              : item.price}
                          </div>
                        </div>
                      ))}
                    </div>
                    <h2 className="mt-3 text-center">{pkg.amount}/- INR</h2>
                  </div>

                  <div className="text-center mt-auto mb-3">
                    <button
                      className="primary-btn price-btn"
                      onClick={() => handlePurchaseClick(pkg)}
                    >
                      Details
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Modals */}
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
