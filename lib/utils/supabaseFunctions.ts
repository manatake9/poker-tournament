import { supabase } from "./supabase"

export const getAllRooms = async () => {
    const rooms = await supabase.from("rooms").select("*");
    return rooms.data;
};

export const addRoom = async (room : string) => {
    console.log(room);
    await supabase.from("rooms").insert({ room_name: room });
};