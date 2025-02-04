'use client'

import { Dialog, DialogContent, DialogDescription, DialogTitle, DialogTrigger } from '../ui/dialog';
import React, { useState } from 'react'
import { Button } from '../ui/button';
import { DialogHeader } from '../ui/dialog';
import { ScrollArea } from '../ui/scroll-area';
import { Input } from "../ui/input";
import { AlertDialog, AlertDialogContent, AlertDialogDescription, AlertDialogTitle } from '../ui/alert-dialog';
import { AlertDialogHeader } from '../ui/alert-dialog';
import { getAllPlayers, updateScore } from '../../../lib/utils/supabaseFunctions';

const ScoreCalculartion = ({ players, setPlayers, roomId }) => {

    const [dialogOpen, setDialogOpen] = useState(false);
    const [selectedParticipants, setSelectedParticipants] = useState([]);
    const [initialScore, setInitialScore] = useState("");
    const [rankingData, setRankingData] = useState({});
    const [showWarning, setShowWarning] = useState(false);

    const toggleParticipant = (player) => {
        setSelectedParticipants((prev) =>
            prev.includes(player)
                ? prev.filter((p) => p !== player)
                : [...prev, player]
        );
        setRankingData((prev) => 
            Object.values(prev).includes(player.player_id)
                ? Object.fromEntries(Object.entries(prev).filter(([key]) => key !== player.player_id))
                : {...prev, [player.player_id]: {rank: "", score: ""}}
        );
    };

    const handleRankingDataChange = (playerId, field, value) => {
        setRankingData((prev) => ({
            ...prev,
            [playerId]: {
                ...prev[playerId],
                [field]: value,
            },
        }));
    };

    const resetInputStates = () => {
        setSelectedParticipants([]);
        setInitialScore("");
        setRankingData({});
    };

    const applyScoreUpdates = () => {
        const totalInputScore = Object.values(rankingData).reduce((sum, { score }) => sum + parseInt(score, 10), 0);
    
        const expectedTotalScore = selectedParticipants.length * parseInt(initialScore, 10);
    
        if (totalInputScore !== expectedTotalScore) {
            setShowWarning(true);
        } else if (selectedParticipants.length < 2) {

        } else {
          finalizeScoreUpdate();
        }
    };

    const finalizeScoreUpdate = async () => {
        const newDataList = [];
        selectedParticipants.map((player) =>{
            // x:参加費、n:参加人数、持ち点:p、順位:r として、得点 = {(p / 2) + (x * (n - r) / (n - 1)) - x} / 100
            const x = parseInt(initialScore, 10);
            const n = selectedParticipants.length;
            const p = rankingData[player.player_id].score;
            const r = parseInt(rankingData[player.player_id].rank, 10);
            const newScore = ((p / 2) + (x * (n - r) / (n - 1)) - x) / 100 + player.player_score;

            const data = {
                player_id: player.player_id,
                player_name: player.player_name,
                player_score: newScore,
                room_id: roomId
            }

            newDataList.push(data);
        });

        await updateScore(newDataList);
    
        resetInputStates();
        setDialogOpen(false);
        const newPlayers = await getAllPlayers(roomId);
        setPlayers(newPlayers);
    };

    return (
        <div>
            <Dialog open={dialogOpen} onOpenChange={(isDialogOpen) => {
                setDialogOpen(isDialogOpen);
                if (!isDialogOpen) resetInputStates();
            }}>
                <DialogTrigger asChild>
                    <Button className="mb-5">得点計算へ</Button>
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
                                    <div key={player?.player_id??index} className="flex items-center mb-2">
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

                        {/* 順位に対するプレイヤーと持ち点の入力 */}
                        <div className="mb-4">
                            <label className="block mb-2 font-semibold">順位入力:</label>
                            <ScrollArea className="h-64 border p-2">
                                {selectedParticipants.map((player) => (
                                    <div key={player.player_id} className="flex items-center mb-4">
                                        <span className="mr-4">{player.player_name}</span>
                                        <select
                                            value={rankingData[player.player_id].rank}
                                            onChange={(e) =>
                                                handleRankingDataChange(player.player_id, "rank", e.target.value)
                                            }
                                            className="mr-4 border p-1"
                                        >
                                            <option value="">選択してください</option>
                                            {Array.from({ length: selectedParticipants.length }).map((_, rank) => (
                                                <option key={rank} value={rank + 1}>
                                                    {rank + 1}位
                                                </option>
                                            ))}
                                        </select>
                                        <Input
                                            type="number"
                                            min="0"
                                            value={rankingData[player.player_id].score}
                                            onChange={(e) => {
                                                const value = e.target.value;
                                                handleRankingDataChange(player.player_id, "score", value)
                                            }}

                                            placeholder="得点"
                                            className="w-32"
                                        />
                                    </div>
                                ))}
                            </ScrollArea>
                        </div>

                        {/* 「結果へ」ボタン */}
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
        </div>
    )
}

export default ScoreCalculartion