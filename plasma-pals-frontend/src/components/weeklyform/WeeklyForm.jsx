import React, { useState, useEffect } from "react";
import { v4 as uuidv4 } from "uuid";

const WeeklyForm = ({ email, goal, donations }) => {
  // Receive goal and donations as props
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
      email: email,
      Q1: answers[0] === "Yes" ? 1 : 0,
      Q2: answers[1] === "Yes" ? 1 : 0,
      Q3: answers[2] === "Yes" ? 1 : 0,
      Q4: answers[3] === "Yes" ? 1 : 0,
      Q5: answers[4] === "Yes" ? 1 : 0,
      timeofVisit: timestamp,
    };

    const predictionData = {
      // Data for the prediction server
      email: email,
      goal: goal,
      donations: donations,
      lastVisit: timestamp, // or you can derive last visit info if needed
      prediction: 0, // Placeholder prediction value, adjust as needed
      Q1: answers[0] === "Yes" ? 1 : 0,
      Q2: answers[1] === "Yes" ? 1 : 0,
      Q3: answers[2] === "Yes" ? 1 : 0,
      Q4: answers[3] === "Yes" ? 1 : 0,
      Q5: answers[4] === "Yes" ? 1 : 0,
    };

    try {
      // **First fetch call to the original server (port 5000)**
      const responseForm = await fetch(
        "http://localhost:5000/api/submit-form",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(formData),
        }
      );

      // **Second fetch call to the prediction server (port 5001)**
      const responsePrediction = await fetch(
        "http://localhost:5001/api/submit-prediction",
        {
          // Port 5001 for prediction server
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(predictionData),
        }
      );

      if (responseForm.ok && responsePrediction.ok) {
        // Check both responses
        setHasSubmitted(true);
        alert("Thank you for your submission!");
      } else {
        console.error(
          "Submission failed to one or both servers:",
          responseForm.status,
          responseForm.statusText,
          responsePrediction.status,
          responsePrediction.statusText
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
