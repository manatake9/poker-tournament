"use client";

import React, { useState } from "react";
import RoomList from "./RoomList";
import RoomInputForm from "./RoomInputForm";

const RoomListPage = ({ allRooms }) => {
  const [rooms, setRooms] = useState(allRooms);

  return (
    <div>
      <RoomList rooms={rooms} setRooms={setRooms} />
      <RoomInputForm setRooms={setRooms} />
    </div>
  );
};

export default RoomListPage;
