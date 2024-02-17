import React, { useState } from 'react';
import './App.css';
import PlayerComponent from './components/PlayerComponent';
import { Player } from './type/types';

const App: React.FC = () => {
  const [players, setPlayers] = useState<Player[]>([]);
  const [playerName, setPlayerName] = useState('');
  const [bankerName, setBankerName] = useState('');


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
    const updatedPlayers = players.map(player => {
      if (!player.isBanker) {
        totalAdjustment += player.winLoseAmount;
        return { ...player, chips: player.chips + player.winLoseAmount, winLoseAmount: 0 };
      }
      return player;
    });

    // Adjust banker's chips based on totalAdjustment
    setPlayers(updatedPlayers.map(player =>
      player.isBanker ? { ...player, chips: player.chips - totalAdjustment } : player
    ));
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
      {players.map(player => (
        <PlayerComponent
          key={player.id}
          player={player}
          onWinLoseChange={handleWinLoseChange}
        />
      ))}
      <button onClick={applyAdjustments} disabled={players.length <= 1}>Apply Adjustments</button>
    </div>
  );
};

export default App;
