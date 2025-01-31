import { useEffect } from "react";
import PropTypes from "prop-types";

function ErrorPopup({ message, onClose }) {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, 3000);
    return () => clearTimeout(timer);
  }, [onClose]);

  return (
    <div className="fixed top-0 right-4 bg-red-600 text-white p-4 rounded shadow-lg z-20">
      <div className="flex justify-between items-center">
        <span>{message}</span>
        <button onClick={onClose} className="ml-4 text-white font-bold">
          X
        </button>
      </div>
    </div>
  );
}

ErrorPopup.propTypes = {
  message: PropTypes.string.isRequired,
  onClose: PropTypes.func.isRequired,
};

export default ErrorPopup;
