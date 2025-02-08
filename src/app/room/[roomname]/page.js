import ScoreCalculationPage from "../../../components/component/ScoreCalculationPage";


const RoomPage = ({ params }) => {
  const { roomName } = params;

  return (
    <ScoreCalculationPage roomName={roomName} />
  );
};

export default RoomPage;
