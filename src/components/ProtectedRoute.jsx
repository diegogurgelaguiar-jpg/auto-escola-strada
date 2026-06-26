import React from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../state/AuthContext";

export function ProtectedRoute({ children }) {
  const { session, loading } = useAuth();
  const location = useLocation();

  if (session) {
    return children;
  }

  if (loading) {
    return (
      <section className="page">
        <div className="card">Carregando...</div>
      </section>
    );
  }

  return <Navigate to="/login" replace state={{ from: location }} />;
}

export function AdminRoute({ children }) {
  const { session, loading, isAdmin } = useAuth();
  const location = useLocation();

  // Loading geral
  if (loading) {
    return (
      <section className="page">
        <div className="card">Carregando...</div>
      </section>
    );
  }

  // Sem login
  if (!session) {
    return <Navigate to="/login" replace state={{ from: location }} />;
  }

  // Não é admin
  if (!isAdmin) {
    return <Navigate to="/aluno" replace />;
  }

  // OK
  return children;
}
