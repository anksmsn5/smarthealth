'use client';
import React from 'react';
import 'bootstrap-icons/font/bootstrap-icons.css';

const LoginPreloader = () => {
  return (
    <div
      className="position-fixed top-0 start-0 w-100 h-100 d-flex flex-column justify-content-center align-items-center bg-white"
      style={{ zIndex: 1050 }}
    >
      <i
        className="bi bi-person-circle text-primary"
        style={{ fontSize: '3rem', animation: 'spin 1.5s linear infinite' }}
      ></i>
      <div className="spinner-border text-success my-3" role="status">
        <span className="visually-hidden">Logging in...</span>
      </div>
      <p className="text-secondary">Logging you in. Please wait...</p>
    </div>
  );
};

export default LoginPreloader;
