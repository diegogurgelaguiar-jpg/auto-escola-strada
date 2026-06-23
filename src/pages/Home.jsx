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

const fleetVehicles = [
  {
    src: "/images/frota-carro-vermelho-strada.jpg",
    alt: "Carro vermelho da Auto Escola Strada para aulas práticas",
    label: "Categoria B",
    title: "Carros conservados e revisados",
    text: "Veículos identificados, com manutenção em dia e preparados para você treinar com mais tranquilidade no volante.",
  },
  {
    src: "/images/frota-carro-prata-pista-strada.jpg",
    alt: "Carro prata da Auto Escola Strada próximo à pista de treinamento",
    label: "Aulas práticas",
    title: "Estrutura real para aprender melhor",
    text: "Aulas com veículos da própria escola e acompanhamento próximo para desenvolver controle, atenção e segurança no trânsito.",
  },
  {
    src: "/images/frota-motos-pista-strada.jpg",
    alt: "Motos da Auto Escola Strada usadas nas aulas de categoria A",
    label: "Categoria A",
    title: "Motos bem cuidadas na pista própria",
    text: "Motos em ótimo estado para treinar na pista da Strada, no mesmo ambiente onde o aluno realiza o exame de moto.",
  },
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

      <section className="section fleet-section">
        <div className="section-title centered">
          <span className="eyebrow">Nossa frota</span>
          <h2>Veículos preparados para você aprender com confiança.</h2>
          <p>
            Carros e motos da Auto Escola Strada são conservados, revisados e cuidados
            para que cada aula prática seja mais segura, confortável e produtiva.
          </p>
        </div>

        <div className="fleet-grid">
          {fleetVehicles.map((vehicle) => (
            <article className="fleet-card" key={vehicle.title}>
              <img src={vehicle.src} alt={vehicle.alt} width="1400" height="1050" loading="lazy" />
              <div className="fleet-card-copy">
                <span>{vehicle.label}</span>
                <h3>{vehicle.title}</h3>
                <p>{vehicle.text}</p>
              </div>
            </article>
          ))}
        </div>

        <div className="fleet-note">
          <CheckCircle2 size={22} />
          <strong>Manutenção em dia, identificação da escola e suporte de instrutores experientes em cada etapa.</strong>
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
