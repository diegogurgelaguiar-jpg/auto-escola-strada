import { useEffect, useMemo, useState } from "react";
import { questionCategories } from "../config/site";
import { demoQuestions } from "../data/demoQuestions";
import { hasSupabaseConfig, supabase } from "../lib/supabase";
import { calculateScore, getQuizSize, shuffle } from "../lib/quiz";
import { useAuth } from "../state/AuthContext";

export default function Simulado() {
  const { session } = useAuth();
  const [mode, setMode] = useState("completo");
  const [category, setCategory] = useState("Legislação");
  const [started, setStarted] = useState(false);
  const [questions, setQuestions] = useState([]);
  const [answers, setAnswers] = useState({});
  const [finished, setFinished] = useState(false);
  const [saved, setSaved] = useState(false);

  const score = useMemo(() => calculateScore(questions, answers), [questions, answers]);

  async function startQuiz() {
    let source = demoQuestions;

    if (hasSupabaseConfig) {
      let query = supabase.from("questions").select("*").eq("is_active", true);

      if (mode === "categoria") {
        query = query.eq("category", category);
      }

      const { data } = await query;

      if (data?.length) source = data;
    } else if (mode === "categoria") {
      source = demoQuestions.filter((q) => q.category === category);
    }

    const size = getQuizSize(mode);
    setQuestions(shuffle(source).slice(0, size));
    setAnswers({});
    setFinished(false);
    setSaved(false);
    setStarted(true);
  }

  async function finishQuiz() {
    setFinished(true);

    if (!hasSupabaseConfig || !session?.user?.id || saved) return;

    await supabase.from("quiz_attempts").insert({
      user_id: session.user.id,
      mode,
      category: mode === "categoria" ? category : null,
      total_questions: questions.length,
      correct_answers: score.correct,
      percentage: score.percentage,
      passed: score.passed,
      answers
    });

    setSaved(true);
  }

  if (!started) {
    return (
      <section className="page">
        <div className="section-title">
          <span>Simulado</span>
          <h1>Escolha o modo de prova.</h1>
          <p>Depois de iniciar, as perguntas são sorteadas automaticamente.</p>
        </div>

        <div className="quiz-settings card">
          <label>
            Modo do simulado
            <select value={mode} onChange={(e) => setMode(e.target.value)}>
              <option value="rapido">Rápido — 10 perguntas</option>
              <option value="completo">Completo — até 30 perguntas</option>
              <option value="categoria">Por categoria — 15 perguntas</option>
            </select>
          </label>

          {mode === "categoria" && (
            <label>
              Categoria
              <select value={category} onChange={(e) => setCategory(e.target.value)}>
                {questionCategories.map((item) => <option key={item}>{item}</option>)}
              </select>
            </label>
          )}

          <button className="btn primary" onClick={startQuiz}>Iniciar simulado</button>
        </div>
      </section>
    );
  }

  return (
    <section className="page quiz-page">
      <div className="section-title">
        <span>Simulado</span>
        <h1>Prova teórica online</h1>
        <p>Responda todas as perguntas para liberar o resultado final.</p>
      </div>

      {finished && (
        <div className={`result-box ${score.passed ? "approved" : "failed"}`}>
          <h2>{score.passed ? "Aprovado no treino" : "Continue estudando"}</h2>
          <p>Você acertou {score.correct} de {questions.length}. Aproveitamento: {score.percentage}%.</p>
          <button className="btn secondary" onClick={() => setStarted(false)}>Fazer outro simulado</button>
        </div>
      )}

      <div className="questions-list">
        {questions.map((question, index) => {
          const selected = answers[question.id];
          const isCorrect = selected === question.correct_option;

          return (
            <article className="question-card" key={question.id}>
              <div className="question-top">
                <span>{index + 1}</span>
                <small>{question.category} · {question.difficulty || "normal"}</small>
              </div>

              <h3>{question.question}</h3>

              {["A", "B", "C", "D"].map((option) => (
                <label
                  key={option}
                  className={[
                    "option",
                    finished && option === question.correct_option ? "correct" : "",
                    finished && selected === option && !isCorrect ? "wrong" : ""
                  ].join(" ")}
                >
                  <input
                    type="radio"
                    name={question.id}
                    value={option}
                    disabled={finished}
                    checked={selected === option}
                    onChange={() => setAnswers({ ...answers, [question.id]: option })}
                  />
                  <strong>{option}</strong>
                  <span>{question[`option_${option.toLowerCase()}`]}</span>
                </label>
              ))}

              {finished && (
                <p className="explanation">
                  <strong>Explicação:</strong> {question.explanation || "Revise este conteúdo no material teórico."}
                </p>
              )}
            </article>
          );
        })}
      </div>

      {!finished && (
        <div className="sticky-actions">
          <span>{Object.keys(answers).length} de {questions.length} respondidas</span>
          <button className="btn primary" onClick={finishQuiz} disabled={Object.keys(answers).length < questions.length}>
            Finalizar prova
          </button>
        </div>
      )}
    </section>
  );
}


