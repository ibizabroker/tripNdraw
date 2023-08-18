import React, { useState } from "react";
import "./App.css";

function App() {
  const [isDrawing, setIsDrawing] = useState(false);
  const [dots, setDots] = useState([]);

  const drawDot = (event) => {
    if (!isDrawing) return;

    const color = getRandomColor();
    const x = event.clientX;
    const y = event.clientY;

    const newDot = {
      color,
      x,
      y,
    };

    setDots((prevDots) => [...prevDots, newDot]);
  };

  const startDrawing = () => {
    setIsDrawing(true);
  };

  const stopDrawing = () => {
    setIsDrawing(false);
  };

  const resetDrawing = () => {
    setDots([]);
  };

  const getRandomColor = () => {
    const letters = "0123456789ABCDEF";
    let color = "#";
    for (let i = 0; i < 6; i++) {
      color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
  };

  return (
    <div className="App">
      <button className="reset-button" onClick={resetDrawing}>Reset</button>
      <div
        className="interactive-area"
        onMouseDown={startDrawing}
        onMouseUp={stopDrawing}
        onMouseMove={drawDot}
      >
        {dots.map((dot, index) => (
          <div
            key={index}
            className="colored-dot"
            style={{
              backgroundColor: dot.color,
              left: dot.x + "px",
              top: dot.y + "px",
            }}
          ></div>
        ))}
      </div>
    </div>
  );
}

export default App;