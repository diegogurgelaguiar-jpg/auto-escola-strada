import { useState } from "react";
import { Navigate } from "react-router-dom";
import { hasSupabaseConfig } from "../lib/supabase";
import { useAuth } from "../state/AuthContext";

export default function Login() {
  const { session, signIn, signUp } = useAuth();
  const [mode, setMode] = useState("login");
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");

  if (session) return <Navigate to="/aluno" replace />;

  async function handleSubmit(event) {
    event.preventDefault();
    setMessage("");

    try {
      const response = mode === "login"
        ? await signIn(email, password)
        : await signUp(fullName, email, password);

      if (response.error) {
        setMessage(response.error.message);
        return;
      }

      if (mode === "register") {
        setMessage("Cadastro criado. Se a confirmação por e-mail estiver ativa, confirme antes de entrar.");
      }
    } catch (error) {
      setMessage(error.message);
    }
  }

  return (
    <section className="auth-page">
      <div className="auth-card">
        <span className="badge">Área do aluno</span>
        <h1>{mode === "login" ? "Entrar" : "Criar cadastro"}</h1>
        <p>Acesso para simulados, resultados e acompanhamento de desempenho.</p>

        {!hasSupabaseConfig && (
          <div className="notice">
            Configure o Supabase no arquivo <strong>.env</strong> para ativar login real.
          </div>
        )}

        <form className="form" onSubmit={handleSubmit}>
          {mode === "register" && (
            <label>
              Nome completo
              <input value={fullName} onChange={(e) => setFullName(e.target.value)} required />
            </label>
          )}

          <label>
            E-mail
            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
          </label>

          <label>
            Senha
            <input type="password" minLength="6" value={password} onChange={(e) => setPassword(e.target.value)} required />
          </label>

          {message && <p className="message">{message}</p>}

          <button className="btn primary" type="submit">
            {mode === "login" ? "Entrar na área do aluno" : "Cadastrar aluno"}
          </button>
        </form>

        <button className="link-button center" onClick={() => setMode(mode === "login" ? "register" : "login")}>
          {mode === "login" ? "Criar novo cadastro" : "Já tenho cadastro"}
        </button>
      </div>
    </section>
  );
}


