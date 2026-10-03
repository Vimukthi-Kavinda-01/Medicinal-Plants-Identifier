import React, { useState } from 'react';
import { CircleNotch, Question, CheckCircle } from '@phosphor-icons/react';

const UNSURE = 'unsure';

/** Steps 5–6 – plant-feature questions asked when confidence is low or medium. */
export default function VerificationQuestions({ questions, level, isSubmitting, error, onSubmit, onSkip }) {
  const [answers, setAnswers] = useState({});
  const answeredCount = Object.values(answers).filter((value) => value !== UNSURE).length;

  const choose = (questionId, value) => setAnswers((current) => ({ ...current, [questionId]: value }));

  return (
    <section className="rounded-2xl border border-accent-200 bg-accent-50/60 p-4 sm:p-6 space-y-5 animate-fade-in">
      <div className="flex items-start gap-3">
        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-accent-600 text-white">
          <Question size={20} weight="fill" />
        </div>
        <div>
          <h3 className="text-base font-bold text-accent-900">Help us verify this plant</h3>
          <p className="text-xs leading-relaxed text-accent-800/80">
            The image match is {level === 'low' ? 'weak' : 'not certain'}. Look at the real plant and answer what you can.
            Choose &quot;Not sure&quot; for anything you cannot check.
          </p>
        </div>
      </div>

      {questions.map((question, index) => (
        <fieldset key={question.id} className="space-y-2">
          <legend className="text-sm font-bold text-gray-900">
            {index + 1}. {question.text}
          </legend>
          {question.hint && <p className="text-xs text-gray-500">{question.hint}</p>}

          <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
            {[...question.options, { value: UNSURE, label: 'Not sure' }].map((option) => {
              const selected = answers[question.id] === option.value;
              return (
                <label
                  key={option.value}
                  className={`flex cursor-pointer items-center gap-2 rounded-xl border px-3 py-2.5 text-xs font-medium transition-colors ${
                    selected
                      ? 'border-accent-500 bg-white text-accent-900 shadow-soft'
                      : 'border-gray-200 bg-white/70 text-gray-700 hover:border-accent-300'
                  }`}
                >
                  <input
                    type="radio"
                    name={question.id}
                    value={option.value}
                    checked={selected}
                    onChange={() => choose(question.id, option.value)}
                    className="sr-only"
                  />
                  {selected ? (
                    <CheckCircle size={16} weight="fill" className="shrink-0 text-accent-600" />
                  ) : (
                    <span className="h-4 w-4 shrink-0 rounded-full border border-gray-300" />
                  )}
                  <span>{option.label}</span>
                </label>
              );
            })}
          </div>
        </fieldset>
      ))}

      {error && <p className="rounded-xl border border-red-200 bg-red-50 p-3 text-xs text-red-800">{error}</p>}

      <div className="flex flex-col gap-2 sm:flex-row">
        <button
          type="button"
          disabled={isSubmitting || answeredCount === 0}
          onClick={() => onSubmit(answers)}
          className="flex flex-1 items-center justify-center gap-2 rounded-2xl bg-herb-700 px-5 py-3 text-sm font-bold text-white transition-colors hover:bg-herb-800 disabled:cursor-not-allowed disabled:bg-gray-200 disabled:text-gray-400"
        >
          {isSubmitting ? (
            <>
              <CircleNotch size={18} className="animate-spin" /> Verifying...
            </>
          ) : (
            'Verify my answers'
          )}
        </button>
        <button
          type="button"
          disabled={isSubmitting}
          onClick={onSkip}
          className="rounded-2xl border border-gray-300 bg-white px-5 py-3 text-sm font-semibold text-gray-700 transition-colors hover:bg-gray-50 disabled:opacity-50"
        >
          Skip questions
        </button>
      </div>
    </section>
  );
}