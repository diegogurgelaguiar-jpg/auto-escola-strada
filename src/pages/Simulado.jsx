import { useMemo, useState } from "react";
import { questionCategories } from "../config/site";
import { demoQuestions } from "../data/demoQuestions";
import { hasSupabaseConfig, supabase } from "../lib/supabase";
import { calculateScore, getQuizSize, getUniqueQuestions, shuffle } from "../lib/quiz";
import { getQuestionImage } from "../lib/questionImages";
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
  const [saving, setSaving] = useState(false);
  const [saveMessage, setSaveMessage] = useState("");
  const [quizMessage, setQuizMessage] = useState("");

  const score = useMemo(
    () => calculateScore(questions, answers),
    [questions, answers]
  );

  async function startQuiz() {
    setQuizMessage("");
    let source = demoQuestions;

    if (hasSupabaseConfig) {
      let query = supabase
        .from("questions")
        .select("*")
        .eq("is_active", true);

      if (mode === "categoria") {
        query = query.eq("category", category);
      }

      const { data, error } = await query;

      if (error) {
        setQuizMessage(`Não foi possível carregar as perguntas: ${error.message}`);
        return;
      }

      source = data || [];
    } else if (mode === "categoria") {
      source = demoQuestions.filter(
        (q) => q.category === category
      );
    }

    const size = getQuizSize(mode);

    const uniqueSource = getUniqueQuestions(shuffle(source));
    const quizQuestions = uniqueSource.slice(0, size);

    if (quizQuestions.length === 0) {
      setQuizMessage("Nenhuma pergunta diferente foi encontrada para este modo.");
      return;
    }

    setQuestions(quizQuestions);
    setAnswers({});
    setFinished(false);
    setSaved(false);
    setSaving(false);
    setSaveMessage("");
    setStarted(true);
  }

  async function finishQuiz() {
    setFinished(true);

    if (!hasSupabaseConfig || !session?.user?.id || saved) {
      if (!hasSupabaseConfig) {
        setSaveMessage("Resultado concluído, mas o histórico online não está configurado.");
      }
      return;
    }

    setSaving(true);
    setSaveMessage("");

    const { error } = await supabase.from("quiz_attempts").insert({
      user_id: session.user.id,
      mode,
      category: mode === "categoria" ? category : null,
      total_questions: questions.length,
      correct_answers: score.correct,
      percentage: score.percentage,
      passed: score.passed,
      answers
    });

    setSaving(false);

    if (error) {
      setSaveMessage(`Não foi possível salvar este resultado: ${error.message}`);
      return;
    }

    setSaved(true);
    setSaveMessage("Resultado salvo no seu histórico.");
  }

  if (!started) {
    return (
      <section className="page">
        <div className="section-title">
          <span>Simulado</span>
          <h1>Escolha o modo de prova.</h1>
          <p>
            Depois de iniciar, as perguntas são sorteadas
            automaticamente.
          </p>
        </div>

        <div className="quiz-settings card">
          <label>
            Modo do simulado
            <select
              value={mode}
              onChange={(e) => setMode(e.target.value)}
            >
              <option value="rapido">
                Rápido — 10 perguntas
              </option>
              <option value="completo">
                Completo — até 30 perguntas
              </option>
              <option value="categoria">
                Por categoria — até 15 perguntas únicas
              </option>
            </select>
          </label>

          {mode === "categoria" && (
            <label>
              Categoria
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
              >
                {questionCategories.map((item) => (
                  <option key={item} value={item}>
                    {item}
                  </option>
                ))}
              </select>
            </label>
          )}

          <button
            className="btn primary"
            onClick={startQuiz}
          >
            Iniciar simulado
          </button>

          {quizMessage && <p className="message">{quizMessage}</p>}
        </div>
      </section>
    );
  }

  return (
    <section className="page quiz-page">
      <div className="section-title">
        <span>Simulado</span>
        <h1>Prova teórica online</h1>
        <p>
          Responda todas as perguntas para liberar o resultado
          final.
        </p>
      </div>

      {finished && (
        <div
          className={`result-box ${
            score.passed ? "approved" : "failed"
          }`}
        >
          <div className="result-summary">
            <div className="result-percentage">
              <strong>{score.percentage}</strong><span>%</span>
            </div>
            <div>
              <span className="result-label">Resultado do simulado</span>
              <h2>{score.passed ? "Aprovado no treino" : "Continue estudando"}</h2>
              <p>
                Você acertou <strong>{score.correct} de {questions.length}</strong> questões.
                Seu aproveitamento foi de <strong>{score.percentage}%</strong>.
              </p>
            </div>
          </div>

          <button
            className="btn secondary"
            onClick={() => setStarted(false)}
          >
            Fazer outro simulado
          </button>

          {(saving || saveMessage) && (
            <p className={`save-status ${saved ? "success" : saveMessage ? "error" : ""}`}>
              {saving ? "Salvando resultado..." : saveMessage}
            </p>
          )}
        </div>
      )}

      <div className="questions-list">
        {questions.map((question, index) => {
          const selected = answers[question.id];
          const isCorrect =
            selected === question.correct_option;
          const questionImage = getQuestionImage(question);

          return (
            <article
              className="question-card"
              key={question.id}
            >
              <div className="question-top">
                <span>{index + 1}</span>

                <small>
                  {question.category} ·{" "}
                  {question.difficulty || "normal"}
                </small>
              </div>

              <h3>{question.question}</h3>

              {questionImage && (
                <figure className="question-image">
                  <img
                    src={questionImage.src}
                    alt={questionImage.alt}
                    loading="lazy"
                  />
                  <figcaption>Observe a placa para responder.</figcaption>
                </figure>
              )}

              {["A", "B", "C", "D"].map((option) => (
                <label
                  key={option}
                  className={[
                    "option",
                    finished &&
                    option === question.correct_option
                      ? "correct"
                      : "",
                    finished &&
                    selected === option &&
                    !isCorrect
                      ? "wrong"
                      : ""
                  ].join(" ")}
                >
                  <input
                    type="radio"
                    name={question.id}
                    value={option}
                    disabled={finished}
                    checked={selected === option}
                    onChange={() =>
                      setAnswers({
                        ...answers,
                        [question.id]: option
                      })
                    }
                  />

                  <strong>{option}</strong>

                  <span>
                    {
                      question[
                        `option_${option.toLowerCase()}`
                      ]
                    }
                  </span>
                </label>
              ))}

              {finished && (
                <p className="explanation">
                  <strong>Explicação:</strong>{" "}
                  {question.explanation ||
                    "Revise este conteúdo no material teórico."}
                </p>
              )}
            </article>
          );
        })}
      </div>

      {!finished && (
        <div className="sticky-actions">
          <span>
            {Object.keys(answers).length} de{" "}
            {questions.length} respondidas
          </span>

          <button
            className="btn primary"
            onClick={finishQuiz}
            disabled={
              Object.keys(answers).length <
              questions.length
            }
          >
            Finalizar prova
          </button>
        </div>
      )}
    </section>
  );
}
