"use client";

import React, { useState } from "react";
import ScoreCalculartion from "./ScoreCalculartion";
import PlayerManagement from "./PlayerManagement";

const ScoreCaluculationPage = ({ allPlayers, roomId }) => {
  const [players, setPlayers] = useState(allPlayers);

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center p-4">
      <ScoreCalculartion
        players={players}
        setPlayers={setPlayers}
        roomId={roomId}
      />
      <PlayerManagement
        players={players}
        setPlayers={setPlayers}
        roomId={roomId}
      />
    </div>
  );
};

export default ScoreCaluculationPage;
