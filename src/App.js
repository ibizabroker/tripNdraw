import React, { useState } from "react";
import "./App.css";

function App() {
  const [tool, setTool] = useState("draw");
  const [isDrawing, setIsDrawing] = useState(false);
  const [dots, setDots] = useState([]);
  const [eraserSize, setEraserSize] = useState(10);

  const handleDraw = () => {
    setTool("draw");
  };

  const handleErase = () => {
    setTool("erase");
  };

  const adjustEraserSize = (event) => {
    setEraserSize(parseInt(event.target.value));
  };

  const drawDot = (event) => {
    if (!isDrawing) return;

    const color = tool === "erase" ? "#ffffff" : getRandomColor();
    const x = event.clientX - 80; // Adjust for left panel width
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

  const eraseDots = (event) => {
    if (!isDrawing || tool !== "erase") return;

    const x = event.clientX - 80; // Adjust for left panel width
    const y = event.clientY;

    setDots((prevDots) =>
      prevDots.filter(
        (dot) =>
          Math.sqrt((dot.x - x) ** 2 + (dot.y - y) ** 2) > eraserSize
      )
    );
  };

  const getRandomColor = () => {
    const letters = "0123456789ABCDEF";
    let color = "#";
    for (let i = 0; i < 6; i++) {
      color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
  };

  const cursorStyle = tool === "draw" ? "pointer" : "crosshair";

  return (
    <div className="App">
      <div className="left-panel">
        <button
          onClick={handleDraw}
          className={`tool-btn ${tool === "draw" ? "active" : ""}`}
        >
          🖋️
        </button>
        <button
          onClick={handleErase}
          className={`tool-btn ${tool === "erase" ? "active" : ""}`}
        >
          🧽
        </button>
        {tool === "erase" && (
          <input
            type="range"
            min="1"
            max="50"
            value={eraserSize}
            onChange={adjustEraserSize}
          />
        )}
      </div>
      <button className="reset-button" onClick={resetDrawing}>
        Reset
      </button>
      <div
        className="interactive-area"
        onMouseDown={startDrawing}
        onMouseUp={stopDrawing}
        onMouseMove={(event) => {
          drawDot(event);
          eraseDots(event);
        }}
        style={{ cursor: cursorStyle }}
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