"use client";

import React, { useEffect, useState } from "react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { addRoom, getAllRooms } from "../../lib/utils/supabaseFunctions";

const PokerScoreManager = () => {
  const [rooms, setRooms] = useState([]);
  const [newRoomName, setNewRoomName] = useState("");

  const getRooms = async () => {
    const rooms = await getAllRooms();
    setRooms(rooms);
    console.log(rooms);
  }

  useEffect(() => {
    getRooms();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (newRoomName === "") return;

    await addRoom(newRoomName);
    await getRooms();
    setNewRoomName("");
  }

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center p-4">
      <h1 className="text-3xl font-bold mb-6">ポーカー得点管理</h1>

      <ScrollArea className="h-72 w-60 rounded-md border bg-white mb-5">
        <div className="p-4">
          <h4 className="mb-4 text-sm font-medium leading-none">ルーム一覧</h4>
          {rooms.map((room) => (
            <div key={room.room_id} >
              <div className="text-sm">
                {room.room_name}
              </div>
              <Separator className="my-2" />
            </div>
          ))}
        </div>
      </ScrollArea>

      <div className="w-full max-w-md bg-white shadow-md rounded-lg p-4">
        <div>
          <h2 className="text-xl font-semibold mb-4">部屋の作成</h2>

          <form className="flex items-center gap-2" onSubmit={(e) => handleSubmit(e)}>
            <input
              value={newRoomName}
              onChange={(e) => setNewRoomName(e.target.value)}
              placeholder="部屋名を入力"
              className="border rounded px-3 py-2 focus:outline-none focus:ring focus:ring-blue-300 flex-1"
            />
            <button className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">追加</button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default PokerScoreManager;
