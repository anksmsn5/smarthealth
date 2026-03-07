"use client";

import { useState, useEffect } from 'react';
import Header from "@/app/Components/Header";
import Footer from "@/app/Components/Footer";
import { settingsApi } from '@/lib/constants';
import Packages from '../Components/Packages';

export default function ContactUs() {
  const [formData, setFormData] = useState({
    name: '',
    title:'',
    email: '',
    message: '',
  });

  const [settings, setSettings] = useState({
    address: '',
    phone: '',
    title:'',
    email: '',
    working_hours: '',
  });

  // Fetch settings from API on component mount
  useEffect(() => {
    fetch(settingsApi) // Change this to your actual API route
      .then((res) => res.json())
      .then((data) => {
        if (data.status) {
          const setting = data.data[0] || {};
         
          setSettings({
            title: setting.title || 'Not Available',
            address: setting.address || 'Not Available',
            phone: setting.mobile || 'Not Available',
            email: setting.email || 'Not Available',
            working_hours: setting.working_hours || 'Mon - Fri: 9AM - 6PM',
          });
        }
      })
      .catch((err) => {
        console.error("Failed to fetch settings:", err);
      });
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    alert("Message sent successfully!");
    setFormData({ name: '', email: '', message: '',  title:'' });
  };

  return (
    <>
      <Header />
      <Packages/>
      <Footer />
    </>
  );
}
