import React, { useState } from "react";
import { QuizQuestion, LabType } from "../../types/science";
import { useLabProgress } from "../../context/LabProgressContext";
import { CheckCircle2, XCircle, RotateCcw, Award, ArrowRight, HelpCircle } from "lucide-react";

interface QuizRunnerProps {
  labId: LabType;
  labTitle: string;
  questions: QuizQuestion[];
  onFinish?: () => void;
}

export const QuizRunner: React.FC<QuizRunnerProps> = ({ labId, labTitle, questions, onFinish }) => {
  const { recordQuizScore, progress } = useLabProgress();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [isAnswerSubmitted, setIsAnswerSubmitted] = useState(false);
  const [userAnswers, setUserAnswers] = useState<
    { questionId: string; selectedIndex: number; isCorrect: boolean }[]
  >([]);
  const [quizCompleted, setQuizCompleted] = useState(false);

  const currentQ = questions[currentIndex];
  const previousScore = progress.quizScores[labId];

  const handleSelectOption = (idx: number) => {
    if (isAnswerSubmitted) return;
    setSelectedOption(idx);
  };

  const handleSubmitAnswer = () => {
    if (selectedOption === null || !currentQ) return;
    const isCorrect = selectedOption === currentQ.correctIndex;
    setIsAnswerSubmitted(true);
    setUserAnswers((prev) => [
      ...prev,
      {
        questionId: currentQ.id,
        selectedIndex: selectedOption,
        isCorrect,
      },
    ]);
  };

  const handleNext = () => {
    if (currentIndex + 1 < questions.length) {
      setCurrentIndex((prev) => prev + 1);
      setSelectedOption(null);
      setIsAnswerSubmitted(false);
    } else {
      // Complete quiz
      const correctCount = userAnswers.filter((a) => a.isCorrect).length;
      recordQuizScore(labId, correctCount, questions.length);
      setQuizCompleted(true);
      if (onFinish) onFinish();
    }
  };

  const handleRestart = () => {
    setCurrentIndex(0);
    setSelectedOption(null);
    setIsAnswerSubmitted(false);
    setUserAnswers([]);
    setQuizCompleted(false);
  };

  if (quizCompleted) {
    const correctCount = userAnswers.filter((a) => a.isCorrect).length;
    const percentage = Math.round((correctCount / questions.length) * 100);
    const understood = questions
      .filter((q) => userAnswers.find((a) => a.questionId === q.id)?.isCorrect)
      .map((q) => q.concept);
    const toRevisit = questions
      .filter((q) => !userAnswers.find((a) => a.questionId === q.id)?.isCorrect)
      .map((q) => q.concept);

    return (
      <div className="rounded-2xl border border-border/70 bg-card/90 p-8 shadow-xl backdrop-blur-md">
        <div className="text-center">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-primary/10 text-primary">
            <Award className="h-9 w-9" />
          </div>
          <span className="inline-block rounded-full bg-primary/15 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-primary">
            {labTitle} Assessment
          </span>
          <h2 className="mt-2 text-3xl font-bold text-foreground">Your Science Lab Result</h2>
          <p className="mt-1 text-sm text-muted-foreground">
            {percentage >= 80
              ? "Outstanding scientific reasoning! You have mastered the core principles."
              : percentage >= 60
                ? "Good effort! You've grasped the main concepts with a few points to review."
                : "A valuable learning attempt! Review the explanations below and give it another try."}
          </p>

          <div className="my-6 inline-flex flex-col items-center justify-center rounded-2xl border border-primary/20 bg-primary/5 px-8 py-4">
            <span className="text-5xl font-extrabold tracking-tight text-primary">
              {percentage}%
            </span>
            <span className="mt-1 text-sm font-medium text-foreground">
              {correctCount} of {questions.length} Correct
            </span>
          </div>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          {/* Concepts understood */}
          <div className="rounded-xl border border-emerald-500/20 bg-emerald-500/5 p-5">
            <div className="mb-3 flex items-center gap-2 text-emerald-500">
              <CheckCircle2 className="h-5 w-5" />
              <h3 className="font-semibold">Concepts Understood ({understood.length})</h3>
            </div>
            {understood.length === 0 ? (
              <p className="text-sm text-muted-foreground">No concepts mastered yet. Try again!</p>
            ) : (
              <ul className="space-y-1.5 text-sm text-muted-foreground">
                {Array.from(new Set(understood)).map((c, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-emerald-500" />
                    <span>{c}</span>
                  </li>
                ))}
              </ul>
            )}
          </div>

          {/* Concepts to revisit */}
          <div className="rounded-xl border border-amber-500/20 bg-amber-500/5 p-5">
            <div className="mb-3 flex items-center gap-2 text-amber-500">
              <HelpCircle className="h-5 w-5" />
              <h3 className="font-semibold">Concepts to Revisit ({toRevisit.length})</h3>
            </div>
            {toRevisit.length === 0 ? (
              <p className="text-sm text-muted-foreground">
                Fantastic job! You mastered every concept on this quiz!
              </p>
            ) : (
              <ul className="space-y-1.5 text-sm text-muted-foreground">
                {Array.from(new Set(toRevisit)).map((c, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-amber-500" />
                    <span>{c}</span>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>

        <div className="mt-8 flex justify-center">
          <button
            onClick={handleRestart}
            className="flex items-center gap-2 rounded-xl bg-primary px-6 py-3 font-semibold text-primary-foreground shadow-lg transition-all hover:opacity-90 active:scale-95"
          >
            <RotateCcw className="h-4 w-4" />
            Retake Quiz
          </button>
        </div>
      </div>
    );
  }

  if (!currentQ) return null;

  return (
    <div className="rounded-2xl border border-border/70 bg-card/90 p-6 shadow-xl backdrop-blur-md sm:p-8">
      {/* Progress header */}
      <div className="mb-6 flex flex-wrap items-center justify-between gap-2 border-b border-border/60 pb-4">
        <div>
          <span className="text-xs font-semibold uppercase tracking-wider text-primary">
            {labTitle} Quiz
          </span>
          <h3 className="text-xl font-bold text-foreground">
            Question {currentIndex + 1} of {questions.length}
          </h3>
        </div>
        <div className="flex items-center gap-3">
          {previousScore && (
            <span className="rounded-lg bg-muted px-2.5 py-1 text-xs text-muted-foreground">
              Best: {previousScore.score}/{previousScore.total}
            </span>
          )}
          <span className="rounded-full bg-primary/10 px-3 py-1 text-xs font-medium text-primary">
            Concept: {currentQ.concept}
          </span>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="mb-6 h-2 w-full overflow-hidden rounded-full bg-muted">
        <div
          className="h-full bg-primary transition-all duration-300"
          style={{ width: `${((currentIndex + 1) / questions.length) * 100}%` }}
        />
      </div>

      {/* Question */}
      <div className="mb-6">
        {currentQ.scenario && (
          <div className="mb-3 rounded-lg border border-primary/20 bg-primary/5 p-3 text-sm italic text-foreground/90">
            {currentQ.scenario}
          </div>
        )}
        <h4 className="text-lg font-medium text-foreground leading-relaxed">{currentQ.question}</h4>
      </div>

      {/* Options */}
      <div className="space-y-3">
        {currentQ.options.map((opt, idx) => {
          let btnStyle =
            "border-border/80 bg-background/80 hover:border-primary/60 hover:bg-primary/5 text-foreground";
          let icon = null;

          if (isAnswerSubmitted) {
            if (idx === currentQ.correctIndex) {
              btnStyle = "border-emerald-500 bg-emerald-500/15 text-emerald-500 font-semibold";
              icon = <CheckCircle2 className="h-5 w-5 shrink-0 text-emerald-500" />;
            } else if (idx === selectedOption) {
              btnStyle = "border-red-500 bg-red-500/15 text-red-500 font-semibold";
              icon = <XCircle className="h-5 w-5 shrink-0 text-red-500" />;
            } else {
              btnStyle = "opacity-50 border-border/40 text-muted-foreground";
            }
          } else if (selectedOption === idx) {
            btnStyle =
              "border-primary bg-primary/10 text-primary font-semibold ring-2 ring-primary/20";
          }

          return (
            <button
              key={idx}
              disabled={isAnswerSubmitted}
              onClick={() => handleSelectOption(idx)}
              className={`flex w-full items-center justify-between rounded-xl border p-4 text-left text-sm transition-all sm:text-base ${btnStyle}`}
            >
              <div className="flex items-center gap-3">
                <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg border border-current text-xs font-bold">
                  {String.fromCharCode(65 + idx)}
                </span>
                <span>{opt}</span>
              </div>
              {icon}
            </button>
          );
        })}
      </div>

      {/* Feedback Explanation */}
      {isAnswerSubmitted && (
        <div
          className={`mt-6 rounded-xl border p-4 text-sm animate-in fade-in-50 ${
            selectedOption === currentQ.correctIndex
              ? "border-emerald-500/30 bg-emerald-500/10 text-emerald-600 dark:text-emerald-300"
              : "border-red-500/30 bg-red-500/10 text-red-600 dark:text-red-300"
          }`}
        >
          <div className="mb-1 font-semibold flex items-center gap-1.5">
            {selectedOption === currentQ.correctIndex ? (
              <>
                <CheckCircle2 className="h-4 w-4" /> Correct Understanding!
              </>
            ) : (
              <>
                <XCircle className="h-4 w-4" /> Not Quite Right
              </>
            )}
          </div>
          <p className="leading-relaxed opacity-95">{currentQ.explanation}</p>
        </div>
      )}

      {/* Action footer */}
      <div className="mt-8 flex justify-end">
        {!isAnswerSubmitted ? (
          <button
            disabled={selectedOption === null}
            onClick={handleSubmitAnswer}
            className="flex items-center gap-2 rounded-xl bg-primary px-6 py-3 font-semibold text-primary-foreground shadow-md transition-all hover:opacity-90 disabled:opacity-40"
          >
            Check Answer
          </button>
        ) : (
          <button
            onClick={handleNext}
            className="flex items-center gap-2 rounded-xl bg-primary px-6 py-3 font-semibold text-primary-foreground shadow-md transition-all hover:opacity-90"
          >
            {currentIndex + 1 < questions.length ? (
              <>
                Next Question <ArrowRight className="h-4 w-4" />
              </>
            ) : (
              <>
                View Quiz Results <Award className="h-4 w-4" />
              </>
            )}
          </button>
        )}
      </div>
    </div>
  );
};
