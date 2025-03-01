import { useState } from "react";
import reactLogo from "./assets/react.svg";
import viteLogo from "/vite.svg";
import "./App.css";
import WeeklyForm from "./components/weeklyform/WeeklyForm";

function App() {
  const [count, setCount] = useState(0);

  return (
    <>
      <div>
        <h1>Plasma Pals | Work in Progress</h1>
        <WeeklyForm />
      </div>
    </>
  );
}

export default App;
