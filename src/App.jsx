import { useEffect, useState } from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import { CustomerLayout, AdminLayout, Loading } from "./components";
import { api } from "./services/api";
import Home from "./pages/Home";
import Products from "./pages/Products";
import ProductDetail from "./pages/ProductDetail";
import Recommend from "./pages/Recommend";
import Estimate from "./pages/Estimate";
import Complete from "./pages/Complete";
import ServiceRequest from "./pages/ServiceRequest";
import AdminLogin from "./pages/admin/AdminLogin";
import Dashboard from "./pages/admin/Dashboard";
import Inquiries from "./pages/admin/Inquiries";
import InquiryDetail from "./pages/admin/InquiryDetail";
import Customers from "./pages/admin/Customers";
import Services from "./pages/admin/Services";

function ProtectedAdmin({ admin, checking, children }) {
  if (checking) return <Loading />;
  return admin ? children : <Navigate to="/admin/login" replace />;
}

export default function App() {
  const [admin, setAdmin] = useState(null);
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    api.me().then((response) => setAdmin(response.data)).catch(() => setAdmin(null)).finally(() => setChecking(false));
  }, []);

  return (
    <Routes>
      <Route element={<CustomerLayout />}>
        <Route index element={<Home />} />
        <Route path="products" element={<Products />} />
        <Route path="products/:id" element={<ProductDetail />} />
        <Route path="recommend" element={<Recommend />} />
        <Route path="estimate" element={<Estimate />} />
        <Route path="estimate/complete" element={<Complete />} />
        <Route path="service" element={<ServiceRequest />} />
      </Route>

      <Route path="/admin/login" element={admin ? <Navigate to="/admin" replace /> : <AdminLogin setAdmin={setAdmin} />} />
      <Route
        path="/admin"
        element={
          <ProtectedAdmin admin={admin} checking={checking}>
            <AdminLayout admin={admin} setAdmin={setAdmin} />
          </ProtectedAdmin>
        }
      >
        <Route index element={<Dashboard />} />
        <Route path="inquiries" element={<Inquiries />} />
        <Route path="inquiries/:id" element={<InquiryDetail />} />
        <Route path="customers" element={<Customers />} />
        <Route path="services" element={<Services />} />
      </Route>

      <Route path="*" element={<div className="not-found"><h1>404</h1><p>페이지를 찾을 수 없습니다.</p><a href="/">메인으로 이동</a></div>} />
    </Routes>
  );
}
