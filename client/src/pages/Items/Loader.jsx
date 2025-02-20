import React from "react";

const Loader = ({ fullScreen = false, size = 50, textOn = false, textLabel = "Loading...", spinner = false, color="purple" }) => {
  if (fullScreen) {
    return (
      <div className="fullscreen-loader-container">
        <div className="fullscreen-blur-background"></div>
        {spinner && <div className="spinner" style={{ width: size, height: size, borderTopColor: color }}></div>}
        {textOn && spinner && <p className="loader_text" style={{color: color}}>{textLabel}</p>}
        {
        !spinner && <div className="loading-text">
          <span className="dot" style={{backgroundColor: color, marginRight: 2, width: size, height: size}}></span>
          <span className="dot" style={{backgroundColor: color, marginRight: 2, width: size, height: size}}></span>
          <span className="dot" style={{backgroundColor: color, marginRight: 2, width: size, height: size}}></span>
        </div>
      }
      </div>
    );
  }

  return (
    <div className="simple-loader">
      {spinner && <div className="spinner" style={{ width: size, height: size, borderTopColor: color }}></div>}
      {textOn && spinner && <p className="loader_text" style={{color: color}}>{textLabel}</p>}
      {
        !spinner && <div className="loading-text">
          <span className="dot" style={{backgroundColor: color, marginRight: 2, width: size, height: size}}></span>
          <span className="dot" style={{backgroundColor: color, marginRight: 2, width: size, height: size}}></span>
          <span className="dot" style={{backgroundColor: color, marginRight: 2, width: size, height: size}}></span>
        </div>
      }
    </div>
  );
};

export default Loader;
