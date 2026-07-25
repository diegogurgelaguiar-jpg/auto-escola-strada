import { useState } from "react";
import { Link } from "react-router-dom";
import { hasSupabaseConfig, supabase } from "../lib/supabase";

export default function AdminCreateUser() {
  const [form, setForm] = useState({
    fullName: "",
    email: "",
    password: "",
  });

  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  async function getFunctionMessage(error) {
    try {
      const context = error?.context;

      if (context?.json) {
        const body = await context.json();
        return body?.error || body?.message || error.message;
      }
    } catch {
      // Keep the original Supabase message when the error body is not JSON.
    }

    const rawMessage = String(error?.message || "");

    if (/failed to send a request/i.test(rawMessage)) {
      return "O serviço create-user não está publicado ou está bloqueado pelo CORS no Supabase.";
    }

    if (/non-2xx status code/i.test(rawMessage)) {
      return "A função create-user recusou a criação. Verifique se o e-mail já existe e se sua conta tem perfil de administrador.";
    }

    return rawMessage || "Não foi possível acessar o serviço create-user.";
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setMessage("");

    if (!hasSupabaseConfig || !supabase) {
      setMessage("Supabase não configurado.");
      return;
    }

    const normalizedName = form.fullName.trim();
    const normalizedEmail = form.email.trim().toLowerCase();

    if (!normalizedName || !normalizedEmail || !form.password) {
      setMessage("Preencha todos os campos.");
      return;
    }

    if (form.password.length < 6) {
      setMessage("A senha precisa ter pelo menos 6 caracteres.");
      return;
    }

    setLoading(true);

    const { data, error } = await supabase.functions.invoke("create-user", {
      body: {
        fullName: normalizedName,
        email: normalizedEmail,
        password: form.password,
      },
    });

    setLoading(false);

    if (error) {
      setMessage(await getFunctionMessage(error));
      return;
    }

    if (data?.error) {
      setMessage(data.error);
      return;
    }

    setMessage("Usuário criado com sucesso como aluno.");

    setForm({
      fullName: "",
      email: "",
      password: "",
    });
  }

  return (
    <section className="page">
      <div className="section-title">
        <span>Admin</span>
        <h1>Criar novo usuário</h1>
        <p>Cadastre um novo aluno sem sair da conta de administrador.</p>

        <div className="row-actions">
          <Link className="btn secondary" to="/admin/usuarios">
            Voltar para usuários
          </Link>

          <Link className="btn secondary" to="/admin">
            Voltar para perguntas
          </Link>
        </div>
      </div>

      <form className="card form" onSubmit={handleSubmit}>
        <h2>Novo usuário</h2>

        <label>
          Nome completo
          <input
            value={form.fullName}
            onChange={(e) =>
              setForm({ ...form, fullName: e.target.value })
            }
            required
          />
        </label>

        <label>
          E-mail
          <input
            type="email"
            value={form.email}
            onChange={(e) =>
              setForm({ ...form, email: e.target.value })
            }
            required
          />
        </label>

        <label>
          Senha
          <input
            type="password"
            minLength="6"
            value={form.password}
            onChange={(e) =>
              setForm({ ...form, password: e.target.value })
            }
            required
          />
        </label>

        {message && <p className="message">{message}</p>}

        <button
          type="submit"
          className="btn primary"
          disabled={loading}
        >
          {loading ? "Criando..." : "Criar usuário"}
        </button>
      </form>
    </section>
  );
}
