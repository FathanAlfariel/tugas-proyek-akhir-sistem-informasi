import { BrowserRouter, Routes, Route } from "react-router-dom";
import Dashboard from "./Pages/Dashboard";
import Login from "./Pages/Login";
import axios from "axios";
import PublicRoute from "./Routing/PublicRoute";
import ProtectedRoute from "./Routing/ProtectedRoute";
import Product from "./Pages/Product";
import Analysis from "./Pages/Analysis";
import Order from "./Pages/Order";
import Expense from "./Pages/Expense";
import Tailor from "./Pages/Tailor";
import ProductCreation from "./Pages/ProductCreation";
import AddProduct from "./Pages/AddProduct";
import EditProduct from "./Pages/EditProduct";
import AddExpense from "./Pages/AddExpense";
import EditExpense from "./Pages/EditExpense";
import AddTailor from "./Pages/AddTailor";
import EditTailor from "./Pages/EditTailor";
import AddOrder from "./Pages/AddOrder";
import OrderDetail from "./Pages/OrderDetail";
import AddProductCreation from "./Pages/AddProductCreation";
import HomePage from "./Pages/HomePage";
import ProductDetail from "./Pages/ProductDetail";
import AdminLayout from "./AdminLayout";
import IncomeAndOutcomeAnalysis from "./Pages/IncomeAndOutcomeAnalysis";
import OrderAnalysis from "./Pages/OrderAnalysis";
import ProfitAnalysis from "./Pages/ProfitAnalysis";
import ShipmentReceipt from "./Pages/ShipmentReceipt";
import DetailOrder from "./Pages/DetailOrder";

axios.defaults.withCredentials = true;

const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/products/:id" element={<ProductDetail />} />
        <Route path="/order-detail/:id" element={<DetailOrder />} />

        {/* Admin route */}
        <Route
          path="/admin/*"
          element={
            <ProtectedRoute>
              <AdminLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<Dashboard />} />
          <Route path="analysis/*" element={<Analysis />}>
            <Route
              path="income-outcome"
              element={<IncomeAndOutcomeAnalysis />}
            />
            <Route path="order" element={<OrderAnalysis />} />
            <Route path="profit" element={<ProfitAnalysis />} />
          </Route>
          <Route path="product" element={<Product />} />
          <Route path="order" element={<Order />} />
          <Route path="order/detail/:id" element={<OrderDetail />} />
          <Route path="order/add" element={<AddOrder />} />
          <Route path="expense" element={<Expense />} />
          <Route path="expense/add" element={<AddExpense />} />
          <Route path="expense/edit/:id" element={<EditExpense />} />
          <Route path="tailor" element={<Tailor />} />
          <Route path="tailor/add" element={<AddTailor />} />
          <Route path="tailor/edit/:id" element={<EditTailor />} />
          <Route path="product-creation" element={<ProductCreation />} />
          <Route path="product-creation/add" element={<AddProductCreation />} />
          <Route path="product/add" element={<AddProduct />} />
          <Route path="product/edit/:id" element={<EditProduct />} />
        </Route>
        <Route
          path="/admin/order/receipt/:id"
          element={
            <ProtectedRoute>
              <ShipmentReceipt />
            </ProtectedRoute>
          }
        />

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
