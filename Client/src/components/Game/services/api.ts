const BASE_URL = 'http://localhost:3000/games';

export async function addGameStateToDB(gameId: string, state: any) {
  const response = await fetch(`${BASE_URL}/${gameId}/state`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ currentState: state }),
  });
  if (!response.ok) throw new Error(`Error: ${response.statusText}`);
  return response.json();
}

export async function getGameStateFromDB(gameId: string) {
  const response = await fetch(`${BASE_URL}/${gameId}/state`);
  return response.json();
}

export async function getGameStateHistoryFromDB(gameId: string) {
  const response = await fetch(`${BASE_URL}/${gameId}/statehistory`);
  return response.json();
}

export async function initializeGame(currentState: any) {
  const response = await fetch(BASE_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ currentState }),
  });
  if (!response.ok) throw new Error(`Error: ${response.statusText}`);
  return response.json();
}

export async function deleteGame(gameId: string) {
  const response = await fetch(`${BASE_URL}/${gameId}`, {
    method: 'DELETE',
  });
  if (!response.ok) {
    console.error('Failed to delete game data:', response.statusText);
  }
}
