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

 

export default function CommonMenu() {
 
 
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [token, setToken] = useState<string| null>(null)
 
  

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
     
     <li className="menu-has-children">
                <a href="#">Join Our Network</a>
                <ul>
                  <li><a href="#">Elements</a></li>
                </ul>
              </li>
              <li><Link href="/aboutus">About</Link></li>
              <li className="menu-has-children">
                <a href="#">Resources</a>
                <ul>
                  <li><a href="#">Blog Home</a></li>
                  <li><a href="#">Blog Single</a></li>
                </ul>
              </li>
              </>
  );
}
