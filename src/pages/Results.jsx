import { useEffect, useState } from "react";
import { hasSupabaseConfig, supabase } from "../lib/supabase";
import { useAuth } from "../state/AuthContext";

export default function Results() {
  const { session } = useAuth();
  const [attempts, setAttempts] = useState([]);

  useEffect(() => {
    async function load() {
      if (!hasSupabaseConfig || !session?.user?.id) return;

      const { data } = await supabase
        .from("quiz_attempts")
        .select("*")
        .eq("user_id", session.user.id)
        .order("created_at", { ascending: false });

      setAttempts(data || []);
    }

    load();
  }, [session]);

  return (
    <section className="page">
      <div className="section-title">
        <span>Histórico</span>
        <h1>Meus resultados</h1>
      </div>

      {!hasSupabaseConfig && <div className="notice">Configure o Supabase para salvar o histórico real.</div>}

      <div className="table-card">
        {attempts.length === 0 ? (
          <p>Nenhum resultado encontrado.</p>
        ) : (
          <table>
            <thead>
              <tr>
                <th>Data</th>
                <th>Modo</th>
                <th>Acertos</th>
                <th>Aproveitamento</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {attempts.map((attempt) => (
                <tr key={attempt.id}>
                  <td>{new Date(attempt.created_at).toLocaleString("pt-BR")}</td>
                  <td>{attempt.mode}</td>
                  <td>{attempt.correct_answers}/{attempt.total_questions}</td>
                  <td>{attempt.percentage}%</td>
                  <td>{attempt.passed ? "Aprovado" : "Estudar mais"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </section>
  );
}


