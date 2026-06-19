export function shuffle(array) {
  const result = [...array];

  for (let index = result.length - 1; index > 0; index -= 1) {
    const randomIndex = Math.floor(Math.random() * (index + 1));
    [result[index], result[randomIndex]] = [result[randomIndex], result[index]];
  }

  return result;
}

export function getQuestionKey(question) {
  return String(question?.question || "")
    .replace(/\s*\([^)]*\)\s*$/, "")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, " ")
    .trim();
}

export function getUniqueQuestions(questions) {
  const seen = new Set();

  return questions.filter((question) => {
    const key = getQuestionKey(question);

    if (!key || seen.has(key)) return false;

    seen.add(key);
    return true;
  });
}

export function getQuizSize(mode) {
  if (mode === "rapido") return 10;
  if (mode === "categoria") return 15;
  return 30;
}

export function calculateScore(questions, answers) {
  const correct = questions.reduce((total, question) => {
    return answers[question.id] === question.correct_option ? total + 1 : total;
  }, 0);

  const percentage = questions.length ? Math.round((correct / questions.length) * 100) : 0;

  return {
    correct,
    percentage,
    passed: percentage >= 70
  };
}
