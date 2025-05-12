// src/pages/ConfirmPassword.js
import React, { useState } from "react";
import { Box, TextField, Button, Typography, Alert } from "@mui/material";
import { useConfirmPasswordResetMutation } from "../services/testApi";
import { useNavigate } from "react-router-dom";

export default function ConfirmPassword() {
  const [code, setCode] = useState("");
  const [newPass, setNewPass] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [confirmReset, { isLoading }] = useConfirmPasswordResetMutation();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    try {
      await confirmReset({ code, new_password: newPass }).unwrap();
      setSuccess("Votre mot de passe a été réinitialisé.");
      setTimeout(() => navigate("/login"), 2000);
    } catch (err) {
      setError("Code invalide ou mot de passe incorrect.");
    }
  };

  return (
    <Box
      className="flex flex-col items-center justify-center h-screen px-4 bg-black text-white"
      sx={{ background: "linear-gradient(to bottom, #000000, #005067)" }}
    >
      <Typography variant="h5" gutterBottom>
        Confirmation du mot de passe
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
          label="Code de vérification"
          variant="filled"
          fullWidth
          required
          value={code}
          onChange={(e) => setCode(e.target.value)}
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
        <TextField
          label="Nouveau mot de passe"
          name="new_password"
          type="password"
          variant="filled"
          fullWidth
          required
          value={newPass}
          onChange={(e) => setNewPass(e.target.value)}
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
          {isLoading ? "Confirmation..." : "Confirmer"}
        </Button>
      </Box>
    </Box>
  );
}
