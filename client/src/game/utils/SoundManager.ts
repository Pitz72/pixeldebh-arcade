/**
 * Gestore degli effetti sonori procedurali usando Web Audio API
 */
export class SoundManager {
  private audioContext: AudioContext | null = null;

  constructor() {
    try {
      this.audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
    } catch (e) {
      console.warn('Web Audio API non supportata');
    }
  }

  /**
   * Suono di raccolta oggetto (beep crescente)
   */
  playCollect(): void {
    if (!this.audioContext) return;

    const oscillator = this.audioContext.createOscillator();
    const gainNode = this.audioContext.createGain();

    oscillator.connect(gainNode);
    gainNode.connect(this.audioContext.destination);

    oscillator.frequency.setValueAtTime(400, this.audioContext.currentTime);
    oscillator.frequency.exponentialRampToValueAtTime(800, this.audioContext.currentTime + 0.1);

    gainNode.gain.setValueAtTime(0.3, this.audioContext.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, this.audioContext.currentTime + 0.1);

    oscillator.start(this.audioContext.currentTime);
    oscillator.stop(this.audioContext.currentTime + 0.1);
  }

  /**
   * Suono power-up attivato (melodia ascendente)
   */
  playPowerUp(): void {
    if (!this.audioContext) return;

    const notes = [440, 554, 659, 880]; // A4, C#5, E5, A5
    const duration = 0.08;

    notes.forEach((freq, index) => {
      const oscillator = this.audioContext!.createOscillator();
      const gainNode = this.audioContext!.createGain();

      oscillator.connect(gainNode);
      gainNode.connect(this.audioContext!.destination);

      oscillator.frequency.value = freq;
      oscillator.type = 'square';

      const startTime = this.audioContext!.currentTime + (index * duration);
      gainNode.gain.setValueAtTime(0.2, startTime);
      gainNode.gain.exponentialRampToValueAtTime(0.01, startTime + duration);

      oscillator.start(startTime);
      oscillator.stop(startTime + duration);
    });
  }

  /**
   * Suono di morte/danno (discesa drammatica)
   */
  playHit(): void {
    if (!this.audioContext) return;

    const oscillator = this.audioContext.createOscillator();
    const gainNode = this.audioContext.createGain();

    oscillator.connect(gainNode);
    gainNode.connect(this.audioContext.destination);

    oscillator.frequency.setValueAtTime(400, this.audioContext.currentTime);
    oscillator.frequency.exponentialRampToValueAtTime(50, this.audioContext.currentTime + 0.3);
    oscillator.type = 'sawtooth';

    gainNode.gain.setValueAtTime(0.3, this.audioContext.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, this.audioContext.currentTime + 0.3);

    oscillator.start(this.audioContext.currentTime);
    oscillator.stop(this.audioContext.currentTime + 0.3);
  }

  /**
   * Suono completamento livello (fanfara)
   */
  playLevelComplete(): void {
    if (!this.audioContext) return;

    const melody = [
      { freq: 523, time: 0 },      // C5
      { freq: 659, time: 0.15 },   // E5
      { freq: 784, time: 0.3 },    // G5
      { freq: 1047, time: 0.45 }   // C6
    ];

    melody.forEach(({ freq, time }) => {
      const oscillator = this.audioContext!.createOscillator();
      const gainNode = this.audioContext!.createGain();

      oscillator.connect(gainNode);
      gainNode.connect(this.audioContext!.destination);

      oscillator.frequency.value = freq;
      oscillator.type = 'triangle';

      const startTime = this.audioContext!.currentTime + time;
      gainNode.gain.setValueAtTime(0.25, startTime);
      gainNode.gain.exponentialRampToValueAtTime(0.01, startTime + 0.4);

      oscillator.start(startTime);
      oscillator.stop(startTime + 0.4);
    });
  }

  /**
   * Suono game over (discesa triste)
   */
  playGameOver(): void {
    if (!this.audioContext) return;

    const melody = [
      { freq: 392, time: 0 },      // G4
      { freq: 349, time: 0.2 },    // F4
      { freq: 330, time: 0.4 },    // E4
      { freq: 262, time: 0.6 }     // C4
    ];

    melody.forEach(({ freq, time }) => {
      const oscillator = this.audioContext!.createOscillator();
      const gainNode = this.audioContext!.createGain();

      oscillator.connect(gainNode);
      gainNode.connect(this.audioContext!.destination);

      oscillator.frequency.value = freq;
      oscillator.type = 'sine';

      const startTime = this.audioContext!.currentTime + time;
      gainNode.gain.setValueAtTime(0.2, startTime);
      gainNode.gain.exponentialRampToValueAtTime(0.01, startTime + 0.5);

      oscillator.start(startTime);
      oscillator.stop(startTime + 0.5);
    });
  }

  /**
   * Suono menu/selezione (click)
   */
  playMenuClick(): void {
    if (!this.audioContext) return;

    const oscillator = this.audioContext.createOscillator();
    const gainNode = this.audioContext.createGain();

    oscillator.connect(gainNode);
    gainNode.connect(this.audioContext.destination);

    oscillator.frequency.value = 800;
    oscillator.type = 'square';

    gainNode.gain.setValueAtTime(0.1, this.audioContext.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, this.audioContext.currentTime + 0.05);

    oscillator.start(this.audioContext.currentTime);
    oscillator.stop(this.audioContext.currentTime + 0.05);
  }

  /**
   * Suono nemico eliminato
   */
  playEnemyDestroyed(): void {
    if (!this.audioContext) return;

    const oscillator = this.audioContext.createOscillator();
    const gainNode = this.audioContext.createGain();

    oscillator.connect(gainNode);
    gainNode.connect(this.audioContext.destination);

    oscillator.frequency.setValueAtTime(200, this.audioContext.currentTime);
    oscillator.frequency.exponentialRampToValueAtTime(600, this.audioContext.currentTime + 0.15);
    oscillator.type = 'sawtooth';

    gainNode.gain.setValueAtTime(0.2, this.audioContext.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, this.audioContext.currentTime + 0.15);

    oscillator.start(this.audioContext.currentTime);
    oscillator.stop(this.audioContext.currentTime + 0.15);
  }
}
