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
} from "../../../components/ui/alert-dialog";
import { ScrollArea } from "../../../components/ui/scroll-area";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../../components/ui/select"
// form使うんでselectをshadcn仕様にする

const RoomPage = ({ params }) => {
  const { roomName } = params;
  const [players, setPlayers] = useState([]);
  const [newPlayerName, setNewPlayerName] = useState("");
  const [selectedParticipants, setSelectedParticipants] = useState([]);
  const [initialScore, setInitialScore] = useState("");
  const [rankingData, setRankingData] = useState({});
  const [dialogOpen, setDialogOpen] = useState(false);
  const [showWarning, setShowWarning] = useState(false);
  const [knockoutEnabled, setKnockoutEnabled] = useState(true);
  const [knockoutSelections, setKnockoutSelections] = useState({});
  const [knockoutSelectionVisible, setKnockoutSelectionVisible] = useState({});
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

  const toggleParticipant = (playerName) => {
    setSelectedParticipants((prev) =>
      prev.includes(playerName)
        ? prev.filter((name) => name !== playerName)
        : [...prev, playerName]
    );
  };

  const handleRankingDataChange = (rank, field, value) => {
    setRankingData((prev) => ({
      ...prev,
      [rank]: {
        ...prev[rank],
        [field]: field === "score" ? Math.max(parseInt(value, 10) || 0, 0) : value,
      },
    }));
  };

  const handleKnockoutSelection = (rank, knockedOutPlayer) => {
    setKnockoutSelections((prev) => ({
      ...prev,
      [rank]: prev[rank]?.includes(knockedOutPlayer)
        ? prev[rank].filter((name) => name !== knockedOutPlayer)
        : [...(prev[rank] || []), knockedOutPlayer],
    }));
  };

  const applyScoreUpdates = () => {
    const totalInputScore = Object.values(rankingData)
      .reduce((sum, { score }) => sum + score, 0);

    const expectedTotalScore = selectedParticipants.length * parseInt(initialScore, 10);

    if (totalInputScore !== expectedTotalScore) {
      setShowWarning(true);
    } else {
      finalizeScoreUpdate();
    }
  };

  const finalizeScoreUpdate = () => {
    const debugInfo = [];
  
    const updatedPlayers = players.map((player) => {
      const playerData = Object.values(rankingData).find(
        (data) => data.player === player.name
      );
  
      if (playerData) {
        let newScore =
          player.score + (playerData.score - parseInt(initialScore, 10)) / 100;
        debugInfo.push(`Player ${player.name} initial score adjustment: ${newScore}`);
        console.log(playerData.score);

        // ノックアウト処理
        if (knockoutEnabled) {
          let knockoutBonus = 0;
          let knockoutPenalty = 0;
  
          Object.entries(knockoutSelections).forEach(([rank, knockedOutPlayers]) => {
            if (playerData.player === rankingData[rank]?.player) {
              // ノックアウト成功ボーナス
              knockoutBonus += knockedOutPlayers.length * 10;
            }
            if (knockedOutPlayers.includes(player.name)) {
              // ノックアウトされたペナルティ
              knockoutPenalty -= 10;
            }
          });
  
          newScore += knockoutBonus + knockoutPenalty;
          debugInfo.push(`Player ${player.name} knockout adjustment: bonus=${knockoutBonus}, penalty=${knockoutPenalty}, newScore=${newScore}`);
        }
  
        debugInfo.push(`Final score for Player ${player.name}: ${newScore}`);
        return { ...player, score: newScore };
      }
      return player;
    });
    setPlayers(updatedPlayers);
    resetInputStates();
    setDialogOpen(false);
  
    // デバッグ情報をコンソール出力
    debugInfo.forEach(info => console.log(info));
  };
  
  

  const resetInputStates = () => {
    setSelectedParticipants([]);
    setInitialScore("");
    setRankingData({});
    setKnockoutSelections({});
  };

  const toggleKnockoutSelectionVisibility = (rank) => {
    setKnockoutSelectionVisible((prev) => ({
      ...prev,
      [rank]: !prev[rank],
    }));
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center p-4">
      <h1 className="text-3xl font-bold mb-6">現在の得点</h1>

      <Button onClick={() => router.back()} className="mb-4">
        部屋選択へ戻る
      </Button>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogTrigger>
          <Button>得点計算へ</Button>
        </DialogTrigger>
        <DialogContent className="max-h-[90%] overflow-hidden">
          <DialogHeader>
            <DialogTitle>得点計算入力フォーム</DialogTitle>
            <DialogDescription>
              以下の入力欄でプレイヤー情報を設定してください。
            </DialogDescription>
          </DialogHeader>

          <div className="flex flex-col space-y-4 overflow-y-scroll">
            <div className="mb-4">
              <label className="block mb-2 font-semibold">参加者を選択:</label>
              <ScrollArea className="h-32 border p-2">
                {players.map((player, index) => (
                  <div key={index} className="flex items-center mb-2">
                    <input
                      type="checkbox"
                      checked={selectedParticipants.includes(player.name)}
                      onChange={() => toggleParticipant(player.name)}
                      className="mr-2"
                    />
                    <span>{player.name}</span>
                  </div>
                ))}
              </ScrollArea>
            </div>

            <div className="mb-4">
              <label className="block mb-2 font-semibold">初期持ち点:</label>
              <Input
                type="number"
                value={initialScore}
                onChange={(e) => {
                  const value = e.target.value;
                  setInitialScore(value && /^\d+$/.test(value) ? value : "");
                }}
                placeholder="初期持ち点を入力"
                className="w-full"
              />
            </div>

            <div className="flex items-center mb-4">
              <input
                type="checkbox"
                checked={knockoutEnabled}
                onChange={(e) => setKnockoutEnabled(e.target.checked)}
                className="mr-2"
              />
              <label>ノックアウトボーナスを有効にする</label>
            </div>

            <div className="mb-4">
              <label className="block mb-2 font-semibold">順位入力:</label>
              <ScrollArea className="h-64 border p-2 overflow-x-auto">
                {Array.from({ length: selectedParticipants.length }).map(
                  (_, rank) => (
                    <div key={rank} className="flex items-center mb-4">
                      <span className="mr-4">{rank + 1}位:</span>
                      <select
                        value={rankingData[rank + 1]?.player || ""}
                        onChange={(e) =>
                          handleRankingDataChange(rank + 1, "player", e.target.value)
                        }
                        className="mr-4 border p-1"
                      >
                        <option value="">選択してください</option>
                        {selectedParticipants.map((participant) => (
                          <option key={participant} value={participant}>
                            {participant}
                          </option>
                        ))}
                      </select>
                      <Input
                        type="number"
                        value={rankingData[rank + 1]?.score || ""}
                        onChange={(e) =>
                          handleRankingDataChange(rank + 1, "score", e.target.value)
                        }
                        placeholder="得点"
                        className="w-32"

// ここで０を入力するとundefinedになっておかしくなる

                      />
                      {knockoutEnabled && (
                        <div className="ml-4">
                          <Button
                            onClick={() => toggleKnockoutSelectionVisibility(rank)}
                            className="mb-2"
                          >
                            ノックアウト選択
                          </Button>
                          {knockoutSelectionVisible[rank] && (
                            <div>
                              <label className="block text-sm mt-2">ノックアウト:</label>
                              <ScrollArea className="h-16 border p-1">
                                {selectedParticipants.map((participant) => (
                                  participant !== rankingData[rank + 1]?.player && (
                                    <div key={participant} className="flex items-center mb-1">
                                      <input
                                        type="checkbox"
                                        checked={knockoutSelections[rank]?.includes(participant) || false}
                                        onChange={() => handleKnockoutSelection(rank, participant)}
                                        className="mr-1"
                                      />
                                      <span>{participant}</span>
                                    </div>
                                  )
                                ))}
                              </ScrollArea>
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  )
                )}
              </ScrollArea>
            </div>
            <Button onClick={applyScoreUpdates} className="w-full">
              結果へ
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      <AlertDialog open={showWarning} onOpenChange={setShowWarning}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>警告</AlertDialogTitle>
            <AlertDialogDescription>
              点数入力の総和が初期点の総和と等しくないですがよろしいですか？
            </AlertDialogDescription>
          </AlertDialogHeader>
          <div className="flex justify-end gap-2">
            <Button onClick={() => setShowWarning(false)}>キャンセル</Button>
            <Button onClick={finalizeScoreUpdate}>OK</Button>
          </div>
        </AlertDialogContent>
      </AlertDialog>

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
                    {player.name} - 現在の得点: {player.score.toFixed(1)}点
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
