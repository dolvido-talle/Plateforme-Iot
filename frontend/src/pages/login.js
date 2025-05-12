import React, { useState } from "react";
import { TextField, Button, Typography, Alert, Box, Link } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { useLoginMutation, useSignUpMutation } from "../services/testApi";
import { setUser, setAuthenticated } from "../store/slice/authSlice";

function Login() {
  const [mode, setMode] = useState("login");
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    username: "",
    iot_id: "",
  });
  const [errorMessage, setErrorMessage] = useState("");
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [login, { isLoading: loginLoading }] = useLoginMutation();
  const [signUp, { isLoading: signUpLoading }] = useSignUpMutation();

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage("");

    try {
      if (mode === "login") {
        const response = await login({
          email: formData.email,
          password: formData.password,
        }).unwrap();
        if (response.access && response.refresh) {
          dispatch(
            setUser({
              accessToken: response.access,
              refreshToken: response.refresh,
            })
          );
          dispatch(setAuthenticated(true));
          navigate("/");
        } else {
          throw new Error("Tokens manquants.");
        }
      } else {
        const response = await signUp({
          email: formData.email,
          username: formData.username,
          password: formData.password,
          iot_id: formData.iot_id,
        }).unwrap();
        dispatch(
          setUser({
            accessToken: response.access,
            refreshToken: response.refresh,
          })
        );
        setMode("login"); // Change le mode en "login"
        setErrorMessage(""); // Réinitialise les messages d'erreur
        setFormData({
          email: "",
          password: "",
          username: "",
          iot_id: "",
        });
      }
    } catch (err) {
      const detail = err?.data?.detail;
      if (mode === "login") {
        setErrorMessage(
          detail === "No active account found with the given credentials"
            ? "Aucun compte trouvé avec ces identifiants."
            : "Adresse email ou mot de passe incorrect."
        );
      } else {
        setErrorMessage("Une erreur est survenue lors de l’inscription.");
      }
    }
  };

  return (
    <Box
      className="relative h-screen overflow-hidden"
      sx={{ background: "linear-gradient(to bottom, #000000, #005067)" }}
    >
      {/* Dégradés décoratifs */}
      <Box
        className="absolute bottom-0 left-0"
        sx={{
          width: "17vw",
          height: "17vh",
          background: "linear-gradient(45deg, #b81367, transparent)",
          borderTopRightRadius: "130%",
          zIndex: 0,
        }}
      />
      <Box
        className="absolute top-0 right-0"
        sx={{
          width: "17vw",
          height: "17vh",
          background: "linear-gradient(90deg, #005067, transparent)",
          borderBottomLeftRadius: "130%",
          zIndex: 0,
        }}
      />

      {/* Formulaire centré */}
      <Box
        className="relative flex flex-col items-center justify-center h-full text-white px-4"
        sx={{ zIndex: 1 }}
      >
        <Box className="flex space-x-4 mb-6">
          <Button
            variant={mode === "login" ? "contained" : "outlined"}
            onClick={() => setMode("login")}
            sx={{
              color: "#fff",
              borderColor: "#fff",
              "&.MuiButton-contained": { backgroundColor: "#005067" },
            }}
          >
            Se connecter
          </Button>
          <Button
            variant={mode === "signup" ? "contained" : "outlined"}
            onClick={() => setMode("signup")}
            sx={{
              color: "#fff",
              borderColor: "#fff",
              "&.MuiButton-contained": { backgroundColor: "#005067" },
            }}
          >
            S’inscrire
          </Button>
        </Box>

        <Typography variant="h4" gutterBottom>
          {mode === "login" ? "Connexion" : "Inscription"}
        </Typography>

        {errorMessage && (
          <Alert severity="error" sx={{ mb: 2, width: "100%", maxWidth: 360 }}>
            {errorMessage}
          </Alert>
        )}

        <Box
          component="form"
          onSubmit={handleSubmit}
          autoComplete="off"
          className="flex flex-col gap-6"
          sx={{ width: "100%", maxWidth: 360 }}
        >
          <TextField
            label="Email"
            name="email"
            variant="filled"
            fullWidth
            value={formData.email}
            onChange={handleChange}
            required
            sx={{
              backgroundColor: "#0a111b",
              borderRadius: "999px",
              "& .MuiFilledInput-root": {
                borderRadius: "999px",
                height: 60,
                paddingLeft: 2,
              },
              "& .MuiFilledInput-input": { color: "#fff", paddingY: "18px" },
              "& .MuiInputLabel-root": { color: "#ccc" },
              "& .MuiFilledInput-root:focus-within": { boxShadow: "none" },
            }}
          />

          {mode === "signup" && (
            <>
              <TextField
                label="IoT ID"
                name="iot_id"
                variant="filled"
                fullWidth
                value={formData.iot_id}
                onChange={handleChange}
                required
                sx={{
                  backgroundColor: "#0a111b",
                  borderRadius: "999px",
                  "& .MuiFilledInput-root": {
                    borderRadius: "999px",
                    height: 60,
                    paddingLeft: 2,
                  },
                  "& .MuiFilledInput-input": {
                    color: "#fff",
                    paddingY: "18px",
                  },
                  "& .MuiInputLabel-root": { color: "#ccc" },
                  "& .MuiFilledInput-root:focus-within": { boxShadow: "none" },
                }}
              />
              <TextField
                label="Nom d’utilisateur"
                name="username"
                variant="filled"
                fullWidth
                value={formData.username}
                onChange={handleChange}
                required
                sx={{
                  backgroundColor: "#0a111b",
                  borderRadius: "999px",
                  "& .MuiFilledInput-root": {
                    borderRadius: "999px",
                    height: 60,
                    paddingLeft: 2,
                  },
                  "& .MuiFilledInput-input": {
                    color: "#fff",
                    paddingY: "18px",
                  },
                  "& .MuiInputLabel-root": { color: "#ccc" },
                  "& .MuiFilledInput-root:focus-within": { boxShadow: "none" },
                }}
              />
            </>
          )}

          <TextField
            label="Mot de passe"
            name="password"
            type="password"
            variant="filled"
            fullWidth
            value={formData.password}
            onChange={handleChange}
            required
            sx={{
              backgroundColor: "#0a111b",
              borderRadius: "999px",
              "& .MuiFilledInput-root": {
                borderRadius: "999px",
                height: 60,
                paddingLeft: 2,
              },
              "& .MuiFilledInput-input": { color: "#fff", paddingY: "18px" },
              "& .MuiInputLabel-root": { color: "#ccc" },
              "& .MuiFilledInput-root:focus-within": { boxShadow: "none" },
            }}
          />

          <Button
            type="submit"
            variant="contained"
            disabled={mode === "login" ? loginLoading : signUpLoading}
            sx={{
              backgroundColor: "#005067",
              color: "#fff",
              borderRadius: "999px",
              py: 1.5,
              "&:hover": { backgroundColor: "#003f51" },
            }}
          >
            {mode === "login"
              ? loginLoading
                ? "Connexion..."
                : "Se connecter"
              : signUpLoading
                ? "Inscription..."
                : "S’inscrire"}
          </Button>

          {/* Mot de passe oublié, seulement après échec en login */}
          {mode === "login" && errorMessage && (
            <Box textAlign="center" mt={1}>
              <Link
                component="button"
                variant="body2"
                onClick={() => navigate("/resetpassword")}
                sx={{
                  color: "#FFD700",
                  textDecoration: "none",
                }}
              >
                Mot de passe oublié ?
              </Link>
            </Box>
          )}
        </Box>
      </Box>
    </Box>
  );
}

export default Login;
