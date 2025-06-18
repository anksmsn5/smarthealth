import { Modal, Spinner } from "react-bootstrap";
import { FC, useEffect, useState } from "react";
import {
  FaCalendarCheck,
  FaEnvelope,
  FaInfoCircle,
  FaLocationArrow,
  FaMapMarker,
  FaPhone,
  FaStethoscope,
} from "react-icons/fa";
import { getNearByDoctors } from "@/lib/constants"; // Example: "/api/get_nearby_doctors.php"

// ----------------- Types -----------------
interface BookAppointmentModalProps {
  show: boolean;
  onHide: () => void;
  user_id: number;
}

export interface Doctor {
  id: number;
  name: string;
  email: string;
  mobile: string;
  address: string;
  state: string;
  latitude: string;
  longitude: string;
  city: string;
  distance: number;
}

// ----------------- Doctor Profile Modal -----------------
interface DoctorProfileModalProps {
  show: boolean;
  onHide: () => void;
  doctor: Doctor;
}

const DoctorProfileModal: FC<DoctorProfileModalProps> = ({ show, onHide, doctor }) => {
    return (
      <Modal
        show={show}
        onHide={onHide}
        centered
        dialogClassName="modal-xl doctor-modal"
        backdropClassName="custom-backdrop"
      >
        <Modal.Header className="bg-secondary text-white" closeButton>
          <Modal.Title>Doctor Profile</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <h5>
            <FaStethoscope className="me-2" /> {doctor.name}
          </h5>
          <p>
            <FaEnvelope className="me-2" /> {doctor.email}
          </p>
          <p>
            <FaPhone className="me-2" /> {doctor.mobile}
          </p>
          <p>
            <FaMapMarker className="me-2" /> {doctor.address}, {doctor.city}, {doctor.state}
          </p>
          <p>Distance: {doctor.distance.toFixed(2)} km away</p>
        </Modal.Body>
      </Modal>
    );
  };
  

// ----------------- Appointment Booking Modal -----------------
interface AppointmentBookingModalProps {
  show: boolean;
  onHide: () => void;
  doctor: Doctor;
}

const AppointmentBookingModal: FC<AppointmentBookingModalProps> = ({ show, onHide, doctor }) => {
    return (
      <Modal
        show={show}
        onHide={onHide}
        centered
        dialogClassName="modal-xl doctor-modal"
        backdropClassName=""
      >
        <Modal.Header className="bg-success text-white" closeButton>
          <Modal.Title>Book Appointment with {doctor.name}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <form>
            <div className="mb-3">
              <label className="form-label">Appointment Date</label>
              <input type="date" className="form-control" />
            </div>
            <div className="mb-3">
              <label className="form-label">Message</label>
              <textarea className="form-control" rows={3}></textarea>
            </div>
            <button type="submit" className="btn btn-success">
              Book Appointment
            </button>
          </form>
        </Modal.Body>
      </Modal>
    );
  };
  

// ----------------- Main BookAppointmentModal -----------------
const BookAppointmentModal: FC<BookAppointmentModalProps> = ({ show, onHide, user_id }) => {
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>("");

  // State for controlling the additional modals
  const [selectedDoctor, setSelectedDoctor] = useState<Doctor | null>(null);
  const [showProfileModal, setShowProfileModal] = useState<boolean>(false);
  const [showBookingModal, setShowBookingModal] = useState<boolean>(false);

  useEffect(() => {
    if (show) {
      fetchDoctors();
    }
  }, [show]);

  const fetchDoctors = async () => {
    setLoading(true);
    setError("");

    try {
      const res = await fetch(getNearByDoctors, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ user_id }),
      });

      const response = await res.json();
      if (response.status && response.data) {
        setDoctors(response.data);
      } else {
        setError(response.message || "Unable to fetch doctors.");
      }
    } catch (err) {
      console.error(err);
      setError("Something went wrong while fetching doctors.");
    } finally {
      setLoading(false);
    }
  };

  // Handlers for the additional modals
  const handleViewProfile = (doctor: Doctor) => {
    setSelectedDoctor(doctor);
    setShowProfileModal(true);
  };

  const handleBookNow = (doctor: Doctor) => {
    setSelectedDoctor(doctor);
    setShowBookingModal(true);
  };

  return (
    <>
      <Modal show={show} onHide={onHide} centered dialogClassName="modal-lg">
        <Modal.Header className="bg-primary text-white" closeButton>
          <Modal.Title className="text-white">Book Appointment</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {loading ? (
            <div className="text-center">
              <Spinner animation="border" />
              <p>Loading nearby doctors...</p>
            </div>
          ) : error ? (
            <div className="text-danger text-center">{error}</div>
          ) : doctors.length > 0 ? (
            <div className="row">
              {doctors.map((doctor) => (
                <div key={doctor.id} className="col-md-6 mb-4">
                  <div className="card h-100 shadow-sm">
                    <div className="card-body">
                      <h5 className="card-title">
                        <FaStethoscope className="me-2" /> {doctor.name}
                      </h5>
                      <p className="card-text mb-1">
                        <FaEnvelope className="me-2" /> {doctor.email}
                      </p>
                      <p className="card-text mb-1">
                        <FaPhone className="me-2" /> {doctor.mobile}
                      </p>
                      <p className="card-text">
                        <FaMapMarker className="me-2" /> {doctor.address}, {doctor.city}, {doctor.state}
                      </p>
                    </div>
                    <div className="card-footer bg-white">
                      {/* First row: Distance and Locate on Map */}
                      <div className="row g-2">
                        <div className="col-6">
                          <button className="btn btn-sm btn-primary w-100">
                            <FaLocationArrow className="me-2" />
                            {doctor.distance.toFixed(2)} km away
                          </button>
                        </div>
                        <div className="col-6">
                          <button
                            className="btn btn-sm btn-secondary w-100"
                            onClick={() =>
                              window.open(
                                `https://www.google.com/maps/search/?api=1&query=${doctor.latitude},${doctor.longitude}`,
                                "_blank"
                              )
                            }
                          >
                            <FaMapMarker className="me-1" />
                            Locate on Map
                          </button>
                        </div>
                      </div>
                      {/* Second row: View Profile and Book Now */}
                      <div className="row g-2 mt-2">
                        <div className="col-6">
                          <button
                            className="btn btn-sm btn-success w-100"
                            onClick={() => handleViewProfile(doctor)}
                          >
                            <FaInfoCircle className="me-1" />
                            View Profile
                          </button>
                        </div>
                        <div className="col-6">
                          <button
                            className="btn btn-sm btn-warning w-100"
                            onClick={() => handleBookNow(doctor)}
                          >
                            <FaCalendarCheck className="me-1" />
                            Book Now
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center">No nearby doctors found.</div>
          )}
        </Modal.Body>
      </Modal>

      {/* Doctor Profile Modal */}
      {selectedDoctor && (
        <DoctorProfileModal
          show={showProfileModal}
          onHide={() => setShowProfileModal(false)}
          doctor={selectedDoctor}
        />
      )}

      {/* Appointment Booking Modal */}
      {selectedDoctor && (
        <AppointmentBookingModal
          show={showBookingModal}
          onHide={() => setShowBookingModal(false)}
          doctor={selectedDoctor}
        />
      )}
    </>
  );
};

export default BookAppointmentModal;
