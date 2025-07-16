"use client";
import Header from "@/app/Components/Header";
import LabTestList from "@/app/Components/LabTestList";
import DashboardStrip from "@/app/Components/userpanel/DashboardStrip";
import { useEffect } from "react";

export default function LabTestsPage() {
 
  return (
    <>
      <Header />
      <div className="min-vh-100 d-flex justify-content-center align-items-start bg-light py-4">
        <div className="container">
          <div className="row justify-content-center">
            <div className="col-lg-12 col-md-12">
                    <DashboardStrip title={'Book Lab Test'}/>
              <div className="card shadow-sm border-0">
                <div className="card-header bg-primary text-white">
                  <h4 className="mb-0 text-white">List of Available Lab Test</h4>
                </div>
                <div className="card-body">
                  <LabTestList />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
