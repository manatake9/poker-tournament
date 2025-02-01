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
  const [applyBonus, setApplyBonus] = useState(false);
  const [incorrectScores, setIncorrectScores] = useState([]);  // 誤った得点情報を保持
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

  const applyScoreUpdates = () => {
    const totalInputScore = Object.values(rankingData)
      .reduce((sum, { score }) => sum + score, 0);
    const expectedTotalScore = selectedParticipants.length * parseInt(initialScore, 10);
  
    console.log("### applyScoreUpdates ###");
    console.log("選択されたプレイヤー:", selectedParticipants);
    console.log("初期持ち点:", initialScore);
    console.log("入力された合計点数:", totalInputScore);
    console.log("期待される合計点数:", expectedTotalScore);
  
    if (totalInputScore !== expectedTotalScore) {
      console.log("得点に誤差があります。誤った得点情報を表示します。");
  
      setIncorrectScores(
        players.map((player) => {
          const playerData = Object.values(rankingData).find(
            (data) => data.player === player.name
          );
          if (playerData) {
            let playerScore =
              player.score + (playerData.score - parseInt(initialScore, 10)) / 100;
  
            console.log(`${player.name} の得点計算前:`, playerScore);
  
            // 順位ボーナスを適用する場合
            if (applyBonus) {
              // 順位は入力順に合わせて計算
              const sortedRanking = Object.values(rankingData)
                .map((data) => data.player); // 順位のリストを作成
  
              const playerRank = sortedRanking.indexOf(player.name); // プレイヤーの順位を取得
              const totalParticipants = sortedRanking.length;
  
              // 順位ボーナス計算式を適用
              const bonus = parseInt(initialScore, 10) / 200 - (playerRank * parseInt(initialScore, 10)) / (100 * (totalParticipants - 1));
  
              console.log(`順位ボーナス計算: プレイヤー${player.name} の順位: ${playerRank}`);
              console.log(`順位ボーナス: ${bonus}`);
              playerScore += bonus;
            }
  
            console.log(`${player.name} の最終得点:`, playerScore);
  
            return {
              name: player.name,
              score: playerScore,
              expectedScore: parseInt(initialScore, 10),
              bonus: applyBonus,
            };
          }
          return null;
        }).filter((scoreData) => scoreData !== null)
      );
      setShowWarning(true);
    } else {
      console.log("得点に誤差はありません。得点更新を確定します。");
      finalizeScoreUpdate();
    }
  };
  
  const finalizeScoreUpdate = () => {
    console.log("### finalizeScoreUpdate ###");
  
    const updatedPlayers = players.map((player) => {
      const playerData = Object.values(rankingData).find(
        (data) => data.player === player.name
      );
      if (playerData) {
        let newScore =
          player.score + (playerData.score - parseInt(initialScore, 10)) / 100;
  
        console.log(`${player.name} の得点計算前:`, newScore);
  
        // 順位ボーナスを適用する場合
        if (applyBonus) {
          // 順位は入力順に合わせて計算
          const sortedRanking = Object.values(rankingData)
            .map((data) => data.player); // 順位のリストを作成
  
          const playerRank = sortedRanking.indexOf(player.name); // プレイヤーの順位を取得
          const totalParticipants = sortedRanking.length;
  
          // 順位ボーナス計算式を適用
          const bonus = parseInt(initialScore, 10) / 200 - (playerRank * parseInt(initialScore, 10)) / (100 * (totalParticipants - 1));
  
          console.log(`順位ボーナス計算: プレイヤー${player.name} の順位: ${playerRank}`);
          console.log(`順位ボーナス: ${bonus}`);
          newScore += bonus;
        }
  
        console.log(`${player.name} の最終得点:`, newScore);
  
        return { ...player, score: newScore };
      }
      return player;
    });
  
    setPlayers(updatedPlayers);
    resetInputStates();
    setDialogOpen(false);
  };
  
  

  const resetInputStates = () => {
    setSelectedParticipants([]);
    setInitialScore("");
    setRankingData({});
    setApplyBonus(false);
    setIncorrectScores([]); // 誤った得点情報をリセット
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
            {/* 参加者選択 */}
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

            {/* 初期点の入力 */}
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

            {/* 順位ボーナス適用チェックボックス */}
            <div className="mb-4">
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={applyBonus}
                  onChange={() => setApplyBonus(!applyBonus)}
                  className="mr-2"
                />
                順位ボーナスを適用する
              </label>
            </div>

            {/* 順位に対するプレイヤーと持ち点の入力 */}
            <div className="mb-4">
              <label className="block mb-2 font-semibold">順位入力:</label>
              <ScrollArea className="h-64 border p-2">
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
                      />
                    </div>
                  )
                )}
              </ScrollArea>
            </div>

            {/* 得点確認ボタン */}
            <Button onClick={applyScoreUpdates} className="w-full">
              結果へ
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      <AlertDialog open={showWarning} onOpenChange={setShowWarning}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>得点の誤差があります</AlertDialogTitle>
          </AlertDialogHeader>
          <AlertDialogDescription>
            <div>
              {incorrectScores.map((scoreData, index) => (
                <div key={index}>
                  <p>{`${scoreData.name}, 持ち点${scoreData.score}点`}</p>
                  <p>計算結果：{scoreData.score.toFixed(2)}点</p>
                </div>
              ))}
            </div>
            <div className="flex justify-end gap-2 mt-4">
              <Button onClick={() => setShowWarning(false)}>キャンセル</Button>
              <Button onClick={finalizeScoreUpdate}>OK</Button>
            </div>
          </AlertDialogDescription>
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
                    {player.name} - 現在の得点: {player.score.toFixed(2)}点
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
