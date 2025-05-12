// src/pages/ResetPassword.js
import React, { useState } from "react";
import { Box, TextField, Button, Typography, Alert } from "@mui/material";
import { useRequestPasswordResetMutation } from "../services/testApi";
import { useNavigate } from "react-router-dom";

export default function ResetPassword() {
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [requestReset, { isLoading }] = useRequestPasswordResetMutation();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    try {
      await requestReset({ email }).unwrap();
      setSuccess("Un code vient de vous être envoyé par email.");
      // redirige après 2s
      setTimeout(() => navigate("/confirmpassword"), 2000);
    } catch (err) {
      setError("Impossible d’envoyer le code. Vérifiez votre adresse email.");
    }
  };

  return (
    <Box
      className="flex flex-col items-center justify-center h-screen px-4 bg-black text-white"
      sx={{ background: "linear-gradient(to bottom, #000000, #005067)" }}
    >
      <Typography variant="h5" gutterBottom>
        Réinitialiser le mot de passe
      </Typography>

      {error && (
        <Alert severity="error" sx={{ mb: 2, width: 360 }}>
          {error}
        </Alert>
      )}
      {success && (
        <Alert severity="success" sx={{ mb: 2, width: 360 }}>
          {success}
        </Alert>
      )}

      <Box
        component="form"
        autoComplete="off"
        onSubmit={handleSubmit}
        sx={{
          width: "100%",
          maxWidth: 360,
          display: "flex",
          flexDirection: "column",
          gap: 3,
        }}
      >
        <TextField
          label="Email"
          variant="filled"
          fullWidth
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          sx={{
            backgroundColor: "#0a111b",
            borderRadius: "999px",
            "& .MuiFilledInput-root": {
              borderRadius: "999px",
              height: 56,
              px: 2,
            },
            "& .MuiFilledInput-input": { color: "#fff" },
            "& .MuiInputLabel-root": { color: "#ccc" },
          }}
        />
        <Button
          type="submit"
          variant="contained"
          disabled={isLoading}
          sx={{
            backgroundColor: "#005067",
            color: "#fff",
            borderRadius: "999px",
            py: 1.5,
            "&:hover": { backgroundColor: "#003f51" },
          }}
        >
          {isLoading ? "Envoi en cours..." : "Envoyer le code"}
        </Button>
      </Box>
    </Box>
  );
}
