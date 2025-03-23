import React, { useEffect, useState } from "react";
import { useNavigate, Navigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { useRefreshTokenMutation } from "../../services/testApi"; // Import de la mutation
import LoadingBar from "../../components/LoadingBar";
import { jwtDecode } from "jwt-decode";

const ProtectedRouteAuth = ({ children }) => {
  const { isAuthenticated, isLoading, accessToken, refreshToken } = useSelector(
    (state) => state.auth
  );
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const [refreshTokenMutation] = useRefreshTokenMutation(); // Hook pour la mutation refreshToken

  useEffect(() => {
    if (accessToken) {
      try {
        const decodedToken = jwtDecode(accessToken);

        // Vérifie si le token est expiré
        if (decodedToken.exp * 1000 < Date.now()) {
          if (refreshToken) {
            // Si le token est expiré, essaie de rafraîchir avec le refresh token
            refreshTokenMutation(refreshToken)
              .unwrap()
              .then(() => setLoading(false))
              .catch(() => {
                // Si l'appel au backend échoue, redirige l'utilisateur vers /login
                navigate("/login");
              });
          } else {
            // Si aucun refresh token n'est présent, redirige vers la page de login
            navigate("/login");
          }
        } else {
          // Le token est valide, on continue avec le composant enfant
          setLoading(false);
        }
      } catch (e) {
        navigate("/login");
      }
    } else {
      // Aucun token d'accès, rediriger vers /login
      navigate("/login");
    }
  }, [accessToken, refreshToken, navigate, refreshTokenMutation]);

  if (loading || isLoading) {
    return <LoadingBar />;
  }
  return isAuthenticated ? children : <Navigate to="/login" />;
};

export default ProtectedRouteAuth;

/* import { Navigate } from "react-router-dom";
import { useSelector } from "react-redux";

const ProtectedRouteAuth = ({ children }) => {
  const { isAuthenticated } = useSelector((state) => state.auth);

  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }

  // Si l'utilisateur est authentifié, on affiche les enfants (le composant protégé)
  return children;
};

export default ProtectedRouteAuth;  */
