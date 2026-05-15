import { siteConfig } from "../config/site";

export default function Contact() {
  return (
    <section className="page">
      <div className="section-title">
        <span>Contato</span>
        <h1>Contato rápido para converter visitantes em alunos.</h1>
        <p>Configure endereço, horário, telefone, Instagram e mapa da autoescola.</p>
      </div>

      <div className="contact-grid">
        <div className="card">
          <h3>Atendimento</h3>
          <p><strong>Endereço:</strong> {siteConfig.address}</p>
          <p><strong>Horário:</strong> {siteConfig.hours}</p>
          <a className="btn primary" href={`https://wa.me/${siteConfig.whatsapp}`} target="_blank" rel="noreferrer">
            Chamar no WhatsApp
          </a>
        </div>

        <div className="map-placeholder">
          <strong>Google Maps</strong>
          <p>Substitua este bloco pelo iframe real do endereço da autoescola.</p>
        </div>
      </div>
    </section>
  );
}


