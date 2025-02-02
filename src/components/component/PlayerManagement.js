'use client'

import React, { useState } from 'react'
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
  } from "../ui/card";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { addPlayer, deletePlayer, getAllPlayers } from '../../../lib/utils/supabaseFunctions';

const PlayerManagement = ({ players, setPlayers, roomId }) => {
    const [newPlayerName, setNewPlayerName] = useState("");

    const handleSubmit = async (e) => {
        e.preventDefault();
    
        if (newPlayerName.trim() === "") return;
        
        await addPlayer(newPlayerName, roomId);
        setNewPlayerName("");
        const newPlayers = await getAllPlayers(roomId);
        setPlayers(newPlayers);
    };

    const handleDelete = async (playerId) => {
        await deletePlayer(playerId);
        const newPlayers = await getAllPlayers(roomId);
        setPlayers(newPlayers);
    };

    return (
        <Card>
            <CardHeader>
                <CardTitle>プレイヤーの管理</CardTitle>
            </CardHeader>
            <CardContent>
                <ul className="mb-4">
                    {players.map((player, index) => (
                        <li
                        key={player?.player_id??index}
                        className="flex justify-between items-center bg-gray-200 p-2 mb-2 rounded-lg"
                        >
                            <span>
                                {player?.player_name??"no name"} - 現在の得点: {player?.player_score??"0"}点
                            </span>
                            <Button onClick={() => handleDelete(player?.player_id)}>削除</Button>
                        </li>
                    ))}
                </ul>

                <form className="flex items-center gap-2" onSubmit={(e) => handleSubmit(e)}>
                    <Input
                        value={newPlayerName}
                        onChange={(e) => setNewPlayerName(e.target.value)}
                        placeholder="プレイヤー名を入力"
                    />
                    <Button>追加</Button>
                </form>
            </CardContent>
        </Card>
    )
}

export default PlayerManagement