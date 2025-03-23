import React, { useState, useEffect } from "react";
import { TextField, Button, Typography, Alert } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { useLoginMutation } from "../services/testApi";
import { setUser, setAuthenticated } from "../store/slice/authSlice";

function login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  // const { isAuthenticated } = useSelector((state) => state.auth);

  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [login, { isLoading }] = useLoginMutation();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage("");
    try {
      const response = await login({ email, password }).unwrap();
      console.log("Réponse API:", response);

      if (response.access && response.refresh) {
        dispatch(
          setUser({
            accessToken: response.access,
            refreshToken: response.refresh,
          })
        );
        dispatch(setAuthenticated(true));

        // Vérifie que l'état de isAuthenticated est mis à jour
        // console.log("isAuthenticated après mise à jour:", isAuthenticated);

        // Rediriger vers la page d'accueil
        navigate("/");
      } else {
        throw new Error("Tokens manquants dans la réponse.");
      }
    } catch (error) {
      console.error("Erreur de connexion:", error);
      setErrorMessage(error?.data?.detail || "Identifiants incorrects !");
    }
  };

  /*  useEffect(() => {
    console.log("isAuthenticated changé:", isAuthenticated);
    if (isAuthenticated) {
      // Si l'utilisateur est authentifié, on le redirige vers la page d'accueil
      navigate("/");
    }
  }, [isAuthenticated, navigate]);
 */
  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <Typography variant="h4" gutterBottom>
        Connexion
      </Typography>

      {errorMessage && <Alert severity="error">{errorMessage}</Alert>}

      <form onSubmit={handleSubmit} className="flex flex-col gap-4 w-80">
        <TextField
          label="Email"
          variant="outlined"
          fullWidth
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <TextField
          label="Mot de passe"
          type="password"
          variant="outlined"
          fullWidth
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <Button
          type="submit"
          variant="contained"
          color="primary"
          disabled={isLoading}
        >
          {isLoading ? "Connexion..." : "Se connecter"}
        </Button>
      </form>
    </div>
  );
}

export default login;
