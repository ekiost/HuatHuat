import React, { useState } from 'react';
import './App.css';
import PlayerComponent from './components/PlayerComponent';
import { Player } from './type/types';

interface Round {
  id: number;
  changes: { playerId: number; winLoseAmount: number }[];
}

const App: React.FC = () => {
  const [players, setPlayers] = useState<Player[]>([]);
  const [playerName, setPlayerName] = useState('');
  const [bankerName, setBankerName] = useState('');
  const [rounds, setRounds] = useState<Round[]>([]);

  const addBanker = () => {
    if (bankerName.trim() !== '' && players.length === 0) {
      const newPlayer: Player = { id: 1, name: bankerName, chips: 0, winLoseAmount: 0, isBanker: true };
      setPlayers([newPlayer]);
      setBankerName('');
    }
  };

  const addPlayer = () => {
    if (playerName.trim() !== '') {
      const newPlayer: Player = { id: players.length + 1, name: playerName, chips: 0, winLoseAmount: 0, isBanker: false };
      setPlayers([...players, newPlayer]);
      setPlayerName('');
    }
  };

  const handleWinLoseChange = (id: number, winLoseAmount: number) => {
    setPlayers(players.map(player =>
      player.id === id ? { ...player, winLoseAmount: winLoseAmount } : player
    ));
  };

  const applyAdjustments = () => {
    let totalAdjustment = 0;
    const roundChanges: { playerId: number; winLoseAmount: number }[] = [];

    const updatedPlayers = players.map(player => {
      if (!player.isBanker) {
        totalAdjustment += player.winLoseAmount;
        roundChanges.push({ playerId: player.id, winLoseAmount: player.winLoseAmount });
        return { ...player, chips: player.chips + player.winLoseAmount, winLoseAmount: 0 };
      }
      return player;
    });

    // Adjust banker's chips
    const updatedPlayersWithBanker = updatedPlayers.map(player =>
      player.isBanker ? { ...player, chips: player.chips - totalAdjustment } : player
    );

    setPlayers(updatedPlayersWithBanker);
    setRounds([...rounds, { id: rounds.length + 1, changes: roundChanges }]);
  };

  const undoLastRound = () => {
    if (rounds.length === 0) return;

    const lastRound = rounds[rounds.length - 1];
    const updatedPlayers = players.map(player => {
      const change = lastRound.changes.find(change => change.playerId === player.id);
      if (change) {
        return { ...player, chips: player.chips - change.winLoseAmount };
      }
      return player;
    });

    // Adjust banker's chips accordingly
    const totalAdjustment = lastRound.changes.reduce((acc, change) => acc + change.winLoseAmount, 0);
    const updatedPlayersWithBanker = updatedPlayers.map(player =>
      player.isBanker ? { ...player, chips: player.chips + totalAdjustment } : player
    );

    setPlayers(updatedPlayersWithBanker);
    setRounds(rounds.slice(0, -1));
  };

  const resetGame = () => {
    const confirmReset = window.confirm("Are you sure you want to reset the game?");
    if (confirmReset) {
      setPlayers([]);
      setRounds([]);
      // Reset any other state variables as needed
      setPlayerName('');
      setBankerName('');
    }
  };



  return (
    <div className="App">
      <h1>Chip Tracker</h1>
      <div>
        <input
          type="text"
          value={bankerName}
          onChange={(e) => setBankerName(e.target.value)}
          placeholder="Banker Name"
          disabled={players.some(player => player.isBanker)}
        />
        <button onClick={addBanker} disabled={players.some(player => player.isBanker)}>Set Banker</button>
      </div>
      <div>
        <input
          type="text"
          value={playerName}
          onChange={(e) => setPlayerName(e.target.value)}
          placeholder="Player Name"
          disabled={!players.some(player => player.isBanker)}
        />
        <button onClick={addPlayer} disabled={!players.some(player => player.isBanker)}>Add Player</button>
      </div>
      <div className="players-container">
        {players.map(player => (
          <div className="player-item" key={player.id}>
            <PlayerComponent
              player={player}
              onWinLoseChange={handleWinLoseChange}
            />
          </div>
        ))}
      </div>
      <button onClick={applyAdjustments} disabled={players.length <= 1}>Apply Adjustments</button>
      <button onClick={undoLastRound} disabled={rounds.length === 0}>Undo Last Round</button>
      <button onClick={resetGame}>Reset Game</button>
      <div>
        <h2>Round History</h2>
        <table>
          <thead>
            <tr>
              <th>Round</th>
              <th>Player Changes</th>
            </tr>
          </thead>
          <tbody>
            {rounds.map((round) => (
              <tr key={round.id}>
                <td>{round.id}</td>
                <td>
                  {round.changes.map(change => (
                    <div key={change.playerId}>Player {change.playerId}: {change.winLoseAmount > 0 ? '+' : ''}{change.winLoseAmount} chips</div>
                  ))}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default App;
