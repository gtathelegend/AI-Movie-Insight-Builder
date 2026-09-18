"use client";

import { useState } from "react";

type FaqItem = {
  question: string;
  answer: string;
};

const FAQS: FaqItem[] = [
  {
    question: "What is POP and how does it analyze movies?",
    answer:
      "POP is an AI-powered movie intelligence platform. It gathers canonical metadata from OMDb and verified public audience reviews from TMDb (with automated fallback to IMDb), then uses OpenRouter neural synthesis to extract multidimensional sentiment scores, emotional fingerprints, key themes, and opinion clusters without algorithmic bias.",
  },
  {
    question: "What is the difference between IMDb Rating, Rotten Tomatoes, and POP AI Sentiment?",
    answer:
      "IMDb Rating reflects numerical star ratings (1-10) averaged across all user votes. Rotten Tomatoes reflects the percentage of approved professional critics who gave positive reviews. POP AI Sentiment analyzes the actual written text of real audience reviews to compute a sentiment index from -1.0 to +1.0, modeling what audiences specifically praised or criticized.",
  },
  {
    question: "Does POP hallucinate or fabricate movie reviews?",
    answer:
      "No. POP strictly enforces evidence grounding. All sentiment analysis, key themes, emotion breakdowns, and opinion clusters are derived directly from verified public review texts collected from TMDb and IMDb. We transparently disclose review counts and sources on every movie report.",
  },
  {
    question: "Can I search for a film using an IMDb ID?",
    answer:
      "Yes! You can search by standard movie titles (e.g. 'Inception', 'The Matrix') or directly by IMDb ID (e.g. 'tt0133093', 'tt1375666') for instant canonical lookup.",
  },
  {
    question: "What is the Emotion Fingerprint?",
    answer:
      "The Emotion Fingerprint maps 7 core emotional dimensions (Excitement, Nostalgia, Confusion, Fear, Sadness, Inspiration, Satisfaction) detected across audience reviews to help viewers understand the true emotional tone of a movie before watching.",
  },
  {
    question: "How are Review Opinion Clusters generated?",
    answer:
      "Review clustering groups recurring viewer talking points (such as cinematography praise, pacing critique, or soundtrack acclaim) into weighted percentage clusters with representative quotes from real viewers.",
  },
];

export default function FaqSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const toggleFaq = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  const FAQ_JSON_LD = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": FAQS.map((faq) => ({
      "@type": "Question",
      "name": faq.question,
      "acceptedAnswer": {
        "@type": "Answer",
        "text": faq.answer,
      },
    })),
  };

  return (
    <section className="faq-section" id="faq" aria-label="Frequently Asked Questions">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(FAQ_JSON_LD) }}
      />
      <div className="container" style={{ maxWidth: 960, margin: "0 auto", padding: "64px 24px" }}>
        <span className="section-label mono" style={{ background: "var(--yellow)", color: "var(--ink)" }}>
          {"// CINEMA & METHODOLOGY FAQ"}
        </span>
        <h2 className="section-title" style={{ fontSize: "clamp(32px, 4vw, 48px)", color: "var(--ink)", marginBottom: 12 }}>
          Frequently Asked <span style={{ color: "var(--pink)" }}>Questions</span>.
        </h2>
        <p className="section-sub" style={{ color: "var(--ink-soft)", fontSize: 16, marginBottom: 36, fontWeight: 600 }}>
          Everything you need to know about how POP collects movie metadata, evaluates audience sentiment, and compares critic vs viewer opinions.
        </p>

        <div className="faq-list" style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          {FAQS.map((faq, index) => {
            const isOpen = openIndex === index;
            return (
              <div
                key={index}
                className="faq-item"
                style={{
                  background: "var(--white)",
                  border: "3px solid var(--ink)",
                  borderRadius: 16,
                  boxShadow: isOpen ? "6px 6px 0 var(--ink)" : "4px 4px 0 var(--ink)",
                  overflow: "hidden",
                  transition: "all 0.2s ease",
                }}
              >
                <button
                  type="button"
                  onClick={() => toggleFaq(index)}
                  aria-expanded={isOpen}
                  aria-controls={`faq-answer-${index}`}
                  id={`faq-question-${index}`}
                  style={{
                    width: "100%",
                    padding: "20px 24px",
                    background: "none",
                    border: "none",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    gap: 16,
                    cursor: "pointer",
                    textAlign: "left",
                    color: "var(--ink)",
                    fontFamily: "var(--font-bagel), 'Bagel Fat One', sans-serif",
                    fontSize: "clamp(17px, 1.8vw, 20px)",
                  }}
                >
                  <span>{faq.question}</span>
                  <span
                    style={{
                      transform: isOpen ? "rotate(180deg)" : "rotate(0deg)",
                      transition: "transform 0.2s ease",
                      fontSize: 20,
                      fontWeight: 800,
                      color: "var(--pink)",
                      flexShrink: 0,
                    }}
                  >
                    ▼
                  </span>
                </button>

                {isOpen && (
                  <div
                    id={`faq-answer-${index}`}
                    role="region"
                    aria-labelledby={`faq-question-${index}`}
                    style={{
                      padding: "0 24px 20px 24px",
                      color: "var(--ink-soft)",
                      fontSize: 15,
                      lineHeight: 1.6,
                      fontWeight: 600,
                      borderTop: "2px solid rgba(0,0,0,0.06)",
                      marginTop: 4,
                      paddingTop: 16,
                    }}
                  >
                    {faq.answer}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
