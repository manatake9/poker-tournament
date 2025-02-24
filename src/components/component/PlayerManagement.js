"use client";

import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "../ui/alert-dialog";
import {
  addPlayer,
  deletePlayer,
  getAllPlayers,
} from "../../../lib/utils/supabaseFunctions";

const PlayerManagement = ({ players, setPlayers, roomId }) => {
  const [newPlayerName, setNewPlayerName] = useState("");
  const [num1, setNum1] = useState(0);
  const [num2, setNum2] = useState(0);
  const [answer, setAnswer] = useState("");
  const [isCorrect, setIsCorrect] = useState(false);

  const generateNewNumbers = () => {
    setNum1(Math.floor(Math.random() * 9) + 1);
    setNum2(Math.floor(Math.random() * 9) + 1);
    setAnswer("");
    setIsCorrect(false);
  };

  const checkAnswer = (value) => {
    setAnswer(value);
    setIsCorrect(parseInt(value) === num1 + num2);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (newPlayerName.trim() === "") return;

    console.log("追加するプレイヤー:", newPlayerName, "部屋ID:", roomId);

    if (!roomId) {
      console.error(
        "エラー: 部屋IDが未定義のため、プレイヤーを追加できません。"
      );
      return;
    }
    await addPlayer(newPlayerName, roomId);
    setNewPlayerName("");
    const updatedPlayers = await getAllPlayers(roomId);
    setPlayers(updatedPlayers || []);
  };

  const handleDelete = async (playerId) => {
    await deletePlayer(playerId);
    const updatedPlayers = await getAllPlayers(roomId);
    setPlayers(updatedPlayers || []);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>プレイヤーの管理</CardTitle>
      </CardHeader>
      <CardContent>
        <ul className="mb-4">
          {players
            .slice()
            .sort((a, b) => b.player_score - a.player_score)
            .map((player) => (
              <li
                key={player?.player_id}
                className="flex justify-between items-center bg-gray-200 p-2 mb-2 rounded-lg"
              >
                <span>
                  {player?.player_name ?? "no name"} - 現在の得点:{" "}
                  {player?.player_score?.toFixed(1) ?? "0"}点
                </span>
                <AlertDialog
                  onOpenChange={(open) => open && generateNewNumbers()}
                >
                  <AlertDialogTrigger asChild>
                    <Button>削除</Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>プレイヤー削除</AlertDialogTitle>
                      <AlertDialogDescription>
                        本当にこのプレイヤーを削除しますか？この操作は元に戻せません。
                      </AlertDialogDescription>
                      <p>
                        {num1} + {num2} = ?
                      </p>
                      <Input
                        type="number"
                        value={answer}
                        onChange={(e) => checkAnswer(e.target.value)}
                        placeholder="答えを入力"
                      />
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>キャンセル</AlertDialogCancel>
                      <AlertDialogAction
                        onClick={() => handleDelete(player?.player_id)}
                        disabled={!isCorrect}
                      >
                        削除する
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </li>
            ))}
        </ul>

        <form
          className="flex items-center gap-2"
          onSubmit={(e) => handleSubmit(e)}
        >
          <Input
            value={newPlayerName}
            onChange={(e) => setNewPlayerName(e.target.value)}
            placeholder="プレイヤー名を入力"
          />
          <Button type="submit">追加</Button>
        </form>
      </CardContent>
    </Card>
  );
};

export default PlayerManagement;
