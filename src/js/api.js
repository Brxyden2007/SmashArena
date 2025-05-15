const API_URL = 'http://localhost:3000/brawlers';

export async function getBrawlers() {
  try {
    const response = await fetch(API_URL);
    if (!response.ok) throw new Error('Error al obtener los brawlers');
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('API ERROR:', error);
    this.shadowInnerHTML.API_URL = ""
    return [];
  }
}