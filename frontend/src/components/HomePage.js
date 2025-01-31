import React, { useEffect, useState } from "react";
import ConnectWithoutContactIcon from "@mui/icons-material/ConnectWithoutContact";
import { useGetCategoriesQuery } from "../services/testApi";
import LoadingBar from "./LoadingBar";
import Popup from "./ErrorPopup";
import { Button } from "@mui/material";
import HelpModal from "./Modal/HelpModal";
import ExportModal from "./Modal/ExportModal";

function HomePage() {
  const { error, isLoading } = useGetCategoriesQuery();
  const [showError, setShowError] = useState(false);
  const [openHelpModal, setOpenHelpModal] = useState(false);
  const [openExportModal, setOpenExportModal] = useState(false);

  useEffect(() => {
    if (error) {
      setShowError(true);
    }
  }, [error]);

  const handleCloseErrorPopup = () => {
    setShowError(false);
  };

  const handleOpenHelpModal = () => {
    setOpenHelpModal(true);
  };

  const handleCloseHelpModal = () => {
    setOpenHelpModal(false);
  };

  const handleOpenExportModal = () => {
    setOpenExportModal(true);
  };

  const handleCloseExportModal = () => {
    setOpenExportModal(false);
  };

  const exportCSV = () => {
    const rows = [
      { name: "Item 1", calories: 100, fat: 10 },
      { name: "Item 2", calories: 200, fat: 20 },
    ];

    const headers = "name,calories,fat";

    const csvData = [
      headers,
      ...rows.map((row) => `${row.name},${row.calories},${row.fat}`), // Ajouter les lignes de données
    ].join("\n");

    const blob = new Blob([csvData], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "data.csv";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  const exportJSON = () => {
    const rows = [
      { name: "Item 1", calories: 100, fat: 10 },
      { name: "Item 2", calories: 200, fat: 20 },
      // On remplacer par les vraies données du tableau plus tard
    ];
    const jsonData = JSON.stringify(rows);
    const blob = new Blob([jsonData], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "data.json";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  return (
    <div>
      {/* Contenu principal */}
      <div className="flex justify-between items-center p-4">
        <h1 className="text-xl font-serif cursor-pointer text-blue-600 hover:text-blue-400">
          Plateforme-IoT
        </h1>
        <div className="flex space-x-4">
          <Button
            variant="contained"
            color="primary"
            onClick={handleOpenExportModal}
          >
            Exporter Données
          </Button>

          <Button
            variant="contained"
            color="primary"
            onClick={handleOpenHelpModal}
          >
            Aide
          </Button>

          <Button variant="outlined" color="secondary">
            Déconnexion
          </Button>
        </div>
      </div>

      {/* LoadingBar */}
      {isLoading && (
        <div className="fixed top-0 left-0 w-full z-10">
          <LoadingBar />
        </div>
      )}

      {/* Popup pour l'erreur */}
      {showError && (
        <Popup
          message={`Erreur lors du chargement: ${error?.message}`}
          onClose={handleCloseErrorPopup}
        />
      )}

      {/* Modal pour Aide */}
      <HelpModal open={openHelpModal} handleClose={handleCloseHelpModal} />

      {/* Modal pour Export */}
      <ExportModal
        open={openExportModal}
        handleClose={handleCloseExportModal}
        exportCSV={exportCSV}
        exportJSON={exportJSON}
      />
    </div>
  );
}

export default HomePage;
