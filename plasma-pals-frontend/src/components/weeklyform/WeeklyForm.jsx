import React, { useState, useEffect } from "react";
import { v4 as uuidv4 } from "uuid";

const WeeklyForm = () => {
  const [answers, setAnswers] = useState(Array(5).fill(null));
  const [hasSubmitted, setHasSubmitted] = useState(false);
  const questions = [
    "Was the time it took reasonable?",
    "Did you feel comfortable with the Process?",
    "Did you feel that the staff was friendly and professional?",
    "Did you feel that you were properly compensated for your time?",
    "Were you satisfied with the overall experience?",
  ];

  useEffect(() => {
    const userId = localStorage.getItem("questionnaireUserId");
    if (!userId) {
      localStorage.setItem("questionnaireUserId", uuidv4());
    }
  }, []);

  const handleAnswerChange = (index, value) => {
    const newAnswers = [...answers];
    newAnswers[index] = value;
    setAnswers(newAnswers);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (hasSubmitted) {
      alert("You have already submitted the questionnaire.");
      return;
    }

    const timestamp = new Date().toISOString();
    const userId = localStorage.getItem("questionnaireUserId");

    const formData = {
      userId: userId,
      question1: answers[0] === "Yes" ? 1 : 0,
      question2: answers[1] === "Yes" ? 1 : 0,
      question3: answers[2] === "Yes" ? 1 : 0,
      question4: answers[3] === "Yes" ? 1 : 0,
      question5: answers[4] === "Yes" ? 1 : 0,
      timeofVisit: timestamp,
    };

    try {
      const response = await fetch(
        "http://localhost:3001/api/questionnaire/submissions",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(formData),
        }
      );

      if (response.ok) {
        setHasSubmitted(true);
        alert("Thank you for your submission!");
      } else {
        console.error(
          "Submission failed:",
          response.status,
          response.statusText
        );
        alert("Submission failed. Please try again later.");
      }
    } catch (error) {
      console.error("Error during submission:", error);
      alert(
        "Submission failed due to a network error. Please check your connection and try again."
      );
    }
  };

  return (
    <div>
      <h2>Questionnaire</h2>
      {hasSubmitted ? (
        <p>
          Thank you for your feedback. You have already submitted the
          questionnaire.
        </p>
      ) : (
        <form onSubmit={handleSubmit}>
          {questions.map((question, index) => (
            <div key={index} className="question-container">
              <p>{question}</p>
              <div className="radio-group">
                <label>
                  <input
                    type="radio"
                    name={`question-${index}`}
                    value="Yes"
                    checked={answers[index] === "Yes"}
                    onChange={(e) => handleAnswerChange(index, e.target.value)}
                  />
                  Yes
                </label>
                <label>
                  <input
                    type="radio"
                    name={`question-${index}`}
                    value="No"
                    checked={answers[index] === "No"}
                    onChange={(e) => handleAnswerChange(index, e.target.value)}
                  />
                  No
                </label>
              </div>
            </div>
          ))}
          <button type="submit">Submit Questionnaire</button>
        </form>
      )}
    </div>
  );
};

export default WeeklyForm;
