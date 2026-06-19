import { useEffect, useState } from "react";
import { hasSupabaseConfig, supabase } from "../lib/supabase";
import { useAuth } from "../state/AuthContext";

export default function Results() {
  const { session } = useAuth();
  const [attempts, setAttempts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");

  useEffect(() => {
    async function load() {
      if (!hasSupabaseConfig || !session?.user?.id) {
        setLoading(false);
        return;
      }

      setLoading(true);
      setMessage("");

      const { data, error } = await supabase
        .from("quiz_attempts")
        .select("*")
        .eq("user_id", session.user.id)
        .order("created_at", { ascending: false });

      if (error) {
        setMessage(`Não foi possível carregar seu histórico: ${error.message}`);
        setLoading(false);
        return;
      }

      setAttempts(data || []);
      setLoading(false);
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
      {message && <div className="message">{message}</div>}

      <div className="table-card">
        {loading ? (
          <p className="data-status">Carregando seu histórico...</p>
        ) : attempts.length === 0 ? (
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


