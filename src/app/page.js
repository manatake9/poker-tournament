"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { addRoom, getAllRooms, deleteRoom } from "../../lib/utils/supabaseFunctions";
import { ScrollArea } from "../components/ui/scroll-area";
import { Separator } from "../components/ui/separator";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "../components/ui/card";
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
} from "../components/ui/alert-dialog"
import { useForm } from "react-hook-form";
// formをいつかshadcnに直す

const PokerScoreManager = () => {
  const [rooms, setRooms] = useState([]);
  const [newRoomName, setNewRoomName] = useState("");
  const [roomToDelete, setRoomToDelete] = useState(null);
  const router = useRouter();

  const getRooms = async () => {
    const rooms = await getAllRooms();
    setRooms(rooms);
    console.log(rooms);
  };

  useEffect(() => {
    getRooms();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (newRoomName === "") return;

    await addRoom(newRoomName);
    await getRooms();
    setNewRoomName("");
  };

  // const handleDelete = async (roomId) => {
  //   await deleteRoom(roomId);
  //   await getRooms();
  // };

  const navigateToRoom = (roomId) => {
    router.push(`/room/${roomId}`);
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center p-4">
      <h1 className="text-3xl font-bold mb-6">ポーカー得点管理</h1>

      <ScrollArea className="h-72 w-60 rounded-md border bg-white mb-5">
        <div className="p-4">
          <h4 className="mb-4 text-sm font-medium leading-none">ルーム一覧</h4>
          {rooms.map((room) => (
            <div
              key={room.room_id}
              className="text-sm cursor-pointer hover:bg-gray-200 p-2 rounded flex justify-between items-center"
            >
              <span onClick={() => navigateToRoom(room.room_id)}>{room.room_name}</span>
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button>削除</Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>ルーム削除</AlertDialogTitle>
                    <AlertDialogDescription>
                      本当にこのルームを削除しますか？この操作は元に戻せません。
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>キャンセル</AlertDialogCancel>
                    <AlertDialogAction onClick={() => handleDelete(room.room_id)}>
                      削除する
                      {/* 削除関数の作成お願いします */}
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </div>
          ))}
          <Separator className="my-2" />
        </div>
      </ScrollArea>

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
  );
};

export default PokerScoreManager;
