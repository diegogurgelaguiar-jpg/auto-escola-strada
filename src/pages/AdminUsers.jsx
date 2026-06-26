import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { KeyRound, X } from "lucide-react";
import { hasSupabaseConfig, supabase } from "../lib/supabase";
import { selectRows } from "../lib/supabaseRest";
import { useAuth } from "../state/AuthContext";

export default function AdminUsers() {
  const { session } = useAuth();

  const [users, setUsers] = useState([]);
  const [attempts, setAttempts] = useState([]);
  const [search, setSearch] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(true);
  const [passwordUser, setPasswordUser] = useState(null);
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordLoading, setPasswordLoading] = useState(false);

  function getFunctionMessage(error, functionName) {
    const rawMessage = String(error?.message || "");

    if (/failed to send a request/i.test(rawMessage)) {
      return `O serviço ${functionName} não está publicado ou está bloqueado pelo CORS no Supabase.`;
    }

    return rawMessage || `Não foi possível acessar o serviço ${functionName}.`;
  }

  async function loadData() {
    if (!hasSupabaseConfig) {
      setMessage("Configure o Supabase para usar esta página.");
      setLoading(false);
      return;
    }

    setLoading(true);
    setMessage("");

    const usersResponse = await selectRows(
      "profiles",
      { order: "created_at.desc" },
      session?.access_token,
      12000
    );

    if (usersResponse.error) {
      setMessage(`Não foi possível carregar os usuários: ${usersResponse.error.message}`);
      setLoading(false);
      return;
    }

    const attemptsResponse = await selectRows(
      "quiz_attempts",
      { order: "created_at.desc" },
      session?.access_token,
      12000
    );

    if (attemptsResponse.error) {
      setMessage(`Os usuários foram carregados, mas os resultados falharam: ${attemptsResponse.error.message}`);
      setUsers(usersResponse.data || []);
      setLoading(false);
      return;
    }

    setUsers(usersResponse.data || []);
    setAttempts(attemptsResponse.data || []);
    setLoading(false);
  }

  useEffect(() => {
    loadData();
  }, [session]);

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

  function getScoreClass(score, totalAttempts) {
    if (!totalAttempts) return "";
    if (score >= 70) return "good";
    if (score >= 50) return "medium";
    return "bad";
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

  function openPasswordModal(user) {
    setPasswordUser(user);
    setNewPassword("");
    setConfirmPassword("");
    setMessage("");
  }

  function closePasswordModal() {
    if (passwordLoading) return;
    setPasswordUser(null);
    setNewPassword("");
    setConfirmPassword("");
  }

  async function handlePasswordChange(event) {
    event.preventDefault();
    setMessage("");

    if (newPassword.length < 6) {
      setMessage("A nova senha precisa ter pelo menos 6 caracteres.");
      return;
    }

    if (newPassword !== confirmPassword) {
      setMessage("A confirmação não corresponde à nova senha.");
      return;
    }

    setPasswordLoading(true);

    const { data, error } = await supabase.functions.invoke("reset-user-password", {
      body: { userId: passwordUser.id, password: newPassword },
    });

    setPasswordLoading(false);

    if (error) {
      setMessage(`Não foi possível trocar a senha: ${getFunctionMessage(error, "reset-user-password")}`);
      return;
    }

    if (data?.error) {
      setMessage(`Não foi possível trocar a senha: ${data.error}`);
      return;
    }

    setMessage(`Senha de ${passwordUser.full_name || passwordUser.email} alterada com sucesso.`);
    closePasswordModal();
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
    setMessage(`Não foi possível excluir o usuário: ${getFunctionMessage(error, "delete-user")}`);
    return;
  }

  if (data?.error) {
    setMessage(data.error);
    return;
  }

  setMessage("Usuário excluído completamente com sucesso.");
  loadData();
}

  return (
    <section className="page admin-users-page">
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

      <div className="table-card user-table-card">
        {loading ? (
          <p className="data-status">Carregando usuários...</p>
        ) : filteredUsers.length === 0 ? (
          <p>Nenhum usuário encontrado.</p>
        ) : (
          <table className="user-table">
            <colgroup>
              <col className="col-name" />
              <col className="col-email" />
              <col className="col-role" />
              <col className="col-attempts" />
              <col className="col-average" />
              <col className="col-best" />
              <col className="col-date" />
              <col className="col-actions" />
            </colgroup>
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
                    <td>
                      <span className={`role-badge ${user.role === "admin" ? "admin" : "student"}`}>
                        {user.role === "admin" ? "Administrador" : "Aluno"}
                      </span>
                    </td>
                    <td><span className="attempt-count">{stats.totalAttempts}</span></td>
                    <td>
                      <span className={`score-value ${getScoreClass(stats.average, stats.totalAttempts)}`}>
                        {stats.average}%
                      </span>
                    </td>
                    <td>
                      <span className={`score-value ${getScoreClass(stats.best, stats.totalAttempts)}`}>
                        {stats.best}%
                      </span>
                    </td>
                    <td>
                      {user.created_at
                        ? new Date(user.created_at).toLocaleDateString("pt-BR")
                        : "-"}
                    </td>
                    <td>
                      <div className="row-actions user-actions">
                        <button
                          className="btn password small"
                          type="button"
                          onClick={() => openPasswordModal(user)}
                        >
                          <KeyRound size={15} />
                          Trocar senha
                        </button>

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

      {passwordUser && (
        <div className="modal-backdrop" role="presentation" onMouseDown={closePasswordModal}>
          <div className="password-modal" role="dialog" aria-modal="true" aria-labelledby="password-modal-title" onMouseDown={(event) => event.stopPropagation()}>
            <button className="modal-close" type="button" onClick={closePasswordModal} aria-label="Fechar">
              <X />
            </button>
            <span className="password-modal-icon"><KeyRound /></span>
            <h2 id="password-modal-title">Trocar senha do aluno</h2>
            <p>Defina uma senha temporária para <strong>{passwordUser.full_name || passwordUser.email}</strong>.</p>

            <form className="form" onSubmit={handlePasswordChange}>
              <label>
                Nova senha
                <input
                  type="password"
                  minLength="6"
                  value={newPassword}
                  onChange={(event) => setNewPassword(event.target.value)}
                  autoComplete="new-password"
                  required
                />
              </label>
              <label>
                Confirmar nova senha
                <input
                  type="password"
                  minLength="6"
                  value={confirmPassword}
                  onChange={(event) => setConfirmPassword(event.target.value)}
                  autoComplete="new-password"
                  required
                />
              </label>
              <div className="modal-actions">
                <button className="btn secondary" type="button" onClick={closePasswordModal} disabled={passwordLoading}>Cancelar</button>
                <button className="btn primary" type="submit" disabled={passwordLoading}>
                  {passwordLoading ? "Alterando..." : "Salvar nova senha"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </section>
  );
}
