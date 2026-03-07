"use client";
import Image from "next/image";
import Link from "next/link";
import Preloader from "./Preloader";
import { useEffect, useState } from "react";
import {
  FaPhoneAlt,
  FaMapMarkerAlt,
  FaEnvelope,
  FaBars,
  FaTimes,
  FaHome,
  FaUser,
  FaHandshakeSlash,
  FaUserMd,
  FaInfoCircle,
  FaDashcube,
  FaTachometerAlt,
  FaFirstOrder,
  FaKey,
  FaSignOutAlt,
  FaSearch,
} from "react-icons/fa";
import { useRouter } from "next/navigation";
import { settingsApi, logoUrl, packagesApi } from "@/lib/constants";
import AgentMenu from "./AgentMenu";
import UserMenu from "./UserMenu";
import SubMenu from "./SubMenu";
import CommonMenu from "./CommonMenu";
import DoctorMenu from "./DoctorMenu";

interface AppSettings {
  title: string;
  email: string;
  mobile: string;
  address: string;
  logo: string;
}
interface Package {
  id: number;
  package_name: string;
  slug: string;
}
const SETTINGS_KEY = "app_settings";

export default function Header() {
  const [loading, setLoading] = useState(true);
  const [settings, setSettings] = useState<AppSettings | null>(null);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [token, setToken] = useState<string | null>(null);
  const [userType, setUserType] = useState<string | null>(null);
  const router = useRouter();
  const handleLogout = () => {
    localStorage.clear();
    setToken(null);
    setIsDropdownOpen(false);
    router.push("/user/login");
  };
const [packages, setPackages] = useState<Package[]>([]);
 const [open, setOpen] = useState(false);

  // Fetch Packages
  useEffect(() => {
    async function fetchPackages() {
      try {
        const res = await fetch(packagesApi);
        const data = await res.json();
        setPackages(data.data);
      } catch (error) {
        console.error("Error fetching packages:", error);
      }
    }

    fetchPackages();
  }, []);
  useEffect(() => {
    const localData = localStorage.getItem(SETTINGS_KEY);
    const token = localStorage.getItem("name");
    setUserType(localStorage.getItem("type"));
    setToken(token);
    const parsedLocalData: AppSettings | null = localData
      ? JSON.parse(localData)
      : null;

    setSettings(parsedLocalData);
    setLoading(false);

    fetch(settingsApi)
      .then((res) => res.json())
      .then((json) => {
        if (json.status && json.data && json.data.length > 0) {
          const newData = json.data[0];
          const isDifferent =
            JSON.stringify(parsedLocalData) !== JSON.stringify(newData);
          if (isDifferent) {
            localStorage.setItem(SETTINGS_KEY, JSON.stringify(newData));
            setSettings(newData);
          }
        }
      })
      .catch((err) => console.error("Error fetching settings:", err));
  }, []);

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

  if (loading) return <Preloader />;

  return (
    <header id="header">
     
      {/* Main Navigation */}
      <div className="container main-menu">
        <div className="row align-items-center justify-content-between d-flex">
          <div id="logo" className="d-flex align-items-center">
            <Link href="/">
              <img
                src={logoUrl + settings?.logo || "/logo.jpg"}
                className="logo"
                alt={settings?.title || "Logo"}
                title={settings?.title || "Logo"}
              />
            </Link>
          </div>

          {/* Hamburger Icon */}
          <div className="d-block d-md-none">
            <button
              onClick={() => setIsMenuOpen(true)}
              className="btn btn-outline-secondary"
            >
              <FaBars size={24} />
            </button>
          </div>

          {/* Desktop Menu */}
          <nav id="nav-menu-container" className="d-none d-md-block">
            <ul className="nav-menu">
              {userType != "2" && (
                <>
                  <CommonMenu />

                  <li>
                    <Link href="/search">Search Providers</Link>
                  </li>
                </>
              )}
              {userType === "3" && <AgentMenu />}

              {userType === "7" && <UserMenu />}
              {userType === "2" && <DoctorMenu />}
              {userType !== "3" && userType !== "7" && userType !== "2" && (
                <>
                  <SubMenu />
                </>
              )}
            </ul>
          </nav>
        </div>
      </div>

      {/* Mobile Side Menu */}
      <div
        className="mobile-menu"
        style={{
          display: isMenuOpen ? "block" : "none",
          position: "fixed",
          top: 0,
          left: 0,
          height: "100%",
          width: "250px",
          backgroundColor: "#fff",
          zIndex: 9999,
          boxShadow: "2px 0 8px rgba(0,0,0,0.2)",
          padding: "1rem",
        }}
      >
         {!userType && (
 <>
          <ul className="list-unstyled sidemenu">
              <li>
                <a href="/" className="d-block py-2">
                  Home
                </a>
              </li>
              <li>
   <button
  className="d-block py-2 w-100 text-left bg-transparent border-0 shadow-none"
  style={{ outline: "none" }}
  onClick={() => setOpen(!open)}
>
  Packages
</button>

        {open && (
          <ul className="list-unstyled ps-3">
            {packages.length > 0 ? (
              packages.map((pkg) => (
            <li key={pkg.id} style={{ padding: "8px 0" }}>
             <Link href={`/packages/${pkg.slug}`} style={{fontSize:'11px'}}>{pkg.package_name}</Link>
            </li>
             ))
            ) : (
              <li>Loading...</li>
            )}
          </ul>
        )}
      </li>
              <li>
                <Link href="/user/login" className="d-block py-2">
                User Login
                </Link>
              </li>

              <li>
                <Link href="/agent/login" className="d-block py-2">
                 Partner Login </Link>
              </li>
              <li>
                <a href="/doctor/login" className="d-block py-2">
                  Doctor Login
                </a>
              </li>
 
            </ul>
 </>
            )}
        {userType === "7" && (
          <>
            <div className="d-flex justify-content-between align-items-center mb-4">
              <h5 className="mb-0"> {localStorage.getItem("name")}</h5>
              <button
                onClick={() => setIsMenuOpen(false)}
                className="btn btn-link text-danger"
              >
                <FaTimes size={24} />
              </button>
            </div>
            <ul className="list-unstyled sidemenu">
              <li>
                <a href="/" className="d-block py-2">
                  Home
                </a>
              </li>
              <li>
                <Link href="/aboutus" className="d-block py-2">
               About
                </Link>
              </li>

              <li>
                <Link href="/userpanel/dashboard" className="d-block py-2">
             Dashboard
                </Link>
              </li>
              <li>
                <a href="/userpanel/orders" className="d-block py-2">
                My Orders
                </a>
              </li>

              <li>
                <a href="/userpanel/change-password" className="d-block py-2">
                Change Password
                </a>
              </li>
              <li>
                <a href="#" onClick={handleLogout}>
                 <FaSignOutAlt/> Logout
                </a>
              </li>
            </ul>{" "}
          </>
        )}



        {userType === "2" && (
          <>
            <div className="d-flex justify-content-between align-items-center mb-4">
              <h5 className="mb-0"> {localStorage.getItem("name")}<br/>(Doctor)</h5>
              <button
                onClick={() => setIsMenuOpen(false)}
                className="btn btn-link text-danger"
              >
                <FaTimes size={24} />
              </button>
            </div>
            <ul className="list-unstyled sidemenu">
              <li>
                <a href="/" className="d-block py-2">
                 <FaTachometerAlt/> Dashboard
                </a>
              </li>
               
              <li>
                <a href="/doctor/appointments" className="d-block py-2">
                <FaFirstOrder/>  Appointments
                </a>
              </li>

              <li>
                <a href="/doctor/change-password" className="d-block py-2">
                 <FaKey/> Change Password
                </a>
              </li>
              <li>
                <a href="#" onClick={handleLogout}>
                 <FaSignOutAlt/> Logout
                </a>
              </li>
            </ul>{" "}
          </>
        )}



         {userType === "3" && (
          <>
            <div className="d-flex justify-content-between align-items-center mb-4">
              <h5 className="mb-0"> {localStorage.getItem("name")}<br/>(Partner)</h5>
              <button
                onClick={() => setIsMenuOpen(false)}
                className="btn btn-link text-danger"
              >
                <FaTimes size={24} />
              </button>
            </div>
            <ul className="list-unstyled sidemenu">
              <li>
                <a href="/agent/dashboard" className="d-block py-2">
                 <FaTachometerAlt/> Dashboard
                </a>
              </li>
               
              <li>
                <a href="/agent/customers" className="d-block py-2">
                <FaFirstOrder/>  Customers
                </a>
              </li>

              <li>
                <a href="/agent/change-password" className="d-block py-2">
                 <FaKey/> Change Password
                </a>
              </li>
              <li>
                <a href="#" onClick={handleLogout}>
                 <FaSignOutAlt/> Logout
                </a>
              </li>
            </ul>{" "}
          </>
        )}
      </div>

      {/* Overlay */}
      {isMenuOpen && (
        <div
          className="position-fixed top-0 start-0 w-100 h-100 bg-dark bg-opacity-50"
          style={{ zIndex: 9998 }}
          onClick={() => setIsMenuOpen(false)}
        />
      )}
    </header>
  );
}
