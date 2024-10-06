import { BrowserRouter, Routes, Route } from "react-router-dom";
import Dashboard from "./Dashboard/Pages/Dashboard";
import Layout from "./Dashboard/Layout";

const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/dashboard" element={<Layout />}>
          <Route index element={<Dashboard />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
};

export default App;
