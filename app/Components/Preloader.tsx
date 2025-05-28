'use client';
import React from 'react';

import 'bootstrap-icons/font/bootstrap-icons.css';
const Preloader = () => {
  return (
    <div
      className="position-fixed top-0 start-0 w-100 h-100 d-flex flex-column justify-content-center align-items-center bg-white"
      style={{ zIndex: 1050 }}
    >
      <i
        className="bi bi-heart-pulse-fill text-danger"
        style={{ fontSize: '3rem', animation: 'pulse 1.5s infinite' }}
      ></i>
      <div className="spinner-border text-primary my-3" role="status">
        <span className="visually-hidden">Loading...</span>
      </div>
      <p className="text-secondary">Please wait while we load your medical data...</p>
    </div>
  );
};

export default Preloader;
