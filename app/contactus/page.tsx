"use client";

import { useState, useEffect } from 'react';
import Header from "@/app/Components/Header";
import Footer from "@/app/Components/Footer";
import { settingsApi } from '@/lib/constants';

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
      <section className="banner-area">
        <div className="container">
          <div className="row banner-content">
            <div className="col-lg-12 d-flex align-items-center justify-content-between">
              <div className="row w-100">
                <div className="col-md-6">
                  <h2>Contact Us</h2>
                  <form onSubmit={handleSubmit}>
                    <div className="form-group">
                      <label htmlFor="name">Name</label>
                      <input
                        type="text"
                        className="form-control"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        required
                      />
                    </div>
                    <div className="form-group">
                      <label htmlFor="email">Email</label>
                      <input
                        type="email"
                        className="form-control"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        required
                      />
                    </div>
                    <div className="form-group">
                      <label htmlFor="message">Message</label>
                      <textarea
                        className="form-control"
                        name="message"
                        rows={5}
                        value={formData.message}
                        onChange={handleChange}
                        required
                      ></textarea>
                    </div>
                    <button type="submit" className="btn btn-primary mt-3">Send Message</button>
                  </form>
                </div>

                <div className="col-md-6 right-part">
                  <div className="mt-3">
                    <a href="/">Home</a>
                    <span className="fa fa-caret-right mx-2"></span>
                    <a href="/contact">Contact Us</a>
                  </div>
                  <h3 className='mt-3'>Contact Information</h3>
                 <h4 className='mt-3 mb-3'>{settings.title}</h4>
                  <p><strong>Address:</strong> {settings.address}</p>
                  <p><strong>Phone:</strong> {settings.phone}</p>
                  <p><strong>Email:</strong> {settings.email}</p>
                 
                  <p><strong>Email:</strong> {settings.email}</p>
                  <p><strong>Working Hours:</strong> {settings.working_hours}</p>
                  <h4 className='mt-3'>Support</h4>
                  <p>
  For any kind of support write us on  
  <a href="mailto:support@smart-health.co.in" className='text-danger'> support@smart-health.co.in</a> or call us at <a href={`tel:${settings.phone}`} className='text-danger'> {settings.phone}</a>
</p>

                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      <Footer />
    </>
  );
}
