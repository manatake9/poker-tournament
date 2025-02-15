import { supabase } from "./supabase";

export const getAllRooms = async () => {
  const rooms = await supabase.from("rooms").select("*");
  return rooms.data;
};

export const addRoom = async (room: string) => {
  await supabase.from("rooms").insert({ room_name: room });
};

export const deleteRoom = async (roomId) => {
  await supabase.from("rooms").delete().eq("room_id", roomId);
};

export const getAllPlayers = async (roomID: string) => {
  console.log("getAllPlayers の部屋ID:", roomID); // デバッグ
  if (!roomID) {
    console.error("エラー: getAllPlayers に渡された roomID が未定義です。");
    return [];
  }
  const players = await supabase
    .from("players") // Supabase の players テーブル
    .select("player_id, player_name, player_score")
    .eq("room_id", roomID); // room_id でフィルタリング;
  return players.data;
};

export const addPlayer = async (player: string, roomId: string) => {
  await supabase
    .from("players")
    .insert({ player_name: player, player_score: 0, room_id: roomId });
};

export const deletePlayer = async (playerId) => {
  await supabase.from("players").delete().eq("player_id", playerId);
};

export const updateScore = async (scoreData) => {
  await supabase.from("players").upsert(scoreData, { onConflict: "player_id" });
};
