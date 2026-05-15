import { Link } from "react-router-dom";

export default function PublicSimulado() {
  return (
    <section className="page">
      <div className="section-title">
        <span>Simulado</span>
        <h1>Simulado teórico dentro do próprio site.</h1>
        <p>
          O aluno acessa com login e senha, responde perguntas aleatórias,
          vê a pontuação no final e acompanha seu histórico de evolução.
        </p>
      </div>

      <div className="grid three">
        <article className="card">
          <h3>Simulado rápido</h3>
          <p>10 perguntas para treinar em poucos minutos.</p>
        </article>
        <article className="card">
          <h3>Simulado completo</h3>
          <p>30 perguntas para simular uma prova mais próxima da realidade.</p>
        </article>
        <article className="card">
          <h3>Treino por categoria</h3>
          <p>O aluno escolhe temas como placas, legislação ou direção defensiva.</p>
        </article>
      </div>

      <div className="cta-box">
        <h2>Área exclusiva para alunos</h2>
        <p>Para fazer a prova, o aluno precisa acessar com login.</p>
        <Link className="btn primary" to="/login">Entrar na área do aluno</Link>
      </div>
    </section>
  );
}


