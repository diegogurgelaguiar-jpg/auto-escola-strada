import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { questionCategories } from "../config/site";
import { hasSupabaseConfig, supabase } from "../lib/supabase";
import { useAuth } from "../state/AuthContext";

const emptyQuestion = {
  category: "Legislação",
  difficulty: "normal",
  question: "",
  option_a: "",
  option_b: "",
  option_c: "",
  option_d: "",
  correct_option: "A",
  explanation: "",
  is_active: true
};

export default function Admin() {
  const { session } = useAuth();
  const [form, setForm] = useState(emptyQuestion);
  const [editingId, setEditingId] = useState(null);
  const [questions, setQuestions] = useState([]);
  const [message, setMessage] = useState("");

  async function loadQuestions() {
    if (!hasSupabaseConfig) return;

    const { data } = await supabase
      .from("questions")
      .select("*")
      .order("created_at", { ascending: false });

    setQuestions(data || []);
  }

  useEffect(() => {
    loadQuestions();
  }, []);

  function editQuestion(question) {
    setEditingId(question.id);
    setForm({
      category: question.category,
      difficulty: question.difficulty || "normal",
      question: question.question,
      option_a: question.option_a,
      option_b: question.option_b,
      option_c: question.option_c,
      option_d: question.option_d,
      correct_option: question.correct_option,
      explanation: question.explanation || "",
      is_active: question.is_active
    });
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  async function deleteQuestion(id) {
    if (!confirm("Tem certeza que deseja excluir esta pergunta?")) return;

    const { error } = await supabase.from("questions").delete().eq("id", id);

    if (error) {
      setMessage(error.message);
      return;
    }

    setMessage("Pergunta excluída.");
    loadQuestions();
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setMessage("");

    if (!hasSupabaseConfig) {
      setMessage("Configure o Supabase para usar o painel admin.");
      return;
    }

    const payload = {
      ...form,
      created_by: session?.user?.id
    };

    const response = editingId
      ? await supabase.from("questions").update(payload).eq("id", editingId)
      : await supabase.from("questions").insert(payload);

    if (response.error) {
      setMessage(response.error.message);
      return;
    }

    setMessage(editingId ? "Pergunta atualizada." : "Pergunta cadastrada.");
    setForm(emptyQuestion);
    setEditingId(null);
    loadQuestions();
  }

  return (
    <section className="page">
      <div className="section-title">
        <span>Admin</span>
        <h1>Painel administrativo profissional.</h1>
        <p>Cadastre, edite e exclua perguntas do simulado.</p>
        <Link className="btn secondary" to="/admin/resultados">Ver resultados dos alunos</Link>
      </div>

      <div className="admin-grid">
        <form className="card form" onSubmit={handleSubmit}>
          <h2>{editingId ? "Editar pergunta" : "Nova pergunta"}</h2>

          <label>
            Categoria
            <select value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })}>
              {questionCategories.map((item) => <option key={item}>{item}</option>)}
            </select>
          </label>

          <label>
            Dificuldade
            <select value={form.difficulty} onChange={(e) => setForm({ ...form, difficulty: e.target.value })}>
              <option value="facil">Fácil</option>
              <option value="normal">Normal</option>
              <option value="dificil">Difícil</option>
            </select>
          </label>

          <label>
            Pergunta
            <textarea value={form.question} onChange={(e) => setForm({ ...form, question: e.target.value })} required />
          </label>

          {["a", "b", "c", "d"].map((letter) => (
            <label key={letter}>
              Alternativa {letter.toUpperCase()}
              <input
                value={form[`option_${letter}`]}
                onChange={(e) => setForm({ ...form, [`option_${letter}`]: e.target.value })}
                required
              />
            </label>
          ))}

          <label>
            Resposta correta
            <select value={form.correct_option} onChange={(e) => setForm({ ...form, correct_option: e.target.value })}>
              <option>A</option>
              <option>B</option>
              <option>C</option>
              <option>D</option>
            </select>
          </label>

          <label>
            Explicação
            <textarea value={form.explanation} onChange={(e) => setForm({ ...form, explanation: e.target.value })} />
          </label>

          <label className="checkbox-row">
            <input
              type="checkbox"
              checked={form.is_active}
              onChange={(e) => setForm({ ...form, is_active: e.target.checked })}
            />
            Pergunta ativa
          </label>

          {message && <p className="message">{message}</p>}

          <button className="btn primary" type="submit">{editingId ? "Salvar alterações" : "Cadastrar pergunta"}</button>

          {editingId && (
            <button className="btn secondary" type="button" onClick={() => { setEditingId(null); setForm(emptyQuestion); }}>
              Cancelar edição
            </button>
          )}
        </form>

        <div className="card">
          <h2>Perguntas cadastradas</h2>
          {questions.length === 0 ? (
            <p>Nenhuma pergunta cadastrada ainda.</p>
          ) : (
            <div className="question-admin-list">
              {questions.map((question) => (
                <div className="admin-question" key={question.id}>
                  <strong>{question.category} · {question.difficulty}</strong>
                  <p>{question.question}</p>
                  <div className="row-actions">
                    <button className="btn secondary small" onClick={() => editQuestion(question)}>Editar</button>
                    <button className="btn danger small" onClick={() => deleteQuestion(question.id)}>Excluir</button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}


