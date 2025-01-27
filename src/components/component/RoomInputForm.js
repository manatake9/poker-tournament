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
import { addRoom, getAllRooms } from '../../../lib/utils/supabaseFunctions';

const RoomInputForm = ({ onAddRoom }) => {
    const [newRoomName, setNewRoomName] = useState("");

    const handleSubmit = async (e) => {
        e.preventDefault();
    
        if (newRoomName.trim() === "") return;
        
        setNewRoomName("");
        await addRoom(newRoomName);
        const rooms = await getAllRooms();
        onAddRoom(rooms);
    };

  return (
    <div>
        <Card>
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
        </Card>
    </div>
  )
}

export default RoomInputForm