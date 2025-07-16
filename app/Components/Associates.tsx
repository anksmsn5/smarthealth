'use client';

import Image from 'next/image';
import iphone from '@/public/img/iphone.png'; // you can remove this if unused
import Link from 'next/link';
import LoginComponent from "./Login";
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';

export default function Associates() {
  const router = useRouter();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [showLoginModal, setShowLoginModal] = useState(false);
  useEffect(() => {
    // Replace 'userToken' with whatever key you're storing the login status
    const token = localStorage.getItem('userToken'); 
    setIsLoggedIn(!!token);
  }, []);

  const handleBookNow = () => {
      const userId = localStorage.getItem("id");
    
    if (!userId) {
      setShowLoginModal(true)
      return;
    }
	else{
		
		router.push('/userpanel/order-test');
	}

  };
function LoginModal({
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
		<LoginComponent
		  redirection={false}
		  onSuccess={onClose}
		  logintype="User"
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
  return (
	<>
    <section className="screenshot-area section-gap-top">
      <div className="container">
        <div className="row d-flex justify-content-center">
          <div className="col-lg-6">
            <div className="section-title text-center">
              <h2>Our Associate</h2>
            </div>
          </div>
        </div>

        <div className="row justify-content-center">
          <div className="col-md-4 text-center">
            <img src="/associates/1.jpeg" className="img-fluid" alt="Logo" />
            <button className="primary-btn price-btn mt-3" onClick={handleBookNow}>
              Book Test Now
            </button>
          </div>
        </div>
      </div>
    </section>
	    <LoginModal
        visible={showLoginModal}
        onClose={() => setShowLoginModal(false)}
     
      />
	</>
  );
}
