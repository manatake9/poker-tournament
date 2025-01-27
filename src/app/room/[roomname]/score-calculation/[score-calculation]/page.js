"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Separator } from "../../../components/ui/separator";
import { ScrollArea } from "../../../components/ui/scroll-area";
import { Button } from "../../../../components/ui/button";
import { Input } from "../../../../components/ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "../../../../components/ui/card";

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
