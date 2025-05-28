'use client';
import Image from "next/image";
import Link from "next/link";
import Preloader from "./Preloader";
import { useEffect, useState } from "react";
import { FaPhoneAlt, FaMapMarkerAlt, FaEnvelope } from "react-icons/fa";

interface AppSettings {
  title: string;
  email: string;
  phone: string;
  address: string;
  logo: string;
}

const SETTINGS_KEY = 'app_settings';

export default function Header() {
  const [loading, setLoading] = useState(true);
  const [settings, setSettings] = useState<AppSettings | null>(null);

  useEffect(() => {
    const localData = localStorage.getItem(SETTINGS_KEY);
    const parsedLocalData: AppSettings | null = localData ? JSON.parse(localData) : null;
  
    setSettings(parsedLocalData);
    setLoading(false); // Immediately show local data
  
    fetch('https://smarthealthbackend.shreevasudev.in/api/settings')
      .then((res) => res.json())
      .then((json) => {
        if (json.success && json.data) {
          const newData = json.data;
  
          // Compare new data with local data
          const isDifferent = JSON.stringify(parsedLocalData) !== JSON.stringify(newData);
  
          if (isDifferent) {
            localStorage.setItem(SETTINGS_KEY, JSON.stringify(newData));
            setSettings(newData);
          }
        }
      })
      .catch((err) => console.error('Error fetching settings:', err));
  }, []);
  

  if (loading) return <Preloader />;

  return (
    <header id="header">
      {/* Top Info Bar */}
    {/* Top Info Bar */}
<div className="bg-light py-2 border-bottom">
  <div className="container">
    <div className="row text-center text-md-start">
      <div className="col-md-4 d-flex align-items-center justify-content-center justify-content-md-start mb-2 mb-md-0">
        <FaPhoneAlt className="me-2 text-primary" />
        <a href={`tel:${settings?.phone}`} className="text-dark text-decoration-none ms-2">
        &nbsp;{settings?.phone}
        </a>
      </div>
      <div className="col-md-4 d-flex align-items-center justify-content-center mb-2 mb-md-0">
        <FaMapMarkerAlt className="me-5 text-danger" />
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
                src={settings?.logo || "/logo.jpg"}
                width={250}
                height={80}
                alt={settings?.title || "Logo"}
                title={settings?.title || "Logo"}
              />
            </Link>
            
          </div>

          <nav id="nav-menu-container">
            <ul className="nav-menu">
              <li className="menu-has-children">
                <a href="#">Join Our Network</a>
                <ul>
                  <li><a href="elements.html">Elements</a></li>
                </ul>
              </li>

              <li>
                <Link href="/aboutus">About</Link>
              </li>

              <li className="menu-has-children">
                <a href="#">Resources</a>
                <ul>
                  <li><a href="#">Blog Home</a></li>
                  <li><a href="#">Blog Single</a></li>
                </ul>
              </li>

              <li>
                <Link href="/search">Search Providers</Link>
              </li>

              <li>
                <div className="dropdown">
                  <button className="btn btn-primary dropdown-toggle p-1" type="button" data-toggle="dropdown">
                    My Account <span className="caret"></span>
                  </button>
                  <ul className="dropdown-menu">
                    <li><a href="/user/login">User Login</a></li>
                    <li><a href="#">Admin Login</a></li>
                    <li><a href="#">Insurer Login</a></li>
                  </ul>
                </div>
              </li>
            </ul>
          </nav>
        </div>
      </div>
    </header>
  );
}
