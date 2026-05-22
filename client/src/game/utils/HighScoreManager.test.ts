import { describe, it, expect, beforeEach, vi, afterEach } from "vitest";
import { HighScoreManager } from "./HighScoreManager";

const STORAGE_KEY = "pixeldebh_highscores";

describe("HighScoreManager", () => {
  beforeEach(() => {
    localStorage.clear();
    vi.restoreAllMocks();
  });

  afterEach(() => {
    localStorage.clear();
  });

  describe("save + retrieve roundtrip", () => {
    it("salva e recupera un singolo punteggio", () => {
      expect(HighScoreManager.saveScore(100, 1, "Alice")).toBe(true);

      const scores = HighScoreManager.getHighScores();
      expect(scores).toHaveLength(1);
      expect(scores[0]).toMatchObject({ score: 100, level: 1, playerName: "Alice" });
      expect(typeof scores[0].date).toBe("string");
    });

    it("ordina gli score in modo decrescente", () => {
      HighScoreManager.saveScore(50, 1, "A");
      HighScoreManager.saveScore(300, 2, "B");
      HighScoreManager.saveScore(150, 1, "C");

      const scores = HighScoreManager.getHighScores();
      expect(scores.map((s) => s.score)).toEqual([300, 150, 50]);
    });

    it("usa il default 'Player' se non si passa playerName", () => {
      HighScoreManager.saveScore(42, 1);
      expect(HighScoreManager.getHighScores()[0].playerName).toBe("Player");
    });
  });

  describe("limite MAX_SCORES (10)", () => {
    it("tronca a 10 le voci anche dopo molti inserimenti", () => {
      for (let i = 0; i < 25; i++) {
        HighScoreManager.saveScore(i * 10, 1, `P${i}`);
      }
      const scores = HighScoreManager.getHighScores();
      expect(scores).toHaveLength(10);
      expect(scores[0].score).toBe(240); // il più alto
      expect(scores[9].score).toBe(150); // 10° più alto
    });
  });

  describe("isHighScore", () => {
    it("è true finché la lista non è piena", () => {
      expect(HighScoreManager.isHighScore(1)).toBe(true);
      HighScoreManager.saveScore(100, 1, "x");
      expect(HighScoreManager.isHighScore(1)).toBe(true);
    });

    it("è true solo se batte l'ultimo quando piena", () => {
      for (let i = 0; i < 10; i++) HighScoreManager.saveScore((i + 1) * 10, 1, "x");
      // ultima entry = 10
      expect(HighScoreManager.isHighScore(5)).toBe(false);
      expect(HighScoreManager.isHighScore(10)).toBe(false);
      expect(HighScoreManager.isHighScore(11)).toBe(true);
    });
  });

  describe("getTopScore", () => {
    it("ritorna 0 con storage vuoto", () => {
      expect(HighScoreManager.getTopScore()).toBe(0);
    });

    it("ritorna lo score più alto", () => {
      HighScoreManager.saveScore(50, 1, "A");
      HighScoreManager.saveScore(900, 1, "B");
      HighScoreManager.saveScore(120, 1, "C");
      expect(HighScoreManager.getTopScore()).toBe(900);
    });
  });

  describe("validazione Zod e recovery", () => {
    it("ignora e azzera storage se il JSON è sintatticamente invalido", () => {
      localStorage.setItem(STORAGE_KEY, "{not json");
      const warnSpy = vi.spyOn(console, "warn").mockImplementation(() => {});

      expect(HighScoreManager.getHighScores()).toEqual([]);
      expect(localStorage.getItem(STORAGE_KEY)).toBeNull();
      expect(warnSpy).toHaveBeenCalled();
    });

    it("ignora e azzera storage se lo schema non valida", () => {
      localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify([{ score: "tanto", level: 1, playerName: "x", date: "2026" }])
      );
      vi.spyOn(console, "warn").mockImplementation(() => {});

      expect(HighScoreManager.getHighScores()).toEqual([]);
      expect(localStorage.getItem(STORAGE_KEY)).toBeNull();
    });

    it("scarta voci con campi out-of-range", () => {
      localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify([
          { score: -50, level: 1, playerName: "x", date: "2026-01-01" },
        ])
      );
      vi.spyOn(console, "warn").mockImplementation(() => {});

      expect(HighScoreManager.getHighScores()).toEqual([]);
    });
  });

  describe("clearHighScores", () => {
    it("rimuove tutto", () => {
      HighScoreManager.saveScore(100, 1, "x");
      HighScoreManager.clearHighScores();
      expect(HighScoreManager.getHighScores()).toEqual([]);
    });
  });

  describe("saveScore — fallimenti di scrittura", () => {
    it("ritorna false se setItem solleva QuotaExceededError", () => {
      const quotaErr = new DOMException("quota", "QuotaExceededError");
      const setItemSpy = vi
        .spyOn(Storage.prototype, "setItem")
        .mockImplementation(() => {
          throw quotaErr;
        });
      const errSpy = vi.spyOn(console, "error").mockImplementation(() => {});

      expect(HighScoreManager.saveScore(100, 1, "x")).toBe(false);
      expect(setItemSpy).toHaveBeenCalled();
      expect(errSpy).toHaveBeenCalled();
    });
  });
});
