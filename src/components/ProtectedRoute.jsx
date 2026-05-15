import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../state/AuthContext";

export function ProtectedRoute({ children }) {
  const { session, loading } = useAuth();

  // Se já existe sessão, libera a página mesmo se o loading ainda estiver true.
  // Isso evita a Área do Aluno ficar presa em "Carregando...".
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
  const { session, loading, isAdmin, profile } = useAuth();

  if (!session && loading) {
    return (
      <section className="page">
        <div className="card">Carregando...</div>
      </section>
    );
  }

  if (!session) {
    return <Navigate to="/login" replace />;
  }

  // Enquanto o perfil carrega, deixa aparecer uma mensagem curta.
  if (!profile && loading) {
    return (
      <section className="page">
        <div className="card">Carregando perfil de administrador...</div>
      </section>
    );
  }

  if (!isAdmin) {
    return <Navigate to="/aluno" replace />;
  }

  return children;
}