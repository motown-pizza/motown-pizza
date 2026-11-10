'use client';

import React from 'react';

const colors = ['#FFCC00', '#E60000', '#36ff10'];

export default function Confetti({ fire }: { fire: boolean }) {
  if (!fire) return null;

  return (
    <>
      <style>{`
        @keyframes confetti-fall {
          from {
            transform: translateY(-10vh) rotate(0deg);
            opacity: 1;
          }
          to {
            transform: translateY(110vh) rotate(720deg);
            opacity: 0;
          }
        }

        .confetti-piece {
          animation: confetti-fall 3s linear forwards;
        }

        @media (prefers-reduced-motion: reduce) {
          .confetti-piece {
            animation: none;
            display: none;
          }
        }
      `}</style>
      <div
        aria-hidden="true"
        style={{
          position: 'fixed',
          inset: 0,
          zIndex: 1000,
          overflow: 'hidden',
          pointerEvents: 'none',
        }}
      >
        {Array.from({ length: 36 }, (_, index) => (
          <span
            key={index}
            className="confetti-piece"
            style={{
              position: 'absolute',
              top: 0,
              left: `${(index * 37) % 100}%`,
              width: 8,
              height: 8,
              backgroundColor: colors[index % colors.length],
              animationDelay: `${(index % 8) * 0.1}s`,
            }}
          />
        ))}
      </div>
    </>
  );
}
