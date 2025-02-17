"use client";

import { usePathname, useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import PlayerManagement from "./PlayerManagement";
import ScoreCalculation from "./ScoreCalculation";
import { Button } from "../ui/button";

function ScoreCalculationPage({ allPlayers }) {
  const router = useRouter();
  const pathname = usePathname(); // Next.jsのURL取得用
  const [players, setPlayers] = useState(allPlayers || []);
  const [roomId, setRoomId] = useState(null);

  useEffect(() => {
    if (pathname) {
      const pathSegments = pathname.split("/");
      const id = pathSegments[pathSegments.length - 1]; // URLの最後の部分を取得
      console.log("取得した room_id:", id);
      setRoomId(id);
    }
  }, [pathname]);

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center p-4">
      <h1 className="text-3xl font-bold mb-6">得点管理</h1>
      <Button onClick={() => router.back()} className="mb-4">
        部屋選択へ戻る
      </Button>
      {roomId ? (
        <>
          <ScoreCalculation
            players={players}
            setPlayers={setPlayers}
            roomId={roomId}
          />
          <PlayerManagement
            players={players}
            setPlayers={setPlayers}
            roomId={roomId}
          />
        </>
      ) : (
        <p className="text-red-500">部屋IDが取得できていません</p>
      )}
    </div>
  );
}

export default ScoreCalculationPage;
