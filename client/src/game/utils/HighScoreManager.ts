/**
 * Gestisce il salvataggio e recupero degli high score in localStorage
 */
export class HighScoreManager {
  private static readonly STORAGE_KEY = 'pixeldebh_highscores';
  private static readonly MAX_SCORES = 10;

  /**
   * Salva un nuovo punteggio
   */
  static saveScore(score: number, level: number, playerName: string = 'Player'): boolean {
    const scores = this.getHighScores();
    const newScore = {
      score,
      level,
      playerName,
      date: new Date().toISOString()
    };

    scores.push(newScore);
    scores.sort((a, b) => b.score - a.score);
    scores.splice(this.MAX_SCORES);

    try {
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(scores));
      return true;
    } catch (error) {
      console.error('Errore salvataggio high score:', error);
      return false;
    }
  }

  /**
   * Recupera tutti gli high score
   */
  static getHighScores(): Array<{
    score: number;
    level: number;
    playerName: string;
    date: string;
  }> {
    try {
      const data = localStorage.getItem(this.STORAGE_KEY);
      return data ? JSON.parse(data) : [];
    } catch (error) {
      console.error('Errore recupero high score:', error);
      return [];
    }
  }

  /**
   * Verifica se un punteggio è un nuovo record
   */
  static isHighScore(score: number): boolean {
    const scores = this.getHighScores();
    if (scores.length < this.MAX_SCORES) return true;
    return score > scores[scores.length - 1].score;
  }

  /**
   * Ottiene il punteggio più alto
   */
  static getTopScore(): number {
    const scores = this.getHighScores();
    return scores.length > 0 ? scores[0].score : 0;
  }

  /**
   * Cancella tutti gli high score
   */
  static clearHighScores(): void {
    try {
      localStorage.removeItem(this.STORAGE_KEY);
    } catch (error) {
      console.error('Errore cancellazione high score:', error);
    }
  }
}
