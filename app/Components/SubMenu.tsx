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

 
export default function SubMenu() {
 
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  
  const router = useRouter();
 


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
    
    <li>
  <div className="dropdown position-relative">
    <button
      id="dropdown-toggle"
      className="btn btn-primary dropdown-toggle p-1"
      type="button"
      onClick={() => setIsDropdownOpen(prev => !prev)}
    >
      My Account <span className="caret"></span>
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
      <li><a className="dropdown-item" href="/user/login">User Login</a></li>
      
      <li><a className="dropdown-item" href="/agent/login">Partner Login</a></li>
    </ul>
  </div>
</li>
</>
  );
}
