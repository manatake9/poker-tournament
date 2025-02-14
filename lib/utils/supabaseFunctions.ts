import { supabase } from "./supabase"

export const getAllRooms = async () => {
    const rooms = await supabase.from("rooms").select("*");
    return rooms.data;
};

export const addRoom = async (room : string) => {
    await supabase.from("rooms").insert({ room_name: room });
};

export const deleteRoom = async (roomId) => {
    await supabase.from("rooms").delete().eq("room_id", roomId);
};