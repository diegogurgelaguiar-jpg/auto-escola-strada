export function shuffle(array) {
  return [...array].sort(() => Math.random() - 0.5);
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
