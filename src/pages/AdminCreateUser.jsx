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

  async function handleSubmit(event) {
    event.preventDefault();
    setMessage("");

    if (!hasSupabaseConfig || !supabase) {
      setMessage("Supabase não configurado.");
      return;
    }

    if (!form.fullName || !form.email || !form.password) {
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
        fullName: form.fullName,
        email: form.email,
        password: form.password,
      },
    });

    setLoading(false);

    if (error) {
      setMessage(error.message);
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