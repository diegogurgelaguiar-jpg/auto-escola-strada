import { Link } from "react-router-dom";
import { BookOpenCheck, Clock3, ListChecks } from "lucide-react";

export default function PublicSimulado() {
  return (
    <section className="page">
      <div className="section-title centered">
        <span className="eyebrow">Simulado teórico</span>
        <h1>Pratique hoje. Chegue mais confiante à prova.</h1>
        <p>Treine com perguntas aleatórias, confira sua pontuação e acompanhe sua evolução.</p>
      </div>
      <div className="feature-grid">
        <article className="feature-card"><Clock3 /><h3>Treino rápido</h3><p>10 perguntas para revisar o conteúdo em poucos minutos.</p></article>
        <article className="feature-card featured"><ListChecks /><h3>Simulado completo</h3><p>Até 30 perguntas para uma preparação mais próxima da prova.</p></article>
        <article className="feature-card"><BookOpenCheck /><h3>Por categoria</h3><p>Escolha temas como placas, legislação ou direção defensiva.</p></article>
      </div>
      <div className="cta-box centered-cta">
        <span className="eyebrow">Exclusivo para alunos</span>
        <h2>Acesse sua área e comece a treinar.</h2>
        <p>Seu histórico fica salvo para você acompanhar cada resultado.</p>
        <Link className="btn primary" to="/login">Entrar na área do aluno</Link>
      </div>
    </section>
  );
}
