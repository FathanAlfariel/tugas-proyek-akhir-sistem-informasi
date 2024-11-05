import { BrowserRouter, Routes, Route } from "react-router-dom";
import Dashboard from "./Pages/Dashboard";
import Layout from "./Layout";
import Login from "./Pages/Login";
import axios from "axios";
import PublicRoute from "./Routing/PublicRoute";
import ProtectedRoute from "./Routing/ProtectedRoute";
import Product from "./Pages/Product";
import Analysis from "./Pages/Analysis";
import Order from "./Pages/Order";
import Expense from "./Pages/Expense";
import Tailor from "./Pages/Tailor";
import MakeProduct from "./Pages/MakeProduct";
import AddProduct from "./Pages/AddProduct";
import EditProduct from "./Pages/EditProduct";
import AddExpense from "./Pages/AddExpense";

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
          <Route path="analysis" element={<Analysis />} />
          <Route path="product" element={<Product />} />
          <Route path="order" element={<Order />} />
          <Route path="expense" element={<Expense />} />
          <Route path="expense/add" element={<AddExpense />} />
          <Route path="tailor" element={<Tailor />} />
          <Route path="make-product" element={<MakeProduct />} />
          <Route path="product/add" element={<AddProduct />} />
          <Route path="product/edit/:id" element={<EditProduct />} />
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
