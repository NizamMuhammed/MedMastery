import React, { useState } from "react";
import { CheckCircle, XCircle, AlertCircle, Check, X } from "lucide-react";

const QuestionCard = ({ questionData, onNext }) => {
  // Store user answers.
  // For MTF: { index: boolean } (true = True selected, false = False selected, undefined = not selected)
  // For SBA: index (number) of selected option
  const [userAnswers, setUserAnswers] = useState({});
  const [sbaSelection, setSbaSelection] = useState(null);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const isMTF = questionData.type === "MTF";

  const handleMtfAnswer = (index, value) => {
    setUserAnswers((prev) => ({
      ...prev,
      [index]: value,
    }));
  };

  const handleSubmit = () => {
    setIsSubmitted(true);
  };

  // Determine if check button should be enabled
  const canSubmit = isMTF ? questionData.options.every((_, index) => userAnswers[index] !== undefined) : sbaSelection !== null;

  const handleNext = () => {
    setUserAnswers({});
    setSbaSelection(null);
    setIsSubmitted(false);
    onNext();
  };

  return (
    <div className="max-w-2xl mx-auto bg-white rounded-lg shadow-lg overflow-hidden border border-gray-200 my-8">
      <div className="p-6">
        <div className="flex justify-between items-center mb-4">
          <span className="bg-blue-100 text-blue-800 text-xs font-medium px-2.5 py-0.5 rounded uppercase tracking-wide">{questionData.category}</span>
          <span className={`text-xs font-medium px-2.5 py-0.5 rounded uppercase tracking-wide ${isMTF ? "bg-purple-100 text-purple-800" : "bg-green-100 text-green-800"}`}>
            {isMTF ? "MTF" : "SBA"}
          </span>
        </div>
        <h2 className="text-xl font-semibold text-gray-800 mb-6 leading-relaxed">{questionData.question}</h2>

        <div className="space-y-4">
          {questionData.options.map((option, index) => {
            // Normalize option data
            const optionText = typeof option === "string" ? option : option.text;
            const isCorrect = typeof option === "string" ? index === questionData.correctAnswer : option.isCorrect;

            if (isMTF) {
              // MTF RENDER LOGIC
              const userAnswer = userAnswers[index];
              const isUserCorrect = userAnswer === isCorrect;

              return (
                <div key={index} className="flex flex-col sm:flex-row sm:items-center gap-3 p-3 rounded-lg border border-gray-100 hover:bg-gray-50 transition-colors">
                  <div className="flex items-center gap-3 flex-1">
                    <span className="font-mono text-sm bg-gray-100 w-6 h-6 flex items-center justify-center rounded-full text-gray-600 shrink-0">{String.fromCharCode(65 + index)}</span>
                    <span className="text-gray-800">{optionText}</span>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    {!isSubmitted ? (
                      <>
                        <button
                          onClick={() => handleMtfAnswer(index, true)}
                          className={`px-3 py-1.5 rounded-md text-sm font-medium transition-colors border ${
                            userAnswer === true ? "bg-blue-600 text-white border-blue-600" : "bg-white text-gray-600 border-gray-300 hover:bg-gray-50"
                          }`}
                        >
                          True
                        </button>
                        <button
                          onClick={() => handleMtfAnswer(index, false)}
                          className={`px-3 py-1.5 rounded-md text-sm font-medium transition-colors border ${
                            userAnswer === false ? "bg-blue-600 text-white border-blue-600" : "bg-white text-gray-600 border-gray-300 hover:bg-gray-50"
                          }`}
                        >
                          False
                        </button>
                      </>
                    ) : (
                      <div className="flex items-center gap-2">
                        <span className={`px-2 py-1 rounded text-xs font-bold uppercase ${userAnswer === true ? "bg-gray-200 text-gray-800" : "bg-gray-100 text-gray-500"}`}>
                          {userAnswer ? "T" : "F"}
                        </span>

                        {isUserCorrect ? <CheckCircle className="text-green-500" size={20} /> : <XCircle className="text-red-500" size={20} />}

                        {!isUserCorrect && (
                          <span className={`text-xs font-medium px-2 py-1 rounded ${isCorrect ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}`}>
                            Actually {isCorrect ? "True" : "False"}
                          </span>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              );
            } else {
              // SBA RENDER LOGIC
              let optionClass = "w-full text-left p-4 rounded-lg border transition-all duration-200 flex items-center gap-3 ";

              if (isSubmitted) {
                if (index === questionData.correctAnswer) {
                  optionClass += "bg-green-50 border-green-500 text-green-900";
                } else if (index === sbaSelection) {
                  optionClass += "bg-red-50 border-red-500 text-red-900";
                } else {
                  optionClass += "border-gray-200 opacity-50";
                }
              } else {
                if (sbaSelection === index) {
                  optionClass += "bg-blue-50 border-blue-500 text-blue-900 ring-1 ring-blue-500";
                } else {
                  optionClass += "border-gray-200 hover:bg-gray-50 hover:border-gray-300";
                }
              }

              return (
                <button key={index} onClick={() => !isSubmitted && setSbaSelection(index)} disabled={isSubmitted} className={optionClass}>
                  <span className="font-mono text-sm bg-gray-100 w-6 h-6 flex items-center justify-center rounded-full text-gray-600 shrink-0">{String.fromCharCode(65 + index)}</span>
                  {optionText}
                  {isSubmitted && index === questionData.correctAnswer && <CheckCircle className="ml-auto text-green-500" size={20} />}
                  {isSubmitted && index === sbaSelection && index !== questionData.correctAnswer && <XCircle className="ml-auto text-red-500" size={20} />}
                </button>
              );
            }
          })}
        </div>

        {!isSubmitted ? (
          <button
            onClick={handleSubmit}
            disabled={!canSubmit}
            className="mt-8 w-full bg-blue-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            Check Answer
          </button>
        ) : (
          <div className="mt-8 bg-blue-50 p-6 rounded-lg border border-blue-100 animate-in fade-in slide-in-from-top-4 duration-300">
            <div className="flex items-start gap-3">
              <AlertCircle className="text-blue-600 shrink-0 mt-0.5" size={20} />
              <div>
                <h3 className="font-semibold text-blue-900 mb-2">Rationale</h3>
                <p className="text-blue-800 leading-relaxed text-sm">{questionData.rationale}</p>
              </div>
            </div>
            <button onClick={handleNext} className="mt-6 w-full bg-gray-900 text-white py-3 px-4 rounded-lg font-medium hover:bg-gray-800 transition-colors">
              Next Question
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default QuestionCard;
