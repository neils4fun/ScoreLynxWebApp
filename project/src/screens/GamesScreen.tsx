import { useState } from 'react';
import { SelectGroupScreen } from './SelectGroupScreen';
import { GroupGamesScreen } from './GroupGamesScreen';
import { GamePlayersScreen } from './GamePlayersScreen';
import { GameTeamsScreen } from './GameTeamsScreen';
import { GameFormScreen } from './GameFormScreen';
import { useGroup } from '../context/GroupContext';
import type { GolfGroup, Game } from '../types/game';

export default function GamesScreen() {
  const { 
    selectedGroup, 
    setSelectedGroup,
    selectedGame,
    setSelectedGame,
    clearGroup
  } = useGroup();
  const [isCreatingGame, setIsCreatingGame] = useState(false);
  const [editingGame, setEditingGame] = useState<Game | null>(null);

  const handleGroupSelect = (group: GolfGroup) => {
    setSelectedGroup(group);
  };

  const handleGameSelect = (game: Game) => {
    setSelectedGame(game);
  };

  const handleBack = () => {
    clearGroup();
  };

  if (editingGame) {
    return (
      <GameFormScreen
        game={editingGame}
        onBack={() => setEditingGame(null)}
      />
    );
  }

  if (isCreatingGame) {
    return <GameFormScreen onBack={() => setIsCreatingGame(false)} />;
  }

  if (selectedGame) {
    if (selectedGame.teamPlayerType === 'Team' || selectedGame.teamPlayerType === 'Matchplay') {
      return (
        <GameTeamsScreen
          game={selectedGame}
          onBack={() => setSelectedGame(null)}
        />
      );
    }
    return (
      <GamePlayersScreen
        game={selectedGame}
        onBack={() => setSelectedGame(null)}
      />
    );
  }

  if (selectedGroup) {
    return (
      <GroupGamesScreen
        group={selectedGroup}
        onBack={handleBack}
        onGameSelect={handleGameSelect}
        onCreateGame={() => setIsCreatingGame(true)}
        onEditGame={(game) => setEditingGame(game)}
      />
    );
  }

  return <SelectGroupScreen onGroupSelect={handleGroupSelect} />;
}