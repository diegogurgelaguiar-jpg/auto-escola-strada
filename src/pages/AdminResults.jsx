import { useEffect, useMemo, useState } from "react";
import { hasSupabaseConfig, supabase } from "../lib/supabase";

export default function AdminResults() {
  const [attempts, setAttempts] = useState([]);
  const [profiles, setProfiles] = useState([]);
  const [search, setSearch] = useState("");
  const [message, setMessage] = useState("");

  async function loadData() {
    if (!hasSupabaseConfig) return;

    const attemptsResponse = await supabase
      .from("quiz_attempts")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(200);

    if (attemptsResponse.error) {
      setMessage(attemptsResponse.error.message);
      return;
    }

    const profilesResponse = await supabase
      .from("profiles")
      .select("id, full_name, email");

    if (profilesResponse.error) {
      setMessage(profilesResponse.error.message);
      return;
    }

    setAttempts(attemptsResponse.data || []);
    setProfiles(profilesResponse.data || []);
  }

  useEffect(() => {
    loadData();
  }, []);

  function getProfile(userId) {
    return profiles.find((profile) => profile.id === userId);
  }

  const filteredAttempts = useMemo(() => {
    const term = search.trim().toLowerCase();

    if (!term) return attempts;

    return attempts.filter((attempt) => {
      const profile = getProfile(attempt.user_id);
      const name = String(profile?.full_name || "").toLowerCase();
      const email = String(profile?.email || "").toLowerCase();

      return name.includes(term) || email.includes(term);
    });
  }, [attempts, profiles, search]);

  return (
    <section className="page">
      <div className="section-title">
        <span>Admin</span>
        <h1>Resultados dos alunos</h1>
        <p>Acompanhe as últimas tentativas feitas na área do aluno.</p>
      </div>

      <div className="card form">
        <label>
          Pesquisar aluno
          <input
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Digite nome ou e-mail"
          />
        </label>
      </div>

      {message && <p className="message">{message}</p>}

      <div className="table-card">
        {filteredAttempts.length === 0 ? (
          <p>Nenhum resultado encontrado.</p>
        ) : (
          <table>
            <thead>
              <tr>
                <th>Aluno</th>
                <th>Data</th>
                <th>Modo</th>
                <th>Acertos</th>
                <th>%</th>
              </tr>
            </thead>

            <tbody>
              {filteredAttempts.map((attempt) => {
                const profile = getProfile(attempt.user_id);

                return (
                  <tr key={attempt.id}>
                    <td>{profile?.full_name || "Aluno sem nome"}</td>
                    <td>{new Date(attempt.created_at).toLocaleString("pt-BR")}</td>
                    <td>{attempt.mode}</td>
                    <td>
                      {attempt.correct_answers}/{attempt.total_questions}
                    </td>
                    <td>{attempt.percentage}%</td>
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