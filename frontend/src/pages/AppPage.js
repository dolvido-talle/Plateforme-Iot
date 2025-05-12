import { Provider } from "react-redux";
import { store } from "../store/store";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import HomePage from "../components/HomePage";
import Datatable from "../components/DataTable";
import Login from "./login";
import ProtectedRouteAuth from "../routes/guards/ProtectedRoutesAuth";
import ResetPassword from "./ResetPassword";
import ConfirmPassword from "./ConfirmPassword";

function AppPage() {
  return (
    <Provider store={store}>
      <Router>
        <Routes>
          {/* Route de Login */}
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Login mode="signup" />} />

          <Route path="/resetpassword" element={<ResetPassword />} />
          <Route path="/confirmpassword" element={<ConfirmPassword />} />

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
