import React from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import "./styles.css";
import { AuthProvider } from "./state/AuthContext";
import Layout from "./components/Layout";
import { AdminRoute, ProtectedRoute } from "./components/ProtectedRoute";
import Home from "./pages/Home";
import Services from "./pages/Services";
import HowItWorks from "./pages/HowItWorks";
import PublicSimulado from "./pages/PublicSimulado";
import Contact from "./pages/Contact";
import Login from "./pages/Login";
import StudentDashboard from "./pages/StudentDashboard";
import Simulado from "./pages/Simulado";
import Results from "./pages/Results";
import Admin from "./pages/Admin";
import AdminResults from "./pages/AdminResults";
import AdminUsers from "./pages/AdminUsers";
import AdminCreateUser from "./pages/AdminCreateUser";
import Privacy from "./pages/Privacy";
import Terms from "./pages/Terms";
import NotFound from "./pages/NotFound";

createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <BrowserRouter basename={import.meta.env.BASE_URL}>
      <AuthProvider>
        <Routes>
          <Route element={<Layout />}>
            <Route path="/" element={<Home />} />
            <Route path="/servicos" element={<Services />} />
            <Route path="/como-funciona" element={<HowItWorks />} />
            <Route path="/simulado" element={<PublicSimulado />} />
            <Route path="/contato" element={<Contact />} />
            <Route path="/login" element={<Login />} />
            <Route path="/privacidade" element={<Privacy />} />
            <Route path="/termos" element={<Terms />} />

            <Route
              path="/aluno"
              element={
                <ProtectedRoute>
                  <StudentDashboard />
                </ProtectedRoute>
              }
            />

            <Route
              path="/aluno/simulado"
              element={
                <ProtectedRoute>
                  <Simulado />
                </ProtectedRoute>
              }
            />

            <Route
              path="/aluno/resultados"
              element={
                <ProtectedRoute>
                  <Results />
                </ProtectedRoute>
              }
            />

            <Route
              path="/admin"
              element={
                <AdminRoute>
                  <Admin />
                </AdminRoute>
              }
            />

            <Route
              path="/admin/resultados"
              element={
                <AdminRoute>
                  <AdminResults />
                </AdminRoute>
              }
            />

            <Route
              path="/admin/usuarios"
              element={
                <AdminRoute>
                  <AdminUsers />
                </AdminRoute>
              }
            />

            <Route
              path="/admin/novo-usuario"
              element={
                <AdminRoute>
                  <AdminCreateUser />
                </AdminRoute>
              }
            />

            <Route path="/404" element={<NotFound />} />
            <Route path="*" element={<Navigate to="/404" replace />} />
          </Route>
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  </React.StrictMode>
);
