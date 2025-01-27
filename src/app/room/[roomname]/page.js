"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "../../../components/ui/button";
import { Input } from "../../../components/ui/input";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../../../components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../../../components/ui/dialog";

const RoomPage = ({ params }) => {
  const { roomName } = params;
  const [players, setPlayers] = useState([]);
  const [newPlayerName, setNewPlayerName] = useState("");
  const [scores, setScores] = useState({});
  const router = useRouter();

  const addPlayer = () => {
    if (newPlayerName.trim() !== "") {
      setPlayers([...players, { name: newPlayerName.trim(), score: 0 }]);
      setScores({ ...scores, [newPlayerName.trim()]: 0 });
      setNewPlayerName("");
    }
  };

  const deletePlayer = (playerName) => {
    setPlayers(players.filter((player) => player.name !== playerName));
    const updatedScores = { ...scores };
    delete updatedScores[playerName];
    setScores(updatedScores);
  };

  const updateScore = (playerName, score) => {
    const updatedPlayers = players.map((player) =>
      player.name === playerName ? { ...player, score: parseInt(score, 10) || 0 } : player
    );
    setPlayers(updatedPlayers);
    setScores({ ...scores, [playerName]: parseInt(score, 10) || 0 });
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center p-4">
      <h1 className="text-3xl font-bold mb-6">現在の得点</h1>

      <Button onClick={() => router.back()} className="mb-4">
        部屋選択へ戻る
      </Button>

      <Dialog>
        <DialogTrigger>
          <Button>得点計算へ</Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>得点計算入力フォーム</DialogTitle>
            <DialogDescription>
              以下の入力欄でプレイヤーの得点を設定してください。
            </DialogDescription>
          </DialogHeader>
          <div>
            {players.map((player, index) => (
              <div key={index} className="flex items-center justify-between mb-4">
                <span className="mr-4">{player.name}</span>
                <Input
                  type="number"
                  value={scores[player.name] || ""}
                  onChange={(e) => updateScore(player.name, e.target.value)}
                  placeholder="得点を入力"
                  className="w-32"
                />
              </div>
            ))}
          </div>
        </DialogContent>
      </Dialog>

      <Card>
        <div>
          <CardHeader>
            <CardTitle>プレイヤーの管理</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="mb-4">
              {players.map((player, index) => (
                <li
                  key={index}
                  className="flex justify-between items-center bg-gray-200 p-2 mb-2 rounded-lg"
                >
                  <span>
                    {player.name} - {player.score}点
                  </span>
                  <Button onClick={() => deletePlayer(player.name)}>削除</Button>
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
          </CardContent>
        </div>
      </Card>
    </div>
  );
};

export default RoomPage;
