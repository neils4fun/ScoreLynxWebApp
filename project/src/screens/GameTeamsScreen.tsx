import { GameTeamListScreen } from './GameTeamListScreen';
import type { Game } from '../types/game';

interface GameTeamsScreenProps {
  game: Game;
  onBack: () => void;
}

export function GameTeamsScreen({ game, onBack }: GameTeamsScreenProps) {
  return (
    <GameTeamListScreen
      gameId={game.gameID}
      game={game}
      onBack={onBack}
    />
  );
} 