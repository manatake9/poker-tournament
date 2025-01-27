'use client'

import React, { useState } from 'react';
import RoomList from './RoomList';
import RoomInputForm from './RoomInputForm';

const RoomListPage = ({ allRooms }) => {
    const [rooms, setRooms] = useState(allRooms);
    const addRoom = (rooms) => {
        setRooms(rooms);
    };

  return (
    <div>
        <RoomList rooms={rooms} />
        <RoomInputForm onAddRoom={addRoom} />
    </div>
  )
}

export default RoomListPage