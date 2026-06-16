import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { hasSupabaseConfig, supabase } from "../lib/supabase";
import { useAuth } from "../state/AuthContext";

export default function AdminUsers() {
  const { session } = useAuth();

  const [users, setUsers] = useState([]);
  const [attempts, setAttempts] = useState([]);
  const [search, setSearch] = useState("");
  const [message, setMessage] = useState("");

  async function loadData() {
    if (!hasSupabaseConfig) {
      setMessage("Configure o Supabase para usar esta página.");
      return;
    }

    setMessage("");

    const usersResponse = await supabase
      .from("profiles")
      .select("*")
      .order("created_at", { ascending: false });

    if (usersResponse.error) {
      setMessage(usersResponse.error.message);
      return;
    }

    const attemptsResponse = await supabase
      .from("quiz_attempts")
      .select("*")
      .order("created_at", { ascending: false });

    if (attemptsResponse.error) {
      setMessage(attemptsResponse.error.message);
      setUsers(usersResponse.data || []);
      return;
    }

    setUsers(usersResponse.data || []);
    setAttempts(attemptsResponse.data || []);
  }

  useEffect(() => {
    loadData();
  }, []);

  const filteredUsers = useMemo(() => {
    const term = search.trim().toLowerCase();

    if (!term) return users;

    return users.filter((user) => {
      const name = String(user.full_name || "").toLowerCase();
      const email = String(user.email || "").toLowerCase();

      return name.includes(term) || email.includes(term);
    });
  }, [users, search]);

  function getUserStats(userId) {
    const userAttempts = attempts.filter(
      (attempt) => attempt.user_id === userId
    );

    const totalAttempts = userAttempts.length;

    if (totalAttempts === 0) {
      return {
        totalAttempts: 0,
        average: 0,
        best: 0,
      };
    }

    const totalPercentage = userAttempts.reduce(
      (sum, attempt) => sum + Number(attempt.percentage || 0),
      0
    );

    const best = userAttempts.reduce(
      (max, attempt) => Math.max(max, Number(attempt.percentage || 0)),
      0
    );

    return {
      totalAttempts,
      average: Math.round(totalPercentage / totalAttempts),
      best,
    };
  }

  async function changeRole(userId, nextRole) {
    if (session?.user?.id === userId && nextRole === "student") {
      setMessage("Você não pode remover seu próprio acesso de administrador.");
      return;
    }

    const confirmText =
      nextRole === "admin"
        ? "Deseja transformar este usuário em administrador?"
        : "Deseja transformar este administrador em aluno?";

    if (!confirm(confirmText)) return;

    const { error } = await supabase
      .from("profiles")
      .update({ role: nextRole })
      .eq("id", userId);

    if (error) {
      setMessage(error.message);
      return;
    }

    setMessage("Perfil atualizado com sucesso.");
    loadData();
  }

  async function deleteUserProfile(userId, email) {
  if (session?.user?.id === userId) {
    setMessage("Você não pode excluir o próprio perfil enquanto está logado.");
    return;
  }

  if (
    !confirm(
      `Tem certeza que deseja excluir completamente o usuário ${email}? Isso apagará login, perfil e resultados.`
    )
  ) {
    return;
  }

  const { data, error } = await supabase.functions.invoke("delete-user", {
    body: {
      userId,
    },
  });

  if (error) {
    setMessage(error.message);
    alert(error.message);
    return;
  }

  if (data?.error) {
    setMessage(data.error);
    alert(data.error);
    return;
  }

  setMessage("Usuário excluído completamente com sucesso.");
  loadData();
}

  return (
    <section className="page">
      <div className="section-title">
        <span>Admin</span>
        <h1>Gerenciar usuários</h1>
        <p>Visualize alunos, administradores e desempenho nos simulados.</p>

        <div className="row-actions">
          <Link className="btn primary" to="/admin/novo-usuario">
            Criar novo usuário
          </Link>

          <Link className="btn secondary" to="/admin">
            Voltar para perguntas
          </Link>

          <Link className="btn secondary" to="/admin/resultados">
            Ver resultados
          </Link>
        </div>
      </div>

      <div className="card form">
        <label>
          Pesquisar aluno ou administrador
          <input
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Digite nome ou e-mail"
          />
        </label>
      </div>

      {message && <p className="message">{message}</p>}

      <div className="table-card">
        {filteredUsers.length === 0 ? (
          <p>Nenhum usuário encontrado.</p>
        ) : (
          <table>
            <thead>
              <tr>
                <th>Nome</th>
                <th>E-mail</th>
                <th>Perfil</th>
                <th>Simulados</th>
                <th>Média</th>
                <th>Melhor nota</th>
                <th>Cadastro</th>
                <th>Ações</th>
              </tr>
            </thead>

            <tbody>
              {filteredUsers.map((user) => {
                const stats = getUserStats(user.id);
                const isCurrentUser = session?.user?.id === user.id;

                return (
                  <tr key={user.id}>
                    <td>{user.full_name || "-"}</td>
                    <td>{user.email || "-"}</td>
                    <td>{user.role || "student"}</td>
                    <td>{stats.totalAttempts}</td>
                    <td>{stats.average}%</td>
                    <td>{stats.best}%</td>
                    <td>
                      {user.created_at
                        ? new Date(user.created_at).toLocaleDateString("pt-BR")
                        : "-"}
                    </td>
                    <td>
                      <div className="row-actions">
                        {user.role === "admin" ? (
                          <button
                            className="btn secondary small"
                            type="button"
                            disabled={isCurrentUser}
                            onClick={() => changeRole(user.id, "student")}
                          >
                            {isCurrentUser ? "Admin atual" : "Tornar aluno"}
                          </button>
                        ) : (
                          <button
                            className="btn secondary small"
                            type="button"
                            onClick={() => changeRole(user.id, "admin")}
                          >
                            Tornar admin
                          </button>
                        )}

                        <button
                          className="btn danger small"
                          type="button"
                          disabled={isCurrentUser}
                          onClick={() => deleteUserProfile(user.id, user.email)}
                        >
                          {isCurrentUser ? "Usuário atual" : "Excluir perfil"}
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </div>
    </section>
  );
}