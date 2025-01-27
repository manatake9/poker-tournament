'use client'

import React from 'react'
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
  } from "../ui/alert-dialog"
import { ScrollArea } from "../ui/scroll-area";
import { Separator } from "../ui/separator";
import { Button } from "../ui/button";
import Link from 'next/link';

const RoomList = ({ rooms }) => {
  return (
    <div>
      <ScrollArea className="h-72 w-60 rounded-md border bg-white mb-5">
        <div className="p-4">
          <h4 className="mb-4 text-sm font-medium leading-none">ルーム一覧</h4>
          {rooms.map((room) => (
            <div key={room.room_id}>
              <Link href="/room/${roomId}">
                <div className="text-sm cursor-pointer hover:bg-gray-200 p-2 rounded flex justify-between items-center">
                  <p>{room.room_name}</p>
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
              </Link>
            </div>
          ))}
          <Separator className="my-2" />
        </div>
      </ScrollArea>
    </div>
  )
}

export default RoomList