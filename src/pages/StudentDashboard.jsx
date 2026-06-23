import { Link } from "react-router-dom";
import { BookOpen, ClipboardCheck, History, ShieldCheck } from "lucide-react";
import { useAuth } from "../state/AuthContext";

export default function StudentDashboard() {
  const { session, profile, isAdmin } = useAuth();
  const name = profile?.full_name || session?.user?.email;

  return (
    <section className="page">
      <div className="section-title">
        <span>Área do aluno</span>
        <h1>Olá, {name}</h1>
        <p>Escolha um simulado, acompanhe seu resultado e melhore sua preparação para a prova teórica.</p>
      </div>

      {isAdmin && (
        <article className="admin-access-card">
          <span className="admin-access-icon"><ShieldCheck /></span>
          <div>
            <small>Acesso de administrador</small>
            <h2>Painel administrativo disponível</h2>
            <p>Gerencie perguntas, resultados dos alunos, usuários e senhas também pelo celular.</p>
          </div>
          <Link className="btn primary" to="/admin">Abrir Admin</Link>
        </article>
      )}

      <div className="dashboard-grid">
        <article className="card icon-card big-card">
          <BookOpen />
          <h3>Fazer simulado</h3>
          <p>Escolha entre simulado rápido, completo ou por categoria.</p>
          <Link className="btn primary" to="/aluno/simulado">Iniciar</Link>
        </article>

        <article className="card icon-card big-card">
          <History />
          <h3>Meus resultados</h3>
          <p>Veja seu histórico de tentativas e aproveitamento.</p>
          <Link className="btn secondary" to="/aluno/resultados">Ver histórico</Link>
        </article>

        <article className="card icon-card big-card">
          <ClipboardCheck />
          <h3>Dica de estudo</h3>
          <p>Refaça os temas em que errar mais e leia as explicações depois de cada simulado.</p>
        </article>
      </div>
    </section>
  );
}
