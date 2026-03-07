"use client";

import { packagesApi } from "@/lib/constants";
import Link from "next/link";
import { useEffect, useState } from "react";
import { FaInfoCircle, FaEnvelope, FaRupeeSign } from "react-icons/fa";

interface Package {
  id: number;
  package_name: string;
  slug: string;
}

export default function CommonMenu() {
  const [packages, setPackages] = useState<Package[]>([]);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

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

  return (
    <>
      <li>
        <Link href="/aboutus">
         About
        </Link>
      </li>

      {/* Packages Dropdown */}
      <li style={{ position: "relative" }}>
        <button
          onClick={() => setIsDropdownOpen(!isDropdownOpen)}
          style={{
            background: "none",
            border: "none",
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            gap: "5px",
            outline: "none",
            fontWeight: "500", // ✅ removes focus outline
          }}
        >
          Packages
        </button>

        {isDropdownOpen && (
          <ul
            style={{
              position: "absolute",
              top: "1px",
              outline: "none",
              left: "-50px",
              background: "#fff",
              padding: "10px",
              listStyle: "none",
              minWidth: "180px",
              boxShadow: "0 5px 15px rgba(0,0,0,0.1)",
              borderRadius: "6px",
              zIndex: 999,
            }}
          >
            {packages.length > 0 ? (
              packages.map((pkg) => (
                <li key={pkg.id} style={{ padding: "8px 0" }}>
                  <Link href={`/packages/${pkg.slug}`}>{pkg.package_name}</Link>
                </li>
              ))
            ) : (
              <li>Loading...</li>
            )}
          </ul>
        )}
      </li>

      <li>
        <Link href="/contactus">
          Contact Us
        </Link>
      </li>
    </>
  );
}
