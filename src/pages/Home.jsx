import { Link } from "react-router-dom";
import { ArrowRight, CheckCircle2, ShieldCheck, Trophy } from "lucide-react";

export default function Home() {
  return (
    <>
      <section className="hero">
        <div className="hero-content">
          <span className="badge">CNH, estudo e acompanhamento em um só lugar</span>
          <h1>Auto Escola Strada: preparação profissional do atendimento ao simulado.</h1>
          <p>
            Um site moderno para apresentar os serviços da autoescola, captar novos alunos
            e oferecer uma área exclusiva com simulados teóricos, histórico de desempenho e correção automática.
          </p>
          <div className="actions">
            <Link className="btn primary" to="/login">Acessar área do aluno <ArrowRight size={18} /></Link>
            <Link className="btn secondary" to="/servicos">Conhecer serviços</Link>
          </div>
        </div>

        <div className="hero-panel">
          <div className="panel-header">
            <span>Simulado teórico</span>
            <strong>Online</strong>
          </div>
          <h2>Treinamento com perguntas aleatórias e resultado automático.</h2>
          <div className="mini-list">
            <span><CheckCircle2 size={18} /> Login real para alunos</span>
            <span><CheckCircle2 size={18} /> Histórico de tentativas</span>
            <span><CheckCircle2 size={18} /> Painel administrativo</span>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="section-title">
          <span>Estrutura profissional</span>
          <h2>O site trabalha como vitrine e ferramenta de estudo.</h2>
        </div>

        <div className="grid three">
          <article className="card icon-card">
            <ShieldCheck />
            <h3>Confiança para vender</h3>
            <p>Serviços bem explicados, diferenciais, etapas da CNH, contato e localização.</p>
          </article>
          <article className="card icon-card">
            <Trophy />
            <h3>Área do aluno</h3>
            <p>O aluno entra com e-mail e senha para fazer simulados e ver resultados.</p>
          </article>
          <article className="card icon-card">
            <CheckCircle2 />
            <h3>Admin completo</h3>
            <p>A autoescola pode cadastrar perguntas, editar conteúdo e acompanhar desempenho.</p>
          </article>
        </div>
      </section>

      <section className="split-section">
        <div>
          <span className="badge">Diferencial comercial</span>
          <h2>Uma página específica para quem tem medo de dirigir.</h2>
          <p>
            Essa seção aumenta a chance de conversão porque conversa com um público que já tem CNH,
            mas precisa de confiança, paciência e aulas personalizadas para voltar a dirigir.
          </p>
        </div>
        <div className="stats-card">
          <strong>3</strong>
          <span>modos de simulado</span>
          <strong>70%</strong>
          <span>nota mínima sugerida para aprovação interna</span>
        </div>
      </section>
    </>
  );
}


