import React from "react";
import { Route, Routes } from "react-router-dom";
import Game from "./components/Game";
import CreateNewGame from "./components/CreateNewGame";
import HomePage from "./components/HomePage";
import Navbar from "./components/Navbar";
const App = () => {
  return (
    <div>
      <Navbar />

      <Routes>
        <Route exact path="/" element={<HomePage />} />
        <Route exact path="/new_game" element={<CreateNewGame />} />
        <Route exact path="/game/:game_id" element={<Game />} />
      </Routes>
    </div>
  );
};

export default App;
