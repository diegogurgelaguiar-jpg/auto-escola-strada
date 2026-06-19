import { useState } from "react";
import { Navigate } from "react-router-dom";
import { hasSupabaseConfig, supabase } from "../lib/supabase";
import { useAuth } from "../state/AuthContext";
import Brand from "../components/Brand";

export default function Login() {
  const { session, signIn } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [recoverMode, setRecoverMode] = useState(false);

  if (session) return <Navigate to="/aluno" replace />;

  async function handleSubmit(event) {
    event.preventDefault();
    setMessage("");

    try {
      const response = await signIn(email, password);

      if (response.error) {
        setMessage(response.error.message);
        return;
      }
    } catch (error) {
      setMessage(error.message);
    }
  }

  async function handlePasswordRecovery(event) {
    event.preventDefault();
    setMessage("");

    if (!hasSupabaseConfig || !supabase) {
      setMessage("Supabase não configurado.");
      return;
    }

    if (!email) {
      setMessage("Digite seu e-mail para recuperar a senha.");
      return;
    }

    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/login`,
    });

    if (error) {
      setMessage(error.message);
      return;
    }

    setMessage("Enviamos um e-mail com o link para redefinir sua senha.");
  }

  return (
    <section className="auth-page">
      <div className="auth-card">
        <Brand compact />
        <span className="badge">Área do aluno</span>

        <h1>{recoverMode ? "Recuperar senha" : "Entrar"}</h1>

        <p>
          {recoverMode
            ? "Digite seu e-mail para receber o link de redefinição de senha."
            : "Acesso exclusivo para alunos cadastrados pela Auto Escola Strada."}
        </p>

        {!hasSupabaseConfig && (
          <div className="notice">
            Configure o Supabase no arquivo <strong>.env</strong> para ativar login real.
          </div>
        )}

        {recoverMode ? (
          <form className="form" onSubmit={handlePasswordRecovery}>
            <label>
              E-mail
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </label>

            {message && <p className="message">{message}</p>}

            <button className="btn primary" type="submit">
              Enviar link de recuperação
            </button>
          </form>
        ) : (
          <form className="form" onSubmit={handleSubmit}>
            <label>
              E-mail
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </label>

            <label>
              Senha
              <input
                type="password"
                minLength="6"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </label>

            {message && <p className="message">{message}</p>}

            <button className="btn primary" type="submit">
              Entrar na área do aluno
            </button>
          </form>
        )}

        <button
          className="link-button center"
          type="button"
          onClick={() => {
            setMessage("");
            setRecoverMode(!recoverMode);
          }}
        >
          {recoverMode ? "Voltar para login" : "Esqueci minha senha"}
        </button>

        {!recoverMode && (
          <p className="muted center">
            Não tem acesso? Solicite seu cadastro diretamente na autoescola.
          </p>
        )}
      </div>
    </section>
  );
}
