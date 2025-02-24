"use client";

import React from "react";
import { useState } from "react";
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
} from "../ui/alert-dialog";
import { ScrollArea } from "../ui/scroll-area";
import { Separator } from "../ui/separator";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import Link from "next/link";
import { deleteRoom, getAllRooms } from "../../../lib/utils/supabaseFunctions";

const RoomList = ({ rooms, onAddRoom }) => {
  const handleDelete = async (roomId) => {
    await deleteRoom(roomId);
    const rooms = await getAllRooms();
    onAddRoom(rooms);
  };

  const [num1, setNum1] = useState(0);
  const [num2, setNum2] = useState(0);
  const [answer, setAnswer] = useState("");
  const [isCorrect, setIsCorrect] = useState(false);

  const generateNewNumbers = () => {
    setNum1(Math.floor(Math.random() * 9) + 1);
    setNum2(Math.floor(Math.random() * 9) + 1);
    setAnswer("");
    setIsCorrect(false);
  };

  const checkAnswer = (value) => {
    setAnswer(value);
    setIsCorrect(parseInt(value) === num1 + num2);
  };

  return (
    <div>
      <ScrollArea className="h-72 w-70 rounded-md border bg-white mb-5">
        <div className="p-4">
          <h4 className="mb-4 text-base font-medium leading-none">
            ルーム一覧
          </h4>
          {rooms.map((room) => (
            <div
              key={room.room_id}
              className="text-base p-2 rounded flex justify-between items-center"
            >
              <Link
                href={`/room/${room.room_id}`}
                className="block w-full max-w-sm p-4 bg-white rounded-lg hover:bg-gray-200 transition-all"
              >
                {room.room_name}
              </Link>

              <AlertDialog
                onOpenChange={(open) => open && generateNewNumbers()}
              >
                <AlertDialogTrigger asChild>
                  <Button>削除</Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>ルーム削除</AlertDialogTitle>
                    <AlertDialogDescription>
                      本当にこのルームを削除しますか？この操作は元に戻せません。
                    </AlertDialogDescription>
                    <p>
                      {num1} + {num2} = ?
                    </p>
                    <Input
                      type="number"
                      value={answer}
                      onChange={(e) => checkAnswer(e.target.value)}
                      placeholder="答えを入力"
                    />
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>キャンセル</AlertDialogCancel>
                    <AlertDialogAction
                      onClick={() => handleDelete(room?.room_id)}
                      disabled={!isCorrect}
                    >
                      削除する
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </div>
          ))}
          <Separator className="my-2" />
        </div>
      </ScrollArea>
    </div>
  );
};

export default RoomList;
