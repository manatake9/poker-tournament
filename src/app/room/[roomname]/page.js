"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Separator } from "../../../components/ui/separator";
import { ScrollArea } from "../../../components/ui/scroll-area";
import { Button } from "../../../components/ui/button";
import { Input } from "../../../components/ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "../../../components/ui/card";

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

      <div style={{ display: 'flex', justifyContent: 'center', flexDirection: 'row' }}>
        <Button onClick={() => router.back()} className="mb-4">
          部屋選択へ戻る
        </Button>

        <Button onClick={navigateToScoreCalculation} className="mb-4">
          得点計算へ
        </Button>
      </div>

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
                <Button
                  onClick={() => deletePlayer(player.name)}
                >
                  削除
                </Button>
                </li>
              ))}
            </ul>

          {/* <Card>
                  <CardHeader>
                    <CardTitle>部屋の作成</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <form className="flex items-center gap-2" onSubmit={(e) => handleSubmit(e)}>
                      <Input
                        value={newRoomName}
                        onChange={(e) => setNewRoomName(e.target.value)}
                        placeholder="部屋名を入力"
                      />
                      <Button>追加</Button>
                    </form>
                  </CardContent>
                </Card> */}

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
