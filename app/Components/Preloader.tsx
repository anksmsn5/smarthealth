'use client';
import React from 'react';

import 'bootstrap-icons/font/bootstrap-icons.css';
import { FaSpinner } from 'react-icons/fa';
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
         <FaSpinner/>
      </div>
     
    </div>
  );
};

export default Preloader;
