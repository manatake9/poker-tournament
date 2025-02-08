"use client";

import React from "react";
import { useState } from "react";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../ui/card";

const PlayerManagement = ({ players, setPlayers }) => {

  const [newPlayerName, setNewPlayerName] = useState("");

  const addPlayer = () => {
    if (newPlayerName.trim() !== "") {
      setPlayers([...players, { name: newPlayerName.trim(), score: 0 }]);
      setNewPlayerName("");
    }
  };

  const deletePlayer = (playerName) => {
    setPlayers(players.filter((player) => player.name !== playerName));
  };

  return (
      <Card>
        <div>
          <CardHeader>
            <CardTitle>プレイヤーの管理</CardTitle>
          </CardHeader>
          <CardContent>
            {/* 現在の得点表示 */}
            <ul className="mb-4">
              {players
                .slice()
                .sort((a, b) => b.score - a.score)
                .map((player, index) => (
                  <li
                    key={index}
                    className="flex justify-between items-center bg-gray-200 p-2 mb-2 rounded-lg"
                  >
                    <span>
                      {player.name} - 現在の得点: {player.score.toFixed(2)}点
                    </span>
                    <Button onClick={() => deletePlayer(player.name)}>
                      削除
                    </Button>
                  </li>
                ))}
            </ul>
            {/* プレイヤーの追加フォーム */}
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
  );
};

export default PlayerManagement;
