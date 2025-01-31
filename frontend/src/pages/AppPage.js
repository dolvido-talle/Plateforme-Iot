import { Provider } from "react-redux";
import { store } from "../store/store";
import HomePage from "../components/HomePage";
// import ApiTest from "../components/ApiTest";
import DataTable from "../components/DataTable";
import { BrowserRouter as Router } from "react-router-dom";

function AppPage() {
  return (
    <Provider store={store}>
      <HomePage />

      {/*  <ApiTest /> */}
      <DataTable />
    </Provider>
  );
}

export default AppPage;
