import React from "react";
import { Button } from "../../../components/ui/button";
import ScoreCalculartionPage from "../../../components/component/ScoreCaluculationPage";
import { getAllPlayers } from "../../../../lib/utils/supabaseFunctions";
import Link from 'next/link';
// form使うんでselectをshadcn仕様にする


const RoomPage = async ({ params }) => {
  const { roomid } = await params;
  const allPlayers = await getAllPlayers(roomid);

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center p-4">
      <h1 className="text-3xl font-bold mb-6">現在の得点</h1>

      <Link href="/"> 
        <Button className="mb-4">
          部屋選択へ戻る
        </Button>
      </Link>

      <ScoreCalculartionPage allPlayers={allPlayers} roomId={roomid} />
    </div>
  );
};

export default RoomPage;
