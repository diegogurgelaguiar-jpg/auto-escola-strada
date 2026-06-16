import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../state/AuthContext";

export function ProtectedRoute({ children }) {
  const { session, loading } = useAuth();

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

  return <Navigate to="/login" replace />;
}

export function AdminRoute({ children }) {
  const { session, loading, isAdmin } = useAuth();

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
    return <Navigate to="/login" replace />;
  }

  // Não é admin
  if (!isAdmin) {
    return <Navigate to="/aluno" replace />;
  }

  // OK
  return children;
}