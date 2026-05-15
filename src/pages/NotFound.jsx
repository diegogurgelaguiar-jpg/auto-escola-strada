import { Link } from "react-router-dom";

export default function NotFound() {
  return (
    <section className="page">
      <div className="card">
        <h1>Página não encontrada</h1>
        <p>O endereço acessado não existe ou foi movido.</p>
        <Link className="btn primary" to="/">Voltar para o início</Link>
      </div>
    </section>
  );
}


