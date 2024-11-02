import { BrowserRouter, Routes, Route } from "react-router-dom";
import Dashboard from "./Pages/Dashboard";
import Layout from "./Layout";
import Login from "./Pages/Login";
import axios from "axios";
import PublicRoute from "./Routing/PublicRoute";
import ProtectedRoute from "./Routing/ProtectedRoute";
import AddProduct from "./Pages/AddProduct";

axios.defaults.withCredentials = true;

const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="/admin/*"
          element={
            <ProtectedRoute>
              <Layout />
            </ProtectedRoute>
          }
        >
          <Route index element={<Dashboard />} />
          <Route path="product/add" element={<AddProduct />} />
        </Route>
        <Route
          path="/login"
          element={
            <PublicRoute>
              <Login />
            </PublicRoute>
          }
        />
      </Routes>
    </BrowserRouter>
  );
};

export default App;
