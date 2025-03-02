import React, { useState, useEffect } from "react";
import PlasmaImage from "../../assets/plasma.png";
import WeeklyForm from "../weeklyform/WeeklyForm";

const HeroSection = () => {
  const [timeLeft, setTimeLeft] = useState(84 * 60 * 60);
  const [timerRunning, setTimerRunning] = useState(false);
  const [surveyVisible, setSurveyVisible] = useState(false);
  const [goal, setGoal] = useState(0);
  const [donations, setDonations] = useState(0);
  const [email, setEmail] = useState("");
  const [emailAdded, setEmailAdded] = useState(false);

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

  function runPythonScript(command) {
    const url = new URL("http://localhost:5000/run-python");
    url.searchParams.append("command", command);

    fetch(url)
      .then((response) => response.text()) // Read as text first
      .then((text) => {
        try {
          const data = JSON.parse(text);
          console.log("Python Output:", data.output);
        } catch (error) {
          console.error("Invalid JSON response:", text);
        }
      })
      .catch((error) => console.error("Error running Python script:", error));
  }

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

  console.log("Running Python script with email:", email);

  runPythonScript(`python3 emailer.py ${email}`);

  //runPythonScript(`python3 script.py ${formData.q1} ${formData.q2} ${formData.q3} ${formData.q4} ${formData.q5} ${email}`);

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
          required
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
        <p style={{ fontSize: "24px" }}>
          Time until next donation: {formatTime(timeLeft)}
        </p>
      </div>

      <div
        style={{ marginBottom: "20px", maxWidth: "800px", margin: "0 auto" }}
      >
        <div
          style={{
            backgroundColor: "#eee",
            borderRadius: "5px",
            overflow: "hidden",
          }}
        >
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
          <WeeklyForm email={email} goal={goal} donations={donations} />
        </div>
      )}
    </div>
  );
};

export default HeroSection;
