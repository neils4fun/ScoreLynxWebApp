import type { TeamScoresResponse } from '../types/team';

export async function fetchTeamScores(gameId: string, teamId: string): Promise<TeamScoresResponse> {
  const response = await fetch('http://www.scorelynxpro.com/slp/sggolfjson.php/getTeamScores', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      gameID: gameId,
      teamID: teamId,
      deviceID: 'web',
      appVersion: '1.0',
      source: 'web',
    }),
  });

  if (!response.ok) {
    throw new Error('Failed to fetch team scores');
  }

  const data = await response.json();
  return data;
} 