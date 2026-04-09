import { useEffect, useRef } from 'react';
import { useTasks } from '../context/TaskContext';

const COLORS = ['#FFD700','#FFA500','#22c55e','#005eb6','#FF6B6B','#9B59B6','#1ABC9C','#F39C12'];

function createConfetti() {
  const container = document.getElementById('confetti-root');
  if (!container) return;
  for (let i = 0; i < 80; i++) {
    const piece = document.createElement('div');
    piece.className = 'confetti-piece';
    piece.style.left = Math.random() * 100 + 'vw';
    piece.style.background = COLORS[Math.floor(Math.random() * COLORS.length)];
    piece.style.width = (Math.random() * 8 + 6) + 'px';
    piece.style.height = (Math.random() * 8 + 6) + 'px';
    piece.style.borderRadius = Math.random() > 0.5 ? '50%' : '2px';
    piece.style.animationDuration = (Math.random() * 2 + 2) + 's';
    piece.style.animationDelay = (Math.random() * 1.5) + 's';
    container.appendChild(piece);
    setTimeout(() => piece.remove(), 4500);
  }
}

export default function CelebrationOverlay() {
  const { celebration } = useTasks();
  const triggered = useRef(false);

  useEffect(() => {
    if (celebration && !triggered.current) {
      triggered.current = true;
      createConfetti();
    }
    if (!celebration) triggered.current = false;
  }, [celebration]);

  if (!celebration) return null;

  return (
    <>
      <div id="confetti-root" className="confetti-container" />
      <div className="celebration-overlay">
        <div className="celebration-backdrop" />
        <div className="celebration-card">
          <span className="celebration-emoji">🏆</span>
          <h2 className="celebration-title">Outstanding Work!</h2>
          <p className="celebration-subtitle">
            You've completed all tasks in this project.<br />
            Editorial precision at its finest.
          </p>
          <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'center', fontSize: '1.5rem' }}>
            🎉✨🌟🎊
          </div>
        </div>
      </div>
    </>
  );
}
