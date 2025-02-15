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
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button>削除</Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>プレイヤー削除</AlertDialogTitle>
                      <AlertDialogDescription>
                        本当にこのプレイヤーを削除しますか？この操作は元に戻せません。
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>キャンセル</AlertDialogCancel>
                      <AlertDialogAction
                        onClick={() => handleDelete(player?.player_id)}
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
