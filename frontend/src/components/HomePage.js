import React, { useEffect, useState } from "react";
import { Button, Typography } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { logoutUser } from "../store/slice/authSlice";
import { useGetDevicesQuery, useLogoutMutation } from "../services/testApi";
import LoadingBar from "./LoadingBar";
import Popup from "./ErrorPopup";
import HelpModal from "./Modal/HelpModal";
import ExportModal from "./Modal/ExportModal";

function HomePage() {
  const [openHelpModal, setOpenHelpModal] = useState(false);
  const [openExportModal, setOpenExportModal] = useState(false);
  const { data: devices, error, isLoading } = useGetDevicesQuery();
  const [logout] = useLogoutMutation();
  const navigate = useNavigate();
  const [showError, setShowError] = useState(false);
  const dispatch = useDispatch();

  useEffect(() => {
    if (error) setShowError(true);
  }, [error]);

  const handleCloseErrorPopup = () => setShowError(false);

  const handleLogout = async () => {
    try {
      await logout().unwrap();
      dispatch(logoutUser());
      navigate("/login");
    } catch (error) {
      console.error("Erreur lors de la déconnexion", error);
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center p-4">
        <h1 className="text-xl font-serif cursor-pointer text-blue-600 hover:text-blue-400">
          Plateforme-IoT
        </h1>
        <div className="flex space-x-4">
          <Button
            variant="contained"
            color="primary"
            onClick={() => setOpenExportModal(true)}
          >
            Exporter Données
          </Button>
          <Button
            variant="contained"
            color="primary"
            onClick={() => setOpenHelpModal(true)}
          >
            Aide
          </Button>
          <Button variant="outlined" color="secondary" onClick={handleLogout}>
            Déconnexion
          </Button>
        </div>
      </div>

      {isLoading && <LoadingBar />}
      {showError && (
        <Popup
          message={`Erreur lors du chargement: ${error}`}
          onClose={handleCloseErrorPopup}
        />
      )}

      <HelpModal
        open={openHelpModal}
        handleClose={() => setOpenHelpModal(false)}
      />
      <ExportModal
        open={openExportModal}
        handleClose={() => setOpenExportModal(false)}
      />

      <div className="mt-6">
        <Typography variant="h4" component="h2" gutterBottom>
          Liste des Devices
        </Typography>
        {devices && devices.length > 0 ? (
          <ul>
            {devices.map((device) => (
              <li key={device.id}>
                ID: {device.device_id} - Temp: {device.temperature}°C -
                Humidité: {device.humidity}% - Créé le: {device.date_create}
              </li>
            ))}
          </ul>
        ) : (
          <Typography variant="body1">Aucun device trouvé</Typography>
        )}
      </div>
    </div>
  );
}

export default HomePage;
