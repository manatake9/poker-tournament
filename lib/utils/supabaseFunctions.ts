import { supabase } from "./supabase"

export const getAllRooms = async () => {
    const rooms = await supabase.from("rooms").select("*");
    return rooms.data;
};

export const addRoom = async (room) => {
    await supabase.from("rooms").insert({ room_name: room });
};

export const deleteRoom = async (roomId) => {
    await supabase.from("rooms").delete().eq("room_id", roomId);
};

export const getAllPlayers = async (roomId) => {
    const players = await supabase.from("players").select("player_id, player_name, player_score").eq("room_id", roomId);
    return players.data;
};

export const addPlayer = async (player, roomId) => {
    await supabase.from("players").insert({ player_name: player, player_score: 0, room_id: roomId});
};

export const deletePlayer = async (playerId) => {
    await supabase.from("players").delete().eq("player_id", playerId);
};

export const updateScore = async (scoreData) => {
    await supabase.from("players").upsert(scoreData, { onConflict: "player_id" });
};