import { useEffect, useState } from "react";
import { hasSupabaseConfig, supabase } from "../lib/supabase";

export default function AdminResults() {
  const [attempts, setAttempts] = useState([]);

  useEffect(() => {
    async function load() {
      if (!hasSupabaseConfig) return;

      const { data } = await supabase
        .from("quiz_attempts")
        .select("*, profiles:user_id(full_name,email)")
        .order("created_at", { ascending: false })
        .limit(100);

      setAttempts(data || []);
    }

    load();
  }, []);

  return (
    <section className="page">
      <div className="section-title">
        <span>Admin</span>
        <h1>Resultados dos alunos</h1>
        <p>Acompanhe as últimas tentativas feitas na área do aluno.</p>
      </div>

      <div className="table-card">
        {attempts.length === 0 ? (
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
              {attempts.map((attempt) => (
                <tr key={attempt.id}>
                  <td>{attempt.profiles?.full_name || attempt.profiles?.email || "Aluno"}</td>
                  <td>{new Date(attempt.created_at).toLocaleString("pt-BR")}</td>
                  <td>{attempt.mode}</td>
                  <td>{attempt.correct_answers}/{attempt.total_questions}</td>
                  <td>{attempt.percentage}%</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </section>
  );
}


