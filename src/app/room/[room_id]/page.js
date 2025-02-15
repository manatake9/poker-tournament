import ScoreCalculationPage from "../../../components/component/ScoreCalculationPage";
import { getAllPlayers } from "../../../../lib/utils/supabaseFunctions";

const RoomPage = async ({ params }) => {
  const { room_id } = await params;
  const allPlayers = await getAllPlayers(room_id);

  return <ScoreCalculationPage allPlayers={allPlayers} />;
};

export default RoomPage;
