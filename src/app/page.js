import { getAllRooms } from "../../lib/utils/supabaseFunctions";
import RoomListPage from '../components/component/RoomListPage';

const PokerScoreManager = async () => {

  const allRooms = await getAllRooms();

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center p-4">
      <h1 className="text-3xl font-bold mb-6">ポーカー得点管理</h1>
      <RoomListPage allRooms={allRooms} />
    </div>
  );
};

export default PokerScoreManager;