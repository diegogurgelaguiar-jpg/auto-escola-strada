import { Bike, BusFront, CarFront, GraduationCap, RefreshCcw, Truck } from "lucide-react";
import { assetPath } from "../lib/assets";

const services = [
  [Bike, "Categoria A", "Formação para motocicleta com pista própria. Você treina e realiza o exame no mesmo local."],
  [CarFront, "Categoria B", "Aulas práticas para automóvel com foco em controle, trânsito seguro e confiança ao volante."],
  [Truck, "Categoria C", "Preparação para condução de veículos de carga com orientação profissional."],
  [BusFront, "Categoria D", "Formação para conduzir veículos de passageiros com responsabilidade e segurança."],
  [Truck, "Categoria E", "Treinamento para veículos articulados e combinações de maior porte."],
  [GraduationCap, "Primeira habilitação", "Acompanhamento em todas as etapas para quem vai conquistar a primeira CNH."],
  [RefreshCcw, "Adição e mudança", "Amplie sua habilitação com suporte para adicionar ou mudar de categoria."],
  [CarFront, "Aulas para habilitados", "Recupere a confiança e volte a dirigir com aulas personalizadas no seu ritmo."],
];

export default function Services() {
  return (
    <section className="page">
      <div className="page-hero compact-hero">
        <div>
          <span className="eyebrow">Nossos serviços</span>
          <h1>Formação para cada caminho.</h1>
          <p>Da primeira habilitação às categorias profissionais, a Strada prepara você para dirigir com segurança.</p>
        </div>
        <img src={assetPath("/images/caminhao-auto-escola-strada.jpg")} alt="Veículo de treinamento para categorias profissionais" />
      </div>
      <div className="service-grid">
        {services.map(([Icon, title, text]) => (
          <article className="service-card" key={title}>
            <span className="service-icon"><Icon /></span>
            <h3>{title}</h3>
            <p>{text}</p>
          </article>
        ))}
      </div>
    </section>
  );
}
