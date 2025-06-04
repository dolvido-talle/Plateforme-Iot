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
import Datatable from "./DataTable";

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

  const exportCSV = () => {
    if (!devices || devices.length === 0) return;

    const headers = Object.keys(devices[0]);

    const escapeCSVValue = (value) => {
      if (value === null || value === undefined) return "";
      const str = String(value);
      // Échapper les guillemets en les doublant
      const escaped = str.replace(/"/g, '""');
      return `"${escaped}"`; // entoure de guillemets
    };

    const csvRows = [
      headers.join(","), // ligne d'en-tête
      ...devices.map((device) =>
        headers.map((header) => escapeCSVValue(device[header])).join(",")
      ),
    ];

    const blob = new Blob([csvRows.join("\n")], {
      type: "text/csv;charset=utf-8;",
    });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "devices.csv";
    a.click();
    window.URL.revokeObjectURL(url);
  };

  const exportJSON = () => {
    if (!devices || devices.length === 0) return;

    const json = JSON.stringify(devices, null, 2);
    const blob = new Blob([json], { type: "application/json" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "devices.json";
    a.click();
    window.URL.revokeObjectURL(url);
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
        exportCSV={exportCSV}
        exportJSON={exportJSON}
      />

      <div className="mt-6">
        <Typography variant="h4" component="h2" gutterBottom>
          Liste des Données
        </Typography>
        {devices && devices.length > 0 ? (
          <Datatable devices={devices} />
        ) : (
          <Typography variant="body1">Aucune device trouvé</Typography>
        )}
      </div>
    </div>
  );
}

export default HomePage;
