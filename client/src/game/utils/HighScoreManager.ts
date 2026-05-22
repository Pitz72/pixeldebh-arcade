import { z } from 'zod';

/**
 * Gestisce il salvataggio e recupero degli high score in localStorage.
 * I dati letti sono validati con Zod: se lo storage è corrotto o manomesso
 * viene azzerato in modo controllato invece di propagare oggetti invalidi al gioco.
 */

const HighScoreSchema = z.object({
  score: z.number().int().min(0).max(9_999_999),
  level: z.number().int().min(1).max(99),
  playerName: z.string().min(1).max(32),
  date: z.string(),
});

const HighScoreListSchema = z.array(HighScoreSchema);

export type HighScore = z.infer<typeof HighScoreSchema>;

export class HighScoreManager {
  private static readonly STORAGE_KEY = 'pixeldebh_highscores';
  private static readonly MAX_SCORES = 10;

  /**
   * Salva un nuovo punteggio. Ritorna `false` se la scrittura fallisce
   * (es. quota localStorage esaurita o storage disabilitato).
   */
  static saveScore(score: number, level: number, playerName: string = 'Player'): boolean {
    const scores = this.getHighScores();
    const newScore: HighScore = {
      score,
      level,
      playerName,
      date: new Date().toISOString(),
    };

    scores.push(newScore);
    scores.sort((a, b) => b.score - a.score);
    scores.splice(this.MAX_SCORES);

    try {
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(scores));
      return true;
    } catch (error) {
      if (error instanceof DOMException && (error.name === 'QuotaExceededError' || error.code === 22)) {
        console.error('[HighScoreManager] localStorage quota esaurita, score non salvato.');
      } else {
        console.error('[HighScoreManager] Errore salvataggio high score:', error);
      }
      return false;
    }
  }

  /**
   * Recupera tutti gli high score. Se i dati sono corrotti o di forma inattesa
   * lo storage viene azzerato e si ritorna lista vuota.
   */
  static getHighScores(): HighScore[] {
    let raw: string | null = null;
    try {
      raw = localStorage.getItem(this.STORAGE_KEY);
    } catch (error) {
      console.error('[HighScoreManager] localStorage non disponibile:', error);
      return [];
    }

    if (!raw) return [];

    try {
      const parsed = JSON.parse(raw);
      const result = HighScoreListSchema.safeParse(parsed);
      if (!result.success) {
        console.warn('[HighScoreManager] dati corrotti, reset highscores.', result.error.issues);
        this.clearHighScores();
        return [];
      }
      return result.data;
    } catch (error) {
      console.warn('[HighScoreManager] JSON corrotto, reset highscores.', error);
      this.clearHighScores();
      return [];
    }
  }

  /**
   * Verifica se un punteggio è un nuovo record (entra nella top MAX_SCORES).
   */
  static isHighScore(score: number): boolean {
    const scores = this.getHighScores();
    if (scores.length < this.MAX_SCORES) return true;
    return score > scores[scores.length - 1].score;
  }

  /**
   * Ottiene il punteggio più alto registrato.
   */
  static getTopScore(): number {
    const scores = this.getHighScores();
    return scores.length > 0 ? scores[0].score : 0;
  }

  /**
   * Cancella tutti gli high score.
   */
  static clearHighScores(): void {
    try {
      localStorage.removeItem(this.STORAGE_KEY);
    } catch (error) {
      console.error('[HighScoreManager] Errore cancellazione high score:', error);
    }
  }
}
