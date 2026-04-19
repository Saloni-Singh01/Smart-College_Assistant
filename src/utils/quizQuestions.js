/** Deterministic MCQs for demo quizzes (no backend). */
export function generateQuestionsForQuiz(quiz) {
  const n = Math.min(Math.max(1, Number(quiz.questions) || 10), 40);
  const base = Number(quiz.id) || 1;
  const sub = quiz.subject || 'Course';

  return Array.from({ length: n }, (_, i) => {
    const seed = base * 1009 + i * 97;
    const correctIndex = seed % 4;
    const wrong = [
      'Confuses prerequisite with definition.',
      'Describes an edge case, not the main idea.',
      'Matches a related but different concept.',
    ];
    const correct = `Best matches the expected ${sub} outcome for this topic.`;
    const options = [];
    let w = 0;
    for (let j = 0; j < 4; j++) {
      options.push(j === correctIndex ? correct : wrong[w++ % wrong.length]);
    }
    return {
      id: i,
      prompt: `${sub} · Question ${i + 1} (${quiz.title || 'Quiz'}): pick the most accurate statement.`,
      options,
      correctIndex,
    };
  });
}
