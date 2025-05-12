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

function HelpModal({ open, handleClose }) {
  return (
    <Modal
      open={open}
      onClose={handleClose}
      aria-labelledby="modal-help-title"
      aria-describedby="modal-help-description"
    >
      <Box sx={modalStyle}>
        <Typography id="modal-help-title" variant="h6" component="h2">
          Informations sur les données du tableau
        </Typography>
        <Typography id="modal-help-description" sx={{ mt: 2 }}>
          Ce tableau contient des informations sur divers données : température,
          precipitations, pression, humidité.
          Ces données sont essentielles pour la gestion de la Plateforme-IoT.
        </Typography>
        <Button
          variant="contained"
          color="primary"
          onClick={handleClose}
          sx={{ mt: 2 }}
        >
          Fermer
        </Button>
      </Box>
    </Modal>
  );
}

export default HelpModal;
