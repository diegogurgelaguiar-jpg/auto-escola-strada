const steps = [
  ["01", "Atendimento inicial", "O aluno tira dúvidas e recebe orientação sobre o melhor caminho."],
  ["02", "Matrícula", "Cadastro do aluno e conferência das informações necessárias."],
  ["03", "Exames", "Orientação sobre exames obrigatórios conforme as regras aplicáveis."],
  ["04", "Curso teórico", "Estudo dos temas exigidos na prova."],
  ["05", "Simulado", "Treino dentro do site antes da prova teórica."],
  ["06", "Aulas práticas", "Acompanhamento com instrutores."],
  ["07", "Exame prático", "Preparação final para a avaliação."],
  ["08", "CNH aprovada", "Conclusão do processo e comemoração da conquista."]
];

export default function HowItWorks() {
  return (
    <section className="page">
      <div className="section-title">
        <span>Como funciona</span>
        <h1>Um passo a passo claro para reduzir dúvidas no WhatsApp.</h1>
      </div>

      <div className="timeline">
        {steps.map(([number, title, text]) => (
          <div className="timeline-item" key={number}>
            <strong>{number}</strong>
            <div>
              <h3>{title}</h3>
              <p>{text}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}


