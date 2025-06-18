import { Modal } from "react-bootstrap";
import { FC } from "react";

interface LabTestsModalProps {
  show: boolean;
  onHide: () => void;
}

const LabTestsModal: FC<LabTestsModalProps> = ({ show, onHide }) => {
  return (
    <Modal show={show} onHide={onHide}>
      <Modal.Header closeButton>
        <Modal.Title>Book Appointment</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {/* Modal content goes here */}
      </Modal.Body>
    </Modal>
  );
};

export default LabTestsModal;
