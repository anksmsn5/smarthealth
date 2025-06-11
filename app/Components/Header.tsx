'use client';
import Image from "next/image";
import Link from "next/link";
import Preloader from "./Preloader";
import { useEffect, useState } from "react";
import { FaPhoneAlt, FaMapMarkerAlt, FaEnvelope, FaBars, FaTimes } from "react-icons/fa";
import { useRouter } from "next/navigation";
import { settingsApi, logoUrl } from "@/lib/constants";
import AgentMenu from "./AgentMenu";
import UserMenu from "./UserMenu";
import SubMenu from "./SubMenu";
import CommonMenu from "./CommonMenu";


interface AppSettings {
  title: string;
  email: string;
  mobile: string;
  address: string;
  logo: string;
}

const SETTINGS_KEY = 'app_settings';

export default function Header() {
  const [loading, setLoading] = useState(true);
  const [settings, setSettings] = useState<AppSettings | null>(null);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [token, setToken] = useState<string | null>(null)
  const [userType, setUserType] = useState<string | null>(null)
  const router = useRouter();
  const handleLogout = () => {
    localStorage.removeItem("name");
    localStorage.removeItem("id");
    localStorage.removeItem("email");
    localStorage.removeItem("type");
    setToken(null);
    setIsDropdownOpen(false);
    router.push("/user/login");
  };

  useEffect(() => {
    const localData = localStorage.getItem(SETTINGS_KEY);
    const token = localStorage.getItem("name");
    setUserType(localStorage.getItem("type"))
    setToken(token);
    const parsedLocalData: AppSettings | null = localData ? JSON.parse(localData) : null;

    setSettings(parsedLocalData);
    setLoading(false);

    fetch(settingsApi)
      .then((res) => res.json())
      .then((json) => {
        if (json.status && json.data && json.data.length > 0) {
          const newData = json.data[0];
          const isDifferent = JSON.stringify(parsedLocalData) !== JSON.stringify(newData);
          if (isDifferent) {
            localStorage.setItem(SETTINGS_KEY, JSON.stringify(newData));
            setSettings(newData);
          }
        }
      })
      .catch((err) => console.error('Error fetching settings:', err));
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
      {/* Top Info Bar */}
      <div className="bg-light py-2 border-bottom">
        <div className="container">
          <div className="row text-center text-md-start">
            <div className="col-md-4 d-flex align-items-center justify-content-center justify-content-md-start mb-2 mb-md-0">
              <FaPhoneAlt className="me-2 text-primary" />
              <a href={`tel:${settings?.mobile}`} className="text-dark text-decoration-none ms-2">
                &nbsp;{settings?.mobile}
              </a>
            </div>
            <div className="col-md-4 d-flex align-items-center justify-content-center mb-2 mb-md-0">
              <FaMapMarkerAlt className="me-2 text-danger" />
              <span className="ms-2">&nbsp;{settings?.address}</span>
            </div>
            <div className="col-md-4 d-flex align-items-center justify-content-center justify-content-md-end">
              <FaEnvelope className="me-2 text-success" />
              <a href={`mailto:${settings?.email}`} className="text-dark text-decoration-none ms-2">
                &nbsp;{settings?.email}
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Main Navigation */}
      <div className="container main-menu">
        <div className="row align-items-center justify-content-between d-flex">
          <div id="logo" className="d-flex align-items-center">
            <Link href="/">
              <Image
                src={logoUrl + settings?.logo || "/logo.jpg"}
                width={250}
                height={80}
                alt={settings?.title || "Logo"}
                title={settings?.title || "Logo"}
              />
            </Link>
          </div>

          {/* Hamburger Icon */}
          <div className="d-block d-md-none">
            <button onClick={() => setIsMenuOpen(true)} className="btn btn-outline-secondary">
              <FaBars size={24} />
            </button>
          </div>

          {/* Desktop Menu */}
          <nav id="nav-menu-container" className="d-none d-md-block">
            <ul className="nav-menu">
            <CommonMenu/>
              <li><Link href="/search">Search Providers{userType}</Link></li>

              {userType === '3' && (
                <AgentMenu />
              )}

              {userType === '7' && (
                <UserMenu />
              )}

              {userType !== '3' && userType !== '7' && (
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
          display: isMenuOpen ? 'block' : 'none',
          position: 'fixed',
          top: 0,
          left: 0,
          height: '100%',
          width: '250px',
          backgroundColor: '#fff',
          zIndex: 9999,
          boxShadow: '2px 0 8px rgba(0,0,0,0.2)',
          padding: '1rem',
        }}
      >
        <div className="d-flex justify-content-between align-items-center mb-4">
          <h5 className="mb-0">Menu</h5>
          <button onClick={() => setIsMenuOpen(false)} className="btn btn-link text-danger">
            <FaTimes size={24} />
          </button>
        </div>
        <ul className="list-unstyled">
          <li><a href="#" className="d-block py-2">Join Our Network</a></li>
          <li><Link href="/aboutus" className="d-block py-2">About</Link></li>
          <li><a href="#" className="d-block py-2">Blog Home</a></li>
          <li><a href="#" className="d-block py-2">Blog Single</a></li>
          <li><Link href="/search" className="d-block py-2">Search Providers</Link></li>
          <li><a href="/user/login" className="d-block py-2">User Login</a></li>
          <li><a href="https://smarthealthbackend.shreevasudev.in/" className="d-block py-2">Admin Login</a></li>
          <li><a href="/agent/login" className="d-block py-2">Insurer Login</a></li>
        </ul>
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
