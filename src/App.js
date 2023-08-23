import { useState, useRef } from "react";
import html2canvas from "html2canvas";
import "./App.css";
import draw from "./assets/pencil-icon.png"
import eraser from "./assets/eraser-icon.png"
import { ReactComponent as DarkMode } from "./assets/dark-mode.svg";
import { ReactComponent as LightMode } from "./assets/light-mode.svg";
import { ReactComponent as Reset } from "./assets/reset.svg";
import { ReactComponent as Save } from "./assets/save.svg";
import PencilCursorDark from "./assets/pencil-cursor-dark.svg";
import PencilCursorLight from "./assets/pencil-cursor-light.svg";
import EraserCursorDark from "./assets/eraser-cursor-dark.svg";
import EraserCursorLight from "./assets/eraser-cursor-light.svg";

function App() {
  const [tool, setTool] = useState("draw");
  const [isDrawing, setIsDrawing] = useState(false);
  const [dots, setDots] = useState([]);
  const [eraserSize, setEraserSize] = useState(10);
  const [darkMode, setDarkMode] = useState(false);
  const interactiveAreaRef = useRef(null);

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
    const x = event.clientX - 60;
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

    const x = event.clientX - 60;
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

  const saveScreenshot = async () => {
    if (interactiveAreaRef.current) {
      const interactiveArea = interactiveAreaRef.current;

      const canvas = await html2canvas(interactiveArea, { scale: 2 });
      const imgData = canvas.toDataURL("image/png");

      const link = document.createElement("a");
      link.href = imgData;
      link.download = "drawing.png";
      link.click();
    }
  };

  const handleDarkModeToggle = () => {
    setDarkMode(!darkMode);
  };

  const modeClass = darkMode ? "dark-mode" : "";
  const cursorStyle = darkMode ? 
                      (tool === "draw" ? "url(" + PencilCursorLight + ") 0 15, auto" : "url(" + EraserCursorLight + ") 5 8, auto") : 
                      (tool === "draw" ? "url(" + PencilCursorDark + ") 0 15, auto" : "url(" + EraserCursorDark + ") 5 8, auto");

  return (
    <div className={`App ${modeClass}`}>
      <div className="left-panel">
        <button        
          className={`tool-btn ${tool === "draw" ? "active" : ""}`}
        >
          <img src={draw} width={25} height={25} alt="draw" onClick={handleDraw} />
        </button>
        <button
          className={`tool-btn ${tool === "erase" ? "active" : ""}`}
        >
          <img src={eraser} width={25} height={25} alt="draw" onClick={handleErase} />
        </button>
        {tool === "erase" && (
          <input
            className="slider"
            type="range"
            min="8"
            max="50"
            value={eraserSize}
            onChange={adjustEraserSize}
          />
        )}
      </div>
      <Reset className="reset-button" onClick={resetDrawing} />
      <Save className="save-button" onClick={saveScreenshot} />
      {darkMode ?
        <LightMode className="mode-button" onClick={handleDarkModeToggle}/>
        :
        <DarkMode className="mode-button" onClick={handleDarkModeToggle}/>
      }
      <div
        ref={interactiveAreaRef}
        className="interactive-area"
        onTouchStart={startDrawing}
        onTouchEnd={stopDrawing}
        onTouchMove={(event) => {
          drawDot(event.touches[0]);
          eraseDots(event.touches[0]);
        }}
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