'use client';
import Image from "next/image";
import Link from "next/link";

import { useEffect, useState } from "react";
import { FaPhoneAlt, FaMapMarkerAlt, FaEnvelope, FaBars, FaTimes } from "react-icons/fa";
import { useRouter } from "next/navigation";


interface AppSettings {
  title: string;
  email: string;
  phone: string;
  address: string;
  logo: string;
}

 

export default function AgentMenu() {
 
 
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [token, setToken] = useState<string| null>(null)
  const router = useRouter();
  const handleLogout = () => {
    
    localStorage.removeItem("name");
    localStorage.removeItem("id");
    localStorage.removeItem("email");
    localStorage.removeItem("type");
    setToken(null);
    setIsDropdownOpen(false);
    router.push("/agent/login");
  };

  

  // Close dropdown on outside click
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      const dropdown = document.getElementById("dropdown-menu");
      const toggleBtn = document.getElementById("dropdown-toggle");
      if (
        dropdown &&
        !dropdown.contains(event.target as Node) &&
        toggleBtn &&
        !toggleBtn.contains(event.target as Node)
      ) {
        setIsDropdownOpen(false);
      }
    }

    if (isDropdownOpen) {
      document.addEventListener("click", handleClickOutside);
    }

    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  }, [isDropdownOpen]);

 

  return (
    <>
     
            <li><Link href="/agent/customers">Customers</Link></li>
           
              <li>
                <div className="dropdown position-relative">
                  <button
                    id="dropdown-toggle"
                    className="btn btn-primary dropdown-toggle p-1"
                    type="button"
                    onClick={() => setIsDropdownOpen(prev => !prev)}
                  >
                   {localStorage.getItem('name')} (Partner)<span className="caret"></span>
                  </button>
                  <ul
                    id="dropdown-menu"
                    className={`dropdown-menu ${isDropdownOpen ? 'show' : ''}`}
                    style={{
                      display: isDropdownOpen ? 'block' : 'none',
                      position: 'absolute',
                      top: '100%',
                      left: 0,
                      zIndex: 1000,
                    }}
                  >
                   <li><a className="dropdown-item" href="/agent/dashboard">Dashboards</a></li>
                    
                    <li><a className="dropdown-item" href="#">My Profile</a></li>
                    <li><a className="dropdown-item" href="/agent/change-password">Change Password</a></li>
                    <li><a className="dropdown-item" href="#" onClick={handleLogout}>Logout</a></li>
                  </ul>
                </div>
              </li>
              </>
  );
}
