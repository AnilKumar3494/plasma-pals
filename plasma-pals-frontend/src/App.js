// src/App.js
import React, { useState, useEffect } from "react";
import PlasmaImage from "./plasma.png";

const App = () => {
  const [timeLeft, setTimeLeft] = useState(84 * 60 * 60);
  const [timerRunning, setTimerRunning] = useState(false);
  const [surveyVisible, setSurveyVisible] = useState(false);
  const [goal, setGoal] = useState(0);
  const [donations, setDonations] = useState(0);
  const [email, setEmail] = useState("");
  const [emailAdded, setEmailAdded] = useState(false);
  const [formData, setFormData] = useState({
    q1: "",
    q2: "",
    q3: "",
    q4: "",
    q5: "",
  });

  const handleGoalChange = (e) => {
    const value = parseInt(e.target.value) || 0;
    setGoal(value);
  };

  const handleEmailChange = (e) => {
    setEmail(e.target.value);
  };

  const handleAddEmail = () => {
    if (email.trim()) {
      setEmailAdded(true);
      setTimeout(() => setEmailAdded(false), 3000);
    }
  };

  const handleDonate = () => {
    setDonations(donations + 1);
    setSurveyVisible(true); // Ensure survey is visible
    setTimerRunning(true);
    setTimeLeft(84 * 60 * 60);
  };

  useEffect(() => {
    if (timerRunning && timeLeft > 0) {
      const interval = setInterval(() => {
        setTimeLeft((prevTime) => prevTime - 1);
      }, 1000);
      return () => clearInterval(interval);
    }
  }, [timerRunning, timeLeft]);

  const formatTime = (seconds) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${hours.toString().padStart(2, "0")}:${minutes
      .toString()
      .padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
  };

  // Updated: Convert True/False to 1/0 and output the array
  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Survey Submitted:", formData);

    // 1. Build the array of 1s and 0s
    const responseArray = [
      formData.q1 === "true" ? 1 : 0,
      formData.q2 === "true" ? 1 : 0,
      formData.q3 === "true" ? 1 : 0,
      formData.q4 === "true" ? 1 : 0,
      formData.q5 === "true" ? 1 : 0,
    ];

    // 2. Log the array and show it in an alert
    console.log("Response array:", responseArray);
    alert(`Response array: [${responseArray.join(", ")}]`);

    alert("Thank you for your feedback!");
    setFormData({
      q1: "",
      q2: "",
      q3: "",
      q4: "",
      q5: "",
    });
    setSurveyVisible(false);
  };

  const peopleHelped = donations * 3;
  const totalEarned = donations * 50;
  const progress = goal > 0 ? Math.min((totalEarned / goal) * 100, 100) : 0;

  return (
    <div
      style={{
        padding: "20px",
        textAlign: "center",
        backgroundColor: "#f9f9f9",
        minHeight: "100vh",
        fontFamily: "'Montserrat', sans-serif",
      }}
    >
      <h1 style={{ fontSize: "72px", color: "#DAA520", marginBottom: "20px" }}>
        PlasmaPals
      </h1>

      <img
        src={PlasmaImage}
        alt="Plasma Donation"
        style={{ width: "300px", marginBottom: "20px" }}
      />

      <div style={{ marginBottom: "20px" }}>
        <input
          type="email"
          placeholder="Enter your email"
          value={email}
          onChange={handleEmailChange}
          style={{
            padding: "10px",
            borderRadius: "5px",
            border: "1px solid #ccc",
            fontSize: "24px",
            marginRight: "10px",
          }}
        />
        <button
          onClick={handleAddEmail}
          style={{
            backgroundColor: "#DAA520",
            color: "#fff",
            padding: "10px 20px",
            border: "none",
            borderRadius: "5px",
            cursor: "pointer",
            fontSize: "24px",
          }}
        >
          Add Email
        </button>
        {emailAdded && (
          <p style={{ color: "green", marginTop: "10px", fontSize: "20px" }}>
            Email added!
          </p>
        )}
      </div>

      <div style={{ marginBottom: "20px" }}>
        <label style={{ fontSize: "24px" }}>
          Your Financial Goal: $
          <input
            type="number"
            value={goal}
            onChange={handleGoalChange}
            style={{
              padding: "10px",
              marginLeft: "5px",
              borderRadius: "5px",
              border: "1px solid #ccc",
              fontSize: "24px",
            }}
          />
        </label>
      </div>

      <button
        onClick={handleDonate}
        style={{
          backgroundColor: "#DAA520",
          color: "#fff",
          padding: "15px 30px",
          border: "none",
          borderRadius: "5px",
          cursor: "pointer",
          marginBottom: "20px",
          fontSize: "24px",
        }}
      >
        Donated Plasma!
      </button>

      <div style={{ marginBottom: "20px" }}>
        <p style={{ fontSize: "24px" }}>Total Donations: {donations}</p>
        <p style={{ fontSize: "24px" }}>People Helped: {peopleHelped}</p>
        <p style={{ fontSize: "24px" }}>Time until next donation: {formatTime(timeLeft)}</p>
      </div>

      <div style={{ marginBottom: "20px", maxWidth: "800px", margin: "0 auto" }}>
        <div style={{ backgroundColor: "#eee", borderRadius: "5px", overflow: "hidden" }}>
          <div
            style={{
              width: `${progress}%`,
              backgroundColor: "#DAA520",
              padding: "10px 0",
              color: "#fff",
              textAlign: "center",
              fontSize: "24px",
            }}
          >
            ${totalEarned} / ${goal}
          </div>
        </div>
      </div>

      {surveyVisible && (
        <div
          style={{
            marginTop: "20px",
            backgroundColor: "#fff",
            padding: "20px",
            borderRadius: "8px",
            boxShadow: "0 0 10px rgba(0, 0, 0, 0.1)",
          }}
        >
          <h2 style={{ fontSize: "36px", marginBottom: "20px" }}>
            Weekly Update Survey
          </h2>
          <form onSubmit={handleSubmit}>
            {[
              "Was the time it took reasonable?",
              "Did you feel comfortable with the process?",
              "Did you feel that the staff was friendly and professional?",
              "Did you feel that you were properly compensated for your time?",
              "Were you satisfied with the overall experience?",
            ].map((question, index) => (
              <div key={index} style={{ marginBottom: "20px" }}>
                <p style={{ fontSize: "24px" }}>{question}</p>
                <label>
                  <input
                    type="radio"
                    name={`q${index + 1}`}
                    value="true"
                    onChange={handleInputChange}
                    required
                  />
                  True
                </label>
                <label style={{ marginLeft: "20px" }}>
                  <input
                    type="radio"
                    name={`q${index + 1}`}
                    value="false"
                    onChange={handleInputChange}
                    required
                  />
                  False
                </label>
              </div>
            ))}
            <button
              type="submit"
              style={{
                backgroundColor: "#DAA520",
                color: "#fff",
                padding: "15px 30px",
                border: "none",
                borderRadius: "5px",
                cursor: "pointer",
                fontSize: "24px",
              }}
            >
              Submit Survey
            </button>
          </form>
        </div>
      )}
    </div>
  );
};

export default App;
