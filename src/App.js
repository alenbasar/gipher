import React, { useState, useEffect } from "react";
import VideoToGif from "./components/VideoToGif";
import Header from "./components/Header";
const App = () => {
  return (
    <div className="App">
      <Header />
      <VideoToGif />
    </div>
  );
};

export default App;
