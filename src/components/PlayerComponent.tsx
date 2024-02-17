import { Player } from '../type/types';

interface Props {
  player: Player;
  onWinLoseChange: (id: number, winLoseAmount: number) => void;
}

const PlayerComponent: React.FC<Props> = ({ player, onWinLoseChange }) => {
  return (
    <div>
      <p>{player.name}: {player.chips} chips {player.isBanker ? '(Banker)' : ''}</p>
      {!player.isBanker && (
        <input
          type="number"
          value={player.winLoseAmount}
          onChange={(e) => onWinLoseChange(player.id, parseInt(e.target.value))}
          placeholder="Win/Lose Amount"
        />
      )}
    </div>
  );
};

export default PlayerComponent;
