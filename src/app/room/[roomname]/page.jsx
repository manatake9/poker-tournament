"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";

const Card = ({ children, className }) => (
  <div className={`bg-white shadow-md rounded-lg p-4 ${className}`}>{children}</div>
);

const Button = ({ children, onClick, className }) => (
  <button
    onClick={onClick}
    className={`bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 ${className}`}
  >
    {children}
  </button>
);

const Input = ({ value, onChange, placeholder, className }) => (
  <input
    type="text"
    value={value}
    onChange={onChange}
    placeholder={placeholder}
    className={`border rounded px-3 py-2 focus:outline-none focus:ring focus:ring-blue-300 ${className}`}
  />
);

const RoomPage = ({ params }) => {
  const { roomName } = params;
  const [players, setPlayers] = useState([]);
  const [newPlayerName, setNewPlayerName] = useState("");
  const router = useRouter();

  const addPlayer = () => {
    if (newPlayerName.trim() !== "") {
      setPlayers([...players, { name: newPlayerName.trim(), score: 0 }]);
      setNewPlayerName("");
    }
  };

  const deletePlayer = (playerName) => {
    setPlayers(players.filter((player) => player.name !== playerName));
  };

  const navigateToScoreCalculation = () => {
    router.push(`/room/${roomName}/score-calculation`);
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center p-4">
      <h1 className="text-3xl font-bold mb-6">現在の得点</h1>

      <Button onClick={navigateToScoreCalculation} className="mb-4">
        得点計算へ
      </Button>

      <Card className="w-full max-w-md mb-6">
        <div>
          <h2 className="text-xl font-semibold mb-4">プレイヤー一覧</h2>

          <ul className="mb-4">
            {players.map((player, index) => (
              <li
                key={index}
                className="flex justify-between items-center bg-gray-200 p-2 mb-2 rounded-lg"
              >
                <span>
                  {player.name} - {player.score}点
                </span>
                <Button
                  className="bg-red-500 hover:bg-red-600"
                  onClick={() => deletePlayer(player.name)}
                >
                  削除
                </Button>
              </li>
            ))}
          </ul>

          <div className="flex items-center gap-2">
            <Input
              value={newPlayerName}
              onChange={(e) => setNewPlayerName(e.target.value)}
              placeholder="プレイヤー名を入力"
              className="flex-1"
            />
            <Button onClick={addPlayer}>追加</Button>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default RoomPage;
