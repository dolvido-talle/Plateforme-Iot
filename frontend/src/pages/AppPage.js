import { Provider } from "react-redux";
import { store } from "../store/store";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import HomePage from "../components/HomePage";
import Datatable from "../components/DataTable";
import Login from "./login";
import ProtectedRouteAuth from "../routes/guards/ProtectedRoutesAuth";

function AppPage() {
  return (
    <Provider store={store}>
      <Router>
        <Routes>
          {/* Route de Login */}
          <Route path="/login" element={<Login />} />

          {/* Route protégée */}
          <Route
            path="/"
            element={
              <ProtectedRouteAuth>
                <HomePage />
                <Datatable />
              </ProtectedRouteAuth>
            }
          />
          {/* Route de fallback si aucune correspondance */}
          <Route path="*" element={<Login />} />
        </Routes>
      </Router>
    </Provider>
  );
}

export default AppPage;
