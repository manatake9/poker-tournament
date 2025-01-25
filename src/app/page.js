"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";

const Card = ({ children, className = "" }) => (
  <div className={`bg-white shadow-md rounded-lg p-4 ${className}`}>{children}</div>
);

const Button = ({ children, onClick, className = "" }) => (
  <button
    onClick={onClick}
    className={`bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 ${className}`}
  >
    {children}
  </button>
);

const Input = ({ value, onChange, placeholder, className = "" }) => (
  <input
    type="text"
    value={value}
    onChange={onChange}
    placeholder={placeholder}
    className={`border rounded px-3 py-2 focus:outline-none focus:ring focus:ring-blue-300 ${className}`}
  />
);

const PokerScoreManager = () => {
  const [rooms, setRooms] = useState([]);
  const [newRoomName, setNewRoomName] = useState("");
  const router = useRouter();

  const addRoom = () => {
    if (newRoomName.trim() !== "") {
      setRooms([...rooms, newRoomName.trim()]);
      setNewRoomName("");
    }
  };

  const deleteRoom = (roomName) => {
    setRooms(rooms.filter((room) => room !== roomName));
  };

  const navigateToRoom = (roomName) => {
    router.push(`/room/${roomName}`);
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center p-4">
      <h1 className="text-3xl font-bold mb-6">ポーカー得点管理</h1>

      <Card className="w-full max-w-md">
        <div>
          <h2 className="text-xl font-semibold mb-4">部屋の選択</h2>

          <ul className="mb-4">
            {rooms.map((room, index) => (
              <li
                key={index}
                className="flex justify-between items-center bg-gray-200 p-2 mb-2 rounded-lg cursor-pointer hover:bg-gray-300"
              >
                <span
                  className="text-blue-600 underline cursor-pointer"
                  onClick={() => navigateToRoom(room)}
                >
                  {room}
                </span>
                <Button
                  className="bg-red-500 hover:bg-red-600"
                  onClick={(e) => {
                    e.stopPropagation();
                    deleteRoom(room);
                  }}
                >
                  削除
                </Button>
              </li>
            ))}
          </ul>

          <div className="flex items-center gap-2">
            <Input
              value={newRoomName}
              onChange={(e) => setNewRoomName(e.target.value)}
              placeholder="部屋名を入力"
              className="flex-1"
            />
            <Button onClick={addRoom}>追加</Button>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default PokerScoreManager;
