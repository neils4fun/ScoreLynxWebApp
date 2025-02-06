import { useState } from 'react';
import { EditPlayerScreen } from './EditPlayerScreen';
import { GameTeamListScreen } from './GameTeamListScreen';
import type { Game } from '../types/game';
import type { Player } from '../types/player';

interface GameTeamsScreenProps {
  game: Game;
  onBack: () => void;
}

export function GameTeamsScreen({ game, onBack }: GameTeamsScreenProps) {
  const [selectedPlayer, setSelectedPlayer] = useState<Player | null>(null);

  const handleEditPlayer = (player: Player) => {
    setSelectedPlayer(player);
  };

  if (selectedPlayer) {
    return (
      <EditPlayerScreen
        player={selectedPlayer}
        game={game}
        groupId={game.groupID}
        onBack={() => setSelectedPlayer(null)}
        onSave={() => {
          setSelectedPlayer(null);
        }}
      />
    );
  }

  return (
    <GameTeamListScreen
      gameId={game.gameID}
      onBack={onBack}
      onEditPlayer={handleEditPlayer}
    />
  );
} 