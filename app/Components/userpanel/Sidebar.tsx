// components/Sidebar.tsx
'use client'

import { useState } from 'react';
import { Menu, X } from 'lucide-react';
import Link from 'next/link';

export default function Sidebar() {
  const [open, setOpen] = useState(false);

  return (
    <div className="flex">
      {/* Mobile Menu Toggle */}
      <button
        className="lg:hidden p-4"
        onClick={() => setOpen(!open)}
      >
        {open ? <X /> : <Menu />}
      </button>

      {/* Sidebar */}
      <aside className={`fixed z-40 lg:static top-0 left-0 h-full bg-gray-800 text-white w-64 transform transition-transform ${open ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0`}>
        <div className="p-4 font-bold text-xl border-b border-gray-700">
          My App
        </div>
        <nav className="flex flex-col gap-4 p-4">
          <Link href="/" className="hover:bg-gray-700 rounded px-2 py-1">Home</Link>
          <Link href="/about" className="hover:bg-gray-700 rounded px-2 py-1">About</Link>
          <Link href="/contact" className="hover:bg-gray-700 rounded px-2 py-1">Contact</Link>
        </nav>
      </aside>
    </div>
  );
}
