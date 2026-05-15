const services = [
  ["Primeira habilitação", "Atendimento para alunos que vão iniciar o processo da CNH."],
  ["Categoria A", "Preparação para motocicleta com orientação prática e segura."],
  ["Categoria B", "Treinamento para automóvel com foco em controle, segurança e aprovação."],
  ["Categoria AB", "Opção completa para quem deseja moto e carro."],
  ["Adição de categoria", "Para condutores que já possuem CNH e querem ampliar sua habilitação."],
  ["Aulas para habilitados", "Aulas com paciência para quem tem medo, insegurança ou pouca prática."],
  ["Reciclagem", "Orientação para condutores que precisam regularizar sua situação."],
  ["Simulado teórico", "Área exclusiva para alunos treinarem antes da prova teórica."]
];

export default function Services() {
  return (
    <section className="page">
      <div className="section-title">
        <span>Serviços</span>
        <h1>Serviços organizados para gerar mais contatos qualificados.</h1>
        <p>
          Cada serviço tem uma explicação objetiva para o visitante entender rapidamente
          se a autoescola atende o que ele precisa.
        </p>
      </div>

      <div className="grid four">
        {services.map(([title, text]) => (
          <article className="card" key={title}>
            <h3>{title}</h3>
            <p>{text}</p>
          </article>
        ))}
      </div>
    </section>
  );
}


