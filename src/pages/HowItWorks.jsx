const steps = [
  ["01", "Converse com a Strada", "Tire suas dúvidas e descubra a categoria ideal para seu objetivo."],
  ["02", "Faça sua matrícula", "Nossa equipe orienta o cadastro e a documentação necessária."],
  ["03", "Exames e curso teórico", "Cumpra as etapas obrigatórias e prepare-se com conteúdo e simulados."],
  ["04", "Aulas práticas", "Aprenda com instrutores experientes e acompanhamento no seu ritmo."],
  ["05", "Exame prático", "Chegue preparado para a avaliação. Na categoria A, o exame acontece em nossa pista própria."],
  ["06", "Conquiste sua CNH", "Finalize o processo pronto para dirigir com responsabilidade e confiança."],
];

export default function HowItWorks() {
  return (
    <section className="page process-page">
      <div className="section-title centered">
        <span className="eyebrow">Como funciona</span>
        <h1>Seu caminho até a CNH, passo a passo.</h1>
        <p>A equipe da Strada acompanha você do primeiro atendimento à prova prática.</p>
      </div>
      <div className="timeline">
        {steps.map(([number, title, text]) => (
          <div className="timeline-item" key={number}>
            <strong>{number}</strong>
            <div><h3>{title}</h3><p>{text}</p></div>
          </div>
        ))}
      </div>
    </section>
  );
}
