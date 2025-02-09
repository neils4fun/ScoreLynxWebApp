import { useState } from 'react';
import { SelectGroupScreen } from './SelectGroupScreen';
import { GroupGamesScreen } from './GroupGamesScreen';
import { GamePlayersScreen } from './GamePlayersScreen';
import { GameTeamsScreen } from './GameTeamsScreen';
import { NewGameScreen } from './NewGameScreen';
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

  const handleGroupSelect = (group: GolfGroup) => {
    setSelectedGroup(group);
  };

  const handleGameSelect = (game: Game) => {
    setSelectedGame(game);
  };

  const handleBack = () => {
    clearGroup();
  };

  if (isCreatingGame) {
    return <NewGameScreen onBack={() => setIsCreatingGame(false)} />;
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
      />
    );
  }

  return <SelectGroupScreen onGroupSelect={handleGroupSelect} />;
}