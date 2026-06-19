import { siteConfig } from "../config/site";

export default function Privacy() {
  return (
    <section className="page legal">
      <span className="eyebrow">Transparência</span>
      <h1>Política de Privacidade</h1>
      <p>Última atualização: 18 de junho de 2026.</p>

      <h2>Quem trata os dados</h2>
      <p>
        A Auto Escola Strada é responsável pelo tratamento dos dados utilizados neste site e na área do aluno.
        Estamos localizados na {siteConfig.address}.
      </p>

      <h2>Dados utilizados</h2>
      <p>
        Podemos utilizar nome, e-mail, telefone, dados de autenticação, perfil de acesso, respostas e resultados
        dos simulados. Informações técnicas essenciais também podem ser processadas para manter a sessão e a
        segurança do sistema.
      </p>

      <h2>Finalidades</h2>
      <ul>
        <li>Criar e administrar o acesso do aluno.</li>
        <li>Disponibilizar simulados e registrar o histórico de desempenho.</li>
        <li>Prestar atendimento e acompanhar a preparação pedagógica.</li>
        <li>Proteger contas, prevenir uso indevido e manter o funcionamento do serviço.</li>
        <li>Cumprir obrigações legais e regulatórias aplicáveis.</li>
      </ul>

      <h2>Compartilhamento e armazenamento</h2>
      <p>
        Os dados da área do aluno são armazenados na infraestrutura do Supabase. Ao abrir links externos, como
        WhatsApp e Google Maps, o visitante passa a estar sujeito também às políticas desses serviços. Não
        comercializamos dados pessoais.
      </p>

      <h2>Prazo e segurança</h2>
      <p>
        Os dados são mantidos pelo período necessário para oferecer os serviços, preservar o histórico do aluno
        e atender obrigações aplicáveis. Utilizamos controle de acesso e permissões por perfil para reduzir acessos
        não autorizados.
      </p>

      <h2>Seus direitos</h2>
      <p>
        O titular pode solicitar confirmação do tratamento, acesso, correção e, quando aplicável, exclusão ou
        informação sobre o uso de seus dados. Algumas informações poderão ser preservadas quando houver obrigação
        legal ou necessidade legítima de conservação.
      </p>

      <h2>Contato</h2>
      <p>
        Para dúvidas ou solicitações relacionadas à privacidade, fale com a Auto Escola Strada pelo telefone ou
        WhatsApp <a href={`https://wa.me/${siteConfig.whatsapp}`} target="_blank" rel="noreferrer">{siteConfig.phone}</a>.
      </p>
    </section>
  );
}
