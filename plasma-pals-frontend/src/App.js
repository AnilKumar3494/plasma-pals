// src/App.js
import React, { useState, useEffect } from "react";

const App = () => {
  const [timeLeft, setTimeLeft] = useState(84 * 60 * 60); // 84 hours in seconds
  const [timerRunning, setTimerRunning] = useState(false);
  const [surveyVisible, setSurveyVisible] = useState(false); // Re-added to control survey visibility
  const [goal, setGoal] = useState(0);
  const [donations, setDonations] = useState(0);
  const [formData, setFormData] = useState({
    q1: "",
    q2: "",
    q3: "",
    q4: "",
    q5: "",
    email: "",
  });

  const handleGoalChange = (e) => {
    const value = parseInt(e.target.value) || 0;
    setGoal(value);
  };

  const handleDonate = () => {
    setDonations(donations + 1);
    setSurveyVisible(true); // Show survey immediately
    if (!timerRunning) {
      setTimerRunning(true);
      setTimeLeft(84 * 60 * 60); // Reset the timer
    }
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

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Survey Submitted:", formData);
    alert("Thank you for your feedback!");
    setFormData({
      q1: "",
      q2: "",
      q3: "",
      q4: "",
      q5: "",
      email: "",
    });
    setSurveyVisible(false); // Hide survey after submission
  };

  const peopleHelped = donations * 3;
  const totalEarned = donations * 50;
  const progress = goal > 0 ? Math.min((totalEarned / goal) * 100, 100) : 0;

  return (
    <div style={{ padding: "20px", textAlign: "center", backgroundColor: "#f9f9f9", minHeight: "100vh", fontFamily: "'Montserrat', sans-serif"}}>
      <h1 style={{ fontSize: "72px", color: "#DAA520", marginBottom: "20px" }}>PlasmaPals</h1>
      
      <div style={{ marginBottom: "20px" }}>
        <label style={{ fontSize: "24px" }}>
          Your Financial Goal: $
          <input
            type="number"
            value={goal}
            onChange={handleGoalChange}
            style={{ padding: "10px", marginLeft: "5px", borderRadius: "5px", border: "1px solid #ccc", fontSize: "24px" }}
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

      <div style={{ marginBottom: "20px", textAlign: "left", maxWidth: "800px", margin: "0 auto" }}>
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
        <div style={{ maxWidth: "600px", margin: "20px auto", backgroundColor: "#fff", padding: "20px", borderRadius: "8px", boxShadow: "0 0 10px rgba(0, 0, 0, 0.1)" }}>
          <h2 style={{ fontSize: "36px", marginBottom: "20px" }}>Weekly Update Survey</h2>
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
                    checked={formData[`q${index + 1}`] === "true"}
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
                    checked={formData[`q${index + 1}`] === "false"}
                    required
                  />
                  False
                </label>
              </div>
            ))}
            <div style={{ marginBottom: "20px" }}>
              <label style={{ fontSize: "24px" }}>
                Your Email:
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  style={{ display: "block", width: "100%", padding: "10px", marginTop: "5px", borderRadius: "5px", border: "1px solid #ccc", fontSize: "24px" }}
                  required
                />
              </label>
            </div>

            <button
              type="submit"
              style={{ backgroundColor: "#DAA520", color: "#fff", padding: "15px 30px", border: "none", borderRadius: "5px", cursor: "pointer", fontSize: "24px" }}
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
