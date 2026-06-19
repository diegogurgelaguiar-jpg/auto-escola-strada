import { Link } from "react-router-dom";
import {
  ArrowRight,
  BookOpenCheck,
  CheckCircle2,
  MapPin,
  MessageCircle,
  ShieldCheck,
  Trophy,
} from "lucide-react";
import { siteConfig } from "../config/site";

const categories = [
  ["A", "Moto"],
  ["B", "Carro"],
  ["C", "Carga"],
  ["D", "Passageiros"],
  ["E", "Veículos articulados"],
];

export default function Home() {
  return (
    <>
      <section className="hero">
        <div className="hero-content">
          <span className="eyebrow">Sua habilitação começa aqui</span>
          <h1>Aprenda com confiança. Dirija com segurança.</h1>
          <p>
            Formação completa para categorias A, B, C, D e E, instrutores experientes
            e acompanhamento de verdade em cada etapa da sua CNH.
          </p>
          <div className="actions">
            <a className="btn primary" href={`https://wa.me/${siteConfig.whatsapp}`} target="_blank" rel="noreferrer">
              Quero tirar minha CNH <MessageCircle size={18} />
            </a>
            <Link className="btn secondary" to="/simulado">Fazer simulado</Link>
          </div>
          <div className="hero-trust">
            <span><ShieldCheck size={19} /> Atendimento próximo</span>
            <span><Trophy size={19} /> Formação completa</span>
          </div>
        </div>

        <div className="hero-media">
          <img
            src="/images/caminhao-auto-escola-strada.jpg"
            alt="Caminhão de treinamento da Auto Escola Strada"
            width="1280"
            height="960"
            fetchPriority="high"
          />
          <div className="hero-logo-card">
            <img src="/images/logo-auto-escola-strada.jpg" alt="Auto Escola Strada" width="92" height="92" />
            <span><strong>Categorias A a E</strong>Uma escola para todas as suas conquistas.</span>
          </div>
        </div>
      </section>

      <section className="category-strip" aria-label="Categorias oferecidas">
        {categories.map(([letter, label]) => (
          <div className="category-item" key={letter}>
            <strong>{letter}</strong>
            <span>{label}</span>
          </div>
        ))}
      </section>

      <section className="section intro-section">
        <div className="section-title">
          <span className="eyebrow">Auto Escola Strada</span>
          <h2>Estrutura, experiência e cuidado para você chegar preparado.</h2>
          <p>Da teoria à prática, nossa equipe acompanha seu desenvolvimento com atenção e respeito ao seu ritmo.</p>
        </div>
        <div className="feature-grid">
          <article className="feature-card">
            <BookOpenCheck />
            <h3>Ensino que prepara</h3>
            <p>Aulas teóricas, simulados online e orientação para você avançar com segurança.</p>
          </article>
          <article className="feature-card featured">
            <ShieldCheck />
            <h3>Instrutores experientes</h3>
            <p>Profissionais preparados para ensinar com paciência, clareza e responsabilidade.</p>
          </article>
          <article className="feature-card">
            <Trophy />
            <h3>Da categoria A à E</h3>
            <p>Formação para motos, carros e veículos profissionais em um só lugar.</p>
          </article>
        </div>
      </section>

      <section className="moto-feature">
        <div className="moto-content">
          <span className="eyebrow light">Diferencial exclusivo</span>
          <h2>Treine, tire e faça a prova na nossa pista própria.</h2>
          <p>
            Na categoria A, você aprende e realiza o exame no mesmo local. Mais familiaridade,
            praticidade e confiança para conquistar sua CNH de moto.
          </p>
          <div className="check-list">
            <span><CheckCircle2 /> Pista exclusiva e preparada</span>
            <span><CheckCircle2 /> Instrutores experientes</span>
            <span><CheckCircle2 /> Exame realizado na própria pista</span>
          </div>
          <a className="btn light" href={`https://wa.me/${siteConfig.whatsapp}`} target="_blank" rel="noreferrer">
            Quero minha CNH de moto <ArrowRight size={18} />
          </a>
        </div>
        <div className="moto-visual" aria-hidden="true">
          <img src="/images/campanha-cnh-moto.jpg" alt="" width="960" height="960" loading="lazy" />
        </div>
      </section>

      <section className="section classroom-section">
        <div className="image-frame">
          <img
            src="/images/turma-auto-escola-strada.jpg"
            alt="Turma em aula teórica na Auto Escola Strada"
            width="1280"
            height="963"
            loading="lazy"
          />
          <span>Aprendizado próximo e acolhedor</span>
        </div>
        <div className="classroom-copy">
          <span className="eyebrow">Preparação completa</span>
          <h2>Do primeiro passo até a aprovação.</h2>
          <p>Conte com suporte para entender o processo, estudar para a prova e desenvolver segurança nas aulas práticas.</p>
          <Link className="text-link" to="/como-funciona">Veja como funciona <ArrowRight size={18} /></Link>
        </div>
      </section>

      <section className="location-cta">
        <div>
          <MapPin size={30} />
          <span>Venha conhecer a Strada</span>
          <strong>{siteConfig.address}</strong>
        </div>
        <a className="btn dark" href={siteConfig.mapsUrl} target="_blank" rel="noreferrer">Como chegar</a>
      </section>
    </>
  );
}
