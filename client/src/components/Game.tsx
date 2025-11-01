import { useEffect, useRef } from 'react';
import Phaser from 'phaser';
import { gameConfig } from '@/game/config';

export function Game() {
  const gameRef = useRef<Phaser.Game | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current || gameRef.current) return;

    // Inizializza il gioco Phaser
    gameRef.current = new Phaser.Game({
      ...gameConfig,
      parent: containerRef.current
    });

    // Cleanup quando il componente viene smontato
    return () => {
      if (gameRef.current) {
        gameRef.current.destroy(true);
        gameRef.current = null;
      }
    };
  }, []);

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      <div className="relative">
        {/* Effetto glow intorno al gioco */}
        <div className="absolute inset-0 bg-orange-500/20 blur-3xl rounded-lg"></div>
        
        {/* Container del gioco */}
        <div 
          ref={containerRef} 
          id="game-container"
          className="relative border-4 border-orange-500 rounded-lg shadow-2xl overflow-hidden"
          style={{
            imageRendering: 'pixelated'
          }}
        />
        
        {/* Info sotto il gioco */}
        <div className="mt-4 text-center text-white/80 text-sm">
          <p className="font-bold">Controlli: Frecce per muoversi | P per Pausa | Spazio per iniziare</p>
        </div>
      </div>
    </div>
  );
}
