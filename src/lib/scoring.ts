import type {
  AssessmentQuestion,
  QuestionResult,
  UserAnswer,
} from "./types";

function normalizeTf(val: string): string {
  const v = val.trim().toUpperCase();
  if (v.startsWith("T") || v === "TRUE") return "TRUE";
  if (v.startsWith("F") || v === "FALSE") return "FALSE";
  return v;
}

export function scoreQuestion(
  question: AssessmentQuestion,
  answer?: UserAnswer
): QuestionResult {
  const userAnswer = answer?.value?.trim() || answer?.selectedKey || "";
  const base = {
    questionId: question.id,
    max: question.marks,
    userAnswer,
    correctAnswer: question.correctAnswer,
    explanation: question.explanation,
    modelAnswer: question.modelAnswer,
  };

  if (question.type === "mcq" && question.options?.length) {
    const selected = (answer?.selectedKey || userAnswer).toUpperCase().charAt(0);
    const correct = (question.correctAnswer || "").toUpperCase().charAt(0);
    const isCorrect = selected === correct && !!selected;
    return {
      ...base,
      earned: isCorrect ? question.marks : 0,
      isAutoGraded: true,
      isCorrect,
      correctAnswer: correct,
    };
  }

  if (
    question.type === "true_false" ||
    question.type === "true_false_justification"
  ) {
    if (question.type === "true_false_justification") {
      const verdict = normalizeTf(userAnswer.split("\n")[0] || "");
      const correct = normalizeTf(question.correctAnswer || question.tfVerdict || "");
      const hasJustification = userAnswer.split("\n").slice(1).join("").trim().length > 40;
      const verdictOk = verdict === correct && !!verdict;
      const earned =
        verdictOk && hasJustification
          ? question.marks
          : verdictOk
            ? Math.floor(question.marks / 2)
            : 0;
      return {
        ...base,
        earned,
        isAutoGraded: true,
        isCorrect: verdictOk && hasJustification,
        correctAnswer: correct,
      };
    }
    const selected = normalizeTf(userAnswer);
    const correct = normalizeTf(question.correctAnswer || question.tfVerdict || "");
    const isCorrect = selected === correct && !!selected;
    return {
      ...base,
      earned: isCorrect ? question.marks : 0,
      isAutoGraded: true,
      isCorrect,
      correctAnswer: correct,
    };
  }

  if (question.type === "coding" || question.type === "live_coding") {
    const codingResults = answer?.codingResults;
    const submitted = userAnswer.length > 30;
    let earned = 0;
    if (codingResults && (codingResults.passed + codingResults.failed) > 0) {
      const totalTests = codingResults.passed + codingResults.failed;
      earned = Math.round((codingResults.passed / totalTests) * question.marks);
    } else {
      earned = submitted ? question.marks : 0;
    }
    return {
      ...base,
      earned,
      isAutoGraded: true,
      isCorrect: codingResults ? codingResults.failed === 0 && codingResults.passed > 0 : submitted,
      correctAnswer: question.starterCode ? "See model solution in results" : undefined,
      codingResults,
    };
  }

  if (question.type === "coding_project") {
    const submitted = userAnswer.length > 20;
    return {
      ...base,
      earned: submitted ? question.marks : 0,
      isAutoGraded: false,
      isCorrect: submitted,
    };
  }

  if (question.type === "descriptive") {
    const wordCount = userAnswer.split(/\s+/).filter(Boolean).length;
    const earned =
      wordCount >= 40
        ? question.marks
        : wordCount >= 20
          ? Math.ceil(question.marks * 0.6)
          : wordCount >= 8
            ? Math.ceil(question.marks * 0.3)
            : 0;
    return {
      ...base,
      earned,
      isAutoGraded: false,
      isCorrect: wordCount >= 40,
    };
  }

  return {
    ...base,
    earned: userAnswer ? Math.ceil(question.marks * 0.5) : 0,
    isAutoGraded: false,
  };
}

export function scoreAssessment(
  questions: AssessmentQuestion[],
  answers: UserAnswer[]
): { results: QuestionResult[]; totalEarned: number; totalMax: number } {
  const answerMap = new Map(answers.map((a) => [a.questionId, a]));
  const results = questions.map((q) =>
    scoreQuestion(q, answerMap.get(q.id))
  );
  const totalEarned = results.reduce((s, r) => s + r.earned, 0);
  const totalMax = results.reduce((s, r) => s + r.max, 0);
  return { results, totalEarned, totalMax };
}
