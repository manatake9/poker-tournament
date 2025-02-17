"use client";

import React, { useState } from "react";
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
import {
  updateScore,
  getAllPlayers,
} from "../../../lib/utils/supabaseFunctions";

const ScoreCalculation = ({ players, setPlayers, roomId }) => {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedParticipants, setSelectedParticipants] = useState([]);
  const [initialScore, setInitialScore] = useState("");
  const [rankingData, setRankingData] = useState({});
  const [showWarning, setShowWarning] = useState(false);
  const [applyBonus, setApplyBonus] = useState(false);

  const toggleParticipant = (player) => {
    setSelectedParticipants((prev) =>
      prev.includes(player)
        ? prev.filter((p) => p !== player)
        : [...prev, player]
    );
    setRankingData((prev) =>
      prev[player.player_id]
        ? Object.fromEntries(
            Object.entries(prev).filter(([key]) => key !== player.player_id)
          )
        : { ...prev, [player.player_id]: { rank: "", score: 0 } }
    );
  };

  const handleRankingDataChange = (playerId, field, value) => {
    setRankingData((prev) => ({
      ...prev,
      [playerId]: {
        ...prev[playerId],
        [field]: field === "score" ? parseInt(value, 10) || 0 : value,
      },
    }));
  };

  const resetInputStates = () => {
    setSelectedParticipants([]);
    setInitialScore("");
    setRankingData({});
  };

  const applyScoreUpdates = async () => {
    const totalInputScore = Object.values(rankingData).reduce(
      (sum, { score }) => sum + parseInt(score, 10),
      0
    );
    const expectedTotalScore =
      selectedParticipants.length * parseInt(initialScore, 10);

    if (totalInputScore !== expectedTotalScore) {
      // 総得点が初期持ち点の総和と一致しない場合はエラー表示
      setShowWarning(true);
    } else if (selectedParticipants.length < 2) {
      // 参加者一人ならエラー表示
      setShowWarning(true);
    } else {
      finalizeScoreUpdate();
    }
  };

  const finalizeScoreUpdate = async () => {
    const newDataList = selectedParticipants.map((player) => {
      const x = parseInt(initialScore, 10);
      const n = selectedParticipants.length;
      const p = parseInt(rankingData[player.player_id]?.score, 10) || 0; // デフォルト 0
      const r = parseInt(rankingData[player.player_id]?.rank, 10) || n; // 順位未入力なら最下位扱い
      const bonus = applyBonus ? x / 200 - ((r - 1) * x) / (100 * (n - 1)) : 0;
      // 初期持ち点 / 200 - (プレイヤーの順位 * 初期持ち点) / (100 * (参加者数 - 1))
      const newScore = bonus + (p - x) / 100;

      // 各プレイヤーのスコア計算をログに出力
      console.log(`Player ID: ${player.player_id}`);
      console.log(`Original Score: ${p}`);
      console.log(`Bonus: ${bonus}`);
      console.log(`New Score: ${newScore}`);

      return {
        player_id: player.player_id,
        player_name: player.player_name,
        player_score: newScore,
        room_id: roomId,
      };
    });

    await updateScore(newDataList);
    resetInputStates();
    setDialogOpen(false);
    const newPlayers = await getAllPlayers(roomId);

    // 更新後のプレイヤーデータをログに出力
    console.log("Updated Players List:", newPlayers);

    setPlayers(newPlayers);
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
            <div className="mb-4">
              <label className="block mb-2 font-semibold">参加者を選択:</label>
              <ScrollArea className="h-32 border p-2">
                {players?.map((player) => (
                  <div key={player.player_id}>
                    <input
                      type="checkbox"
                      checked={selectedParticipants.includes(player)}
                      onChange={() => toggleParticipant(player)}
                      className="mr-2"
                    />
                    <span>{player.player_name}</span>
                  </div>
                ))}
              </ScrollArea>
            </div>
            <div>
              <label className="block mb-2 font-semibold">初期持ち点:</label>
              <Input
                type="number"
                value={initialScore}
                onChange={(e) => setInitialScore(e.target.value)}
                placeholder="初期持ち点を入力"
                className="w-full"
              />
            </div>
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
            <div>
              <ScrollArea className="p-4 border rounded-lg max-h-80 overflow-y-auto">
                {selectedParticipants.map((player) => (
                  <div
                    key={player.player_id}
                    className="flex items-center justify-between p-3 border-b last:border-b-0"
                  >
                    {/* プレイヤー名 */}
                    <span className="w-1/3 font-medium">
                      {player.player_name}
                    </span>

                    {/* 順位選択 */}
                    <select
                      value={rankingData[player.player_id]?.rank || ""}
                      onChange={(e) =>
                        handleRankingDataChange(
                          player.player_id,
                          "rank",
                          e.target.value
                        )
                      }
                      className="w-1/3 p-2 border rounded-lg"
                    >
                      <option value="">選択</option>
                      {Array.from({ length: selectedParticipants.length }).map(
                        (_, index) => (
                          <option key={index} value={index + 1}>
                            {index + 1}位
                          </option>
                        )
                      )}
                    </select>

                    {/* スコア入力 */}
                    <Input
                      type="number"
                      value={rankingData[player.player_id]?.score}
                      onChange={(e) =>
                        handleRankingDataChange(
                          player.player_id,
                          "score",
                          e.target.value
                        )
                      }
                      className="w-1/3 p-2 border rounded-lg text-right"
                    />
                  </div>
                ))}
              </ScrollArea>
            </div>
            <Button onClick={applyScoreUpdates}>結果へ</Button>
          </div>
        </DialogContent>
      </Dialog>
      <AlertDialog open={showWarning} onOpenChange={setShowWarning}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>得点の誤差があります</AlertDialogTitle>
          </AlertDialogHeader>
          <AlertDialogDescription>
            {(() => {
              const expectedTotalScore =
                selectedParticipants.length * parseInt(initialScore, 10);
              const actualTotalScore = selectedParticipants.reduce(
                (sum, player) =>
                  sum +
                  (parseInt(rankingData[player.player_id]?.score, 10) || 0),
                0
              );
              const totalDifference = actualTotalScore - expectedTotalScore;

              if (selectedParticipants.length < 2) {
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
