export interface GolfGroup {
  groupID: string;
  groupName: string;
  password?: string;
}

export interface Game {
  gameID: string;
  groupID: string;
  name: string;
  courseID: string;
  courseName: string;
  teamPlayerType: 'Player' | 'Team' | 'Matchplay';
  date: string;
  status: string;
  gameKey: string;
  gameType: string;
  skinType: string;
  teeName: string;
  teeID: string;
  round: string;
  showNotifications: string;
  showPaceOfPlay: string;
  showLeaderBoard: string;
  showSkins: string;
  showPayouts: string;
  showJunks: string;
  useGroupHandicaps: string;
  strokeOffLow: string;
  percentHandicap: string;
  multiCourseGame: string;
  addRakeToPayouts: string;
  breakTiesOnPayouts: string;
  gameAnte: string;
  skinsAnte: string;
  dollarsPerJunk: string;
  venmoName: string | null;
  gameInstructions: string | null;
  numberMatchplayPlayers: string;
  teamCount: string;
  mirrorGameName: string | null;
  mirrorGameID: string | null;
}