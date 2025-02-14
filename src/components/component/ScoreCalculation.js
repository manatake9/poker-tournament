"use client";

import React from "react";
import { useState } from "react";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog";
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogHeader,
  AlertDialogTitle,
} from "../ui/alert-dialog";
import { ScrollArea } from "../ui/scroll-area";

const ScoreCalculation = ({ players, setPlayers }) => {
  const [selectedParticipants, setSelectedParticipants] = useState([]);
  const [initialScore, setInitialScore] = useState("");
  const [rankingData, setRankingData] = useState({});
  const [dialogOpen, setDialogOpen] = useState(false);
  const [showWarning, setShowWarning] = useState(false);
  const [applyBonus, setApplyBonus] = useState(false);
  const [incorrectScores, setIncorrectScores] = useState([]);

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
        [field]:
          field === "score" ? Math.max(parseInt(value, 10) || 0, 0) : value,
      },
    }));
  };

  const applyScoreUpdates = () => {
    const totalInputScore = Object.values(rankingData).reduce(
      (sum, { score }) => sum + score,
      0
    );
    const expectedTotalScore =
      selectedParticipants.length * parseInt(initialScore, 10);

    console.log("### applyScoreUpdates ###");
    console.log("選択されたプレイヤー:", selectedParticipants);
    console.log("初期持ち点:", initialScore);
    console.log("入力された合計点数:", totalInputScore);
    console.log("期待される合計点数:", expectedTotalScore);

    if (totalInputScore !== expectedTotalScore) {
      console.log("得点に誤差があります。誤った得点情報を表示します。");

      setIncorrectScores(
        players
          .map((player) => {
            const playerData = Object.values(rankingData).find(
              (data) => data.player === player.name
            );
            if (playerData) {
              let playerScore =
                player.score +
                (playerData.score - parseInt(initialScore, 10)) / 100;

              console.log(`${player.name} の得点計算前:`, playerScore);

              // 順位ボーナスを適用する場合
              if (applyBonus) {
                const sortedRanking = Object.values(rankingData).map(
                  (data) => data.player
                );

                const playerRank = sortedRanking.indexOf(player.name); // プレイヤーの順位を取得
                const totalParticipants = sortedRanking.length;

                // 順位ボーナス計算式を適用
                // 順位ボーナス = 初期持ち点 / 200 - (プレイヤーの順位 * 初期持ち点) / (100 * (参加者数 - 1))
                const bonus =
                  parseInt(initialScore, 10) / 200 -
                  (playerRank * parseInt(initialScore, 10)) /
                    (100 * (totalParticipants - 1));

                console.log(
                  `順位ボーナス計算: プレイヤー${player.name} の順位: ${playerRank}`
                );
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
          })
          .filter((scoreData) => scoreData !== null)
      );
      setShowWarning(true);
    } else if (selectedParticipants.length < 2) {
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
          const sortedRanking = Object.values(rankingData).map(
            (data) => data.player
          ); // 順位のリストを作成

          const playerRank = sortedRanking.indexOf(player.name); // プレイヤーの順位を取得
          const totalParticipants = sortedRanking.length;

          // 順位ボーナス計算式を適用
          const bonus =
            parseInt(initialScore, 10) / 200 -
            (playerRank * parseInt(initialScore, 10)) /
              (100 * (totalParticipants - 1));

          console.log(
            `順位ボーナス計算: プレイヤー${player.name} の順位: ${playerRank}`
          );
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
    setIncorrectScores([]); // 得点情報をリセット
  };

  return (
    <div>
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogTrigger asChild>
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
                      {/* 順位入力 */}
                      <select
                        value={rankingData[rank + 1]?.player || ""}
                        onChange={(e) =>
                          handleRankingDataChange(
                            rank + 1,
                            "player",
                            e.target.value
                          )
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
                      {/* 得点入力 */}
                      <Input
                        type="number"
                        value={rankingData[rank + 1]?.score ?? ""}
                        onChange={(e) => {
                          const value = e.target.value;
                          handleRankingDataChange(
                            rank + 1,
                            "score",
                            value && /^\d+$/.test(value)
                              ? parseInt(value, 10)
                              : ""
                          );
                        }}
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

      {/* ゼロサムでない,参加者が一人,の場合の処理 */}
      <AlertDialog open={showWarning} onOpenChange={setShowWarning}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>得点の誤差があります</AlertDialogTitle>
          </AlertDialogHeader>
          <AlertDialogDescription>
            {(() => {
              const expectedTotalScore =
                initialScore * Object.values(rankingData).length;
              const actualTotalScore = Object.values(rankingData).reduce(
                (sum, data) => sum + data.score,
                0
              );
              const totalDifference = actualTotalScore - expectedTotalScore;
              const participantCount = Object.values(rankingData).length;

              if (participantCount  < 2) {
                return (
                  <span>
                    エラー: 参加者が一人だけでは得点計算ができません。
                  </span>
                );
              }

              if (totalDifference !== 0) {
                return (
                  <>
                    <span>初期持ち点の総和：{expectedTotalScore}点</span>
                    <br />
                    <span>現在の総得点：{actualTotalScore}点</span>
                    <br />
                    <span>総得点の誤差：{totalDifference}点</span>
                  </>
                );
              }
            })()}
          </AlertDialogDescription>
          <div className="flex justify-end gap-2 mt-4">
            <Button onClick={() => setShowWarning(false)}>キャンセル</Button>
          </div>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default ScoreCalculation;
