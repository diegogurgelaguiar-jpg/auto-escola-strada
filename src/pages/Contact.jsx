import { Clock3, MapPin, MessageCircle, Phone } from "lucide-react";
import { siteConfig } from "../config/site";

export default function Contact() {
  return (
    <section className="page contact-page">
      <div className="section-title">
        <span className="eyebrow">Fale conosco</span>
        <h1>Vamos começar sua próxima conquista?</h1>
        <p>Chame nossa equipe, tire suas dúvidas e conheça as melhores opções para sua habilitação.</p>
      </div>
      <div className="contact-grid">
        <div className="contact-card">
          <a href={`https://wa.me/${siteConfig.whatsapp}`} target="_blank" rel="noreferrer"><MessageCircle /><span><small>WhatsApp</small><strong>{siteConfig.phone}</strong></span></a>
          <a href={`tel:+${siteConfig.whatsapp}`}><Phone /><span><small>Telefone</small><strong>{siteConfig.phone}</strong></span></a>
          <a href={siteConfig.mapsUrl} target="_blank" rel="noreferrer"><MapPin /><span><small>Endereço</small><strong>{siteConfig.address}</strong></span></a>
          <div><Clock3 /><span><small>Atendimento</small><strong>{siteConfig.hours}</strong></span></div>
        </div>
        <a className="map-card" href={siteConfig.mapsUrl} target="_blank" rel="noreferrer">
          <MapPin size={44} />
          <strong>Auto Escola Strada</strong>
          <span>Venda Nova · Belo Horizonte</span>
          <span className="btn primary">Abrir no Google Maps</span>
        </a>
      </div>
    </section>
  );
}
