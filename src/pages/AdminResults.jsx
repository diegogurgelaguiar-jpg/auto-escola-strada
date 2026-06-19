import { useEffect, useMemo, useState } from "react";
import { hasSupabaseConfig, supabase } from "../lib/supabase";

export default function AdminResults() {
  const [attempts, setAttempts] = useState([]);
  const [profiles, setProfiles] = useState([]);
  const [search, setSearch] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(true);

  async function loadData() {
    if (!hasSupabaseConfig) {
      setMessage("O Supabase não está configurado neste ambiente.");
      setLoading(false);
      return;
    }

    setLoading(true);
    setMessage("");

    const attemptsResponse = await supabase
      .from("quiz_attempts")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(200);

    if (attemptsResponse.error) {
      setMessage(`Não foi possível carregar os resultados: ${attemptsResponse.error.message}`);
      setLoading(false);
      return;
    }

    const profilesResponse = await supabase
      .from("profiles")
      .select("id, full_name, email");

    if (profilesResponse.error) {
      setMessage(`Não foi possível carregar os alunos: ${profilesResponse.error.message}`);
      setLoading(false);
      return;
    }

    setAttempts(attemptsResponse.data || []);
    setProfiles(profilesResponse.data || []);
    setLoading(false);
  }

  useEffect(() => {
    loadData();
  }, []);

  const studentSummaries = useMemo(() => {
    const profileMap = new Map(profiles.map((profile) => [profile.id, profile]));
    const summaryMap = new Map();

    attempts.forEach((attempt) => {
      const current = summaryMap.get(attempt.user_id) || {
        userId: attempt.user_id,
        totalAttempts: 0,
        percentageTotal: 0,
        best: 0,
        latestAttempt: attempt.created_at,
      };

      const percentage = Number(attempt.percentage || 0);
      current.totalAttempts += 1;
      current.percentageTotal += percentage;
      current.best = Math.max(current.best, percentage);

      if (new Date(attempt.created_at) > new Date(current.latestAttempt)) {
        current.latestAttempt = attempt.created_at;
      }

      summaryMap.set(attempt.user_id, current);
    });

    return Array.from(summaryMap.values())
      .map((summary) => ({
        ...summary,
        profile: profileMap.get(summary.userId),
        average: Math.round(summary.percentageTotal / summary.totalAttempts),
      }))
      .sort((a, b) => new Date(b.latestAttempt) - new Date(a.latestAttempt));
  }, [attempts, profiles]);

  const filteredSummaries = useMemo(() => {
    const term = search.trim().toLowerCase();

    if (!term) return studentSummaries;

    return studentSummaries.filter((summary) => {
      const name = String(summary.profile?.full_name || "").toLowerCase();
      const email = String(summary.profile?.email || "").toLowerCase();

      return name.includes(term) || email.includes(term);
    });
  }, [studentSummaries, search]);

  function getScoreClass(score) {
    if (score >= 70) return "good";
    if (score >= 50) return "medium";
    return "bad";
  }

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

      <div className="table-card results-summary-card">
        {loading ? (
          <p className="data-status">Carregando resultados...</p>
        ) : filteredSummaries.length === 0 ? (
          <p>Nenhum resultado encontrado.</p>
        ) : (
          <table className="results-summary-table">
            <colgroup>
              <col className="col-student" />
              <col className="col-total" />
              <col className="col-score" />
              <col className="col-score" />
            </colgroup>
            <thead>
              <tr>
                <th>Aluno</th>
                <th>Simulados</th>
                <th>Média</th>
                <th>Melhor nota</th>
              </tr>
            </thead>

            <tbody>
              {filteredSummaries.map((summary) => (
                <tr key={summary.userId}>
                  <td>
                    <span className="student-cell">
                      <strong>{summary.profile?.full_name || "Aluno sem nome"}</strong>
                      <small>{summary.profile?.email || "E-mail não informado"}</small>
                    </span>
                  </td>
                  <td><span className="attempt-count">{summary.totalAttempts}</span></td>
                  <td><span className={`score-value ${getScoreClass(summary.average)}`}>{summary.average}%</span></td>
                  <td><span className={`score-value ${getScoreClass(summary.best)}`}>{summary.best}%</span></td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </section>
  );
}
