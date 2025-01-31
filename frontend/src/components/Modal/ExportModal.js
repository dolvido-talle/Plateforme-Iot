import { Modal, Box, Typography, Button } from "@mui/material";

const modalStyle = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  bgcolor: "background.paper",
  boxShadow: 24,
  p: 4,
  borderRadius: 2,
};

function ExportModal({ open, handleClose, exportCSV, exportJSON }) {
  return (
    <Modal
      open={open}
      onClose={handleClose}
      aria-labelledby="modal-export-title"
      aria-describedby="modal-export-description"
    >
      <Box sx={modalStyle}>
        <Typography id="modal-export-title" variant="h6" component="h2">
          Choisissez le format d'exportation
        </Typography>
        <Button
          variant="contained"
          color="primary"
          onClick={exportCSV}
          sx={{ mt: 2 }}
        >
          Exporter en CSV
        </Button>
        <Button
          variant="contained"
          sx={{ mt: 2, backgroundColor: "red", color: "white" }} // Ajouter une marge en haut et changer la couleur
          onClick={exportJSON}
        >
          Exporter en JSON
        </Button>
      </Box>
    </Modal>
  );
}

export default ExportModal;
