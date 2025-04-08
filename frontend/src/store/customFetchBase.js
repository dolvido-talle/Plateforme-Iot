const customFetchBase = async (url, options = {}) => {
  const token = document.cookie.split("=")[1]; // Récupérer le token du cookie
  let response;

  try {
    if (window.Cypress) {
      // env cypress
      response = await fetch(`http://host.docker.internal:8000/api${url}`, {
        ...options,
        headers: {
          ...options.headers,
          Authorization: token ? `Bearer ${token}` : "",
        },
        credentials: "include", // Permet de gérer les cookies
      });
    } else {
      response = await fetch(`http://localhost:8000/api${url}`, {
        ...options,
        headers: {
          ...options.headers,
          Authorization: token ? `Bearer ${token}` : "",
        },
        credentials: "include", // Permet de gérer les cookies
      });
    }

    // Vérifier si la réponse est OK
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error("Erreur lors de la requête :", error);
    throw error; // Relancer l'erreur pour la gestion en amont
  }
};

export default customFetchBase;
