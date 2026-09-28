import React, { useState } from "react";
import { LAB_ASSISTANT_FAQ, AssistantQuestion } from "../data/assistantData";
import { Bot, Sparkles, X, Search, HelpCircle, BookOpen, Lightbulb } from "lucide-react";

interface LabAssistantProps {
  currentLab?: "chemistry" | "genetics" | "disasters";
}

export const LabAssistant: React.FC<LabAssistantProps> = ({ currentLab }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<
    "all" | "chemistry" | "genetics" | "disasters"
  >(currentLab || "all");
  const [searchQuery, setSearchQuery] = useState("");
  const [activeQuestion, setActiveQuestion] = useState<AssistantQuestion | null>(null);

  const filteredQuestions = LAB_ASSISTANT_FAQ.filter((item) => {
    const matchesCat = selectedCategory === "all" || item.lab === selectedCategory;
    const matchesSearch =
      item.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.answer.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.keyTakeaway.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCat && matchesSearch;
  });

  return (
    <>
      {/* Floating Launcher Button */}
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 z-40 flex items-center gap-2.5 rounded-full bg-primary px-4 py-3 text-sm font-semibold text-primary-foreground shadow-2xl transition-all duration-300 hover:scale-105 active:scale-95 hover:shadow-primary/30 group"
        title="Open AI Science Lab Assistant"
      >
        <div className="relative flex h-6 w-6 items-center justify-center rounded-full bg-primary-foreground/20">
          <Bot className="h-4 w-4" />
          <span className="absolute -top-1 -right-1 flex h-2.5 w-2.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
          </span>
        </div>
        <span>Lab Assistant</span>
        <Sparkles className="h-3.5 w-3.5 opacity-80 group-hover:rotate-12 transition-transform" />
      </button>

      {/* Assistant Modal / Drawer */}
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="flex h-[85vh] w-full max-w-3xl flex-col rounded-2xl border border-border/80 bg-card shadow-2xl overflow-hidden">
            {/* Header */}
            <div className="flex items-center justify-between border-b border-border/70 bg-muted/40 px-6 py-4">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
                  <Bot className="h-6 w-6" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="font-bold text-foreground">AI Science Lab Assistant</h3>
                    <span className="rounded-full bg-emerald-500/10 px-2 py-0.5 text-[11px] font-semibold text-emerald-600 dark:text-emerald-400">
                      Active
                    </span>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Ask scientific questions, explore atomic structures, and understand simulations
                  </p>
                </div>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="rounded-lg p-2 text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Category tabs and Search */}
            <div className="border-b border-border/60 p-4 bg-background/50 space-y-3">
              {/* Category pills */}
              <div className="flex flex-wrap gap-2">
                {(
                  [
                    { id: "all", label: "All Topics" },
                    { id: "chemistry", label: "Chemical Reactions" },
                    { id: "genetics", label: "DNA & Genetics" },
                    { id: "disasters", label: "Natural Disasters" },
                  ] as const
                ).map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => {
                      setSelectedCategory(tab.id);
                      setActiveQuestion(null);
                    }}
                    className={`rounded-lg px-3 py-1.5 text-xs font-medium transition-colors ${
                      selectedCategory === tab.id
                        ? "bg-primary text-primary-foreground font-semibold shadow-sm"
                        : "bg-muted text-muted-foreground hover:bg-muted/80 hover:text-foreground"
                    }`}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>

              {/* Search */}
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <input
                  type="text"
                  placeholder="Search a concept (e.g. atoms, dominant allele, epicenter, magma)..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full rounded-xl border border-border bg-background py-2 pl-9 pr-4 text-xs sm:text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30"
                />
              </div>
            </div>

            {/* Content Body */}
            <div className="flex-1 overflow-y-auto p-6 space-y-4">
              {activeQuestion ? (
                // Active Question Detail
                <div className="space-y-4 animate-in fade-in-50">
                  <button
                    onClick={() => setActiveQuestion(null)}
                    className="inline-flex items-center gap-1.5 text-xs font-medium text-primary hover:underline"
                  >
                    ← Back to suggested questions
                  </button>

                  <div className="rounded-2xl border border-primary/20 bg-primary/5 p-5">
                    <div className="flex items-start gap-3">
                      <HelpCircle className="h-5 w-5 text-primary mt-0.5 shrink-0" />
                      <h4 className="text-base sm:text-lg font-bold text-foreground">
                        {activeQuestion.question}
                      </h4>
                    </div>
                  </div>

                  <div className="rounded-2xl border border-border/80 bg-card p-6 shadow-sm space-y-4">
                    <div className="flex items-center gap-2 text-xs font-semibold text-primary uppercase tracking-wider">
                      <BookOpen className="h-4 w-4" /> Scientific Explanation
                    </div>
                    <p className="text-sm leading-relaxed text-foreground/90">
                      {activeQuestion.answer}
                    </p>

                    <div className="rounded-xl border border-amber-500/20 bg-amber-500/10 p-4">
                      <div className="flex items-center gap-2 text-amber-600 dark:text-amber-400 font-semibold text-xs mb-1">
                        <Lightbulb className="h-4 w-4" /> Key Concept Takeaway
                      </div>
                      <p className="text-xs sm:text-sm text-foreground font-medium">
                        {activeQuestion.keyTakeaway}
                      </p>
                    </div>
                  </div>
                </div>
              ) : (
                // List of suggested questions
                <div className="space-y-3">
                  <div className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                    Click a question to ask the Lab Assistant:
                  </div>

                  {filteredQuestions.length === 0 ? (
                    <div className="py-12 text-center text-sm text-muted-foreground">
                      No matching questions found. Try searching for "molecules", "traits", or
                      "plates".
                    </div>
                  ) : (
                    filteredQuestions.map((q) => (
                      <button
                        key={q.id}
                        onClick={() => setActiveQuestion(q)}
                        className="flex w-full items-start justify-between rounded-xl border border-border/70 bg-card p-4 text-left shadow-sm transition-all hover:border-primary/50 hover:bg-primary/5 group"
                      >
                        <div className="flex items-start gap-3 pr-2">
                          <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary text-xs font-bold mt-0.5">
                            ?
                          </span>
                          <div>
                            <div className="text-sm font-medium text-foreground group-hover:text-primary transition-colors">
                              {q.question}
                            </div>
                            <div className="mt-1 text-xs text-muted-foreground line-clamp-1">
                              {q.keyTakeaway}
                            </div>
                          </div>
                        </div>
                        <span className="text-xs font-semibold text-primary opacity-0 group-hover:opacity-100 transition-opacity shrink-0 mt-1">
                          View →
                        </span>
                      </button>
                    ))
                  )}
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="border-t border-border/60 bg-muted/30 px-6 py-3 text-center text-xs text-muted-foreground">
              Designed for science learners aged 11–16 • Grounded in physical, biological &
              geological science
            </div>
          </div>
        </div>
      )}
    </>
  );
};
