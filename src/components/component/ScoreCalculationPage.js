"use client";

import React from "react";
import PlayerManagement from "./PlayerManagement";
import ScoreCalculation from "./ScoreCalculation";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Button } from "../ui/button";

function ScoreCalculationPage({ roomName }) {
  const router = useRouter();
  const [players, setPlayers] = useState([]);

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center p-4">
      <h1 className="text-3xl font-bold mb-6">得点管理 </h1>
      <Button onClick={() => router.back()} className="mb-4">
        部屋選択へ戻る
      </Button>
      <ScoreCalculation players={players} setPlayers={setPlayers} />
      <PlayerManagement players={players} setPlayers={setPlayers} />
    </div>
  );
}

export default ScoreCalculationPage;
