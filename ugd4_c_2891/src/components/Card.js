import React from 'react';
import { FaQuestion } from 'react-icons/fa';

function Card({ card, isFlipped, isMatched, onFlip }) {

  const handleClick = () => {
    if (!isFlipped && !isMatched) {
      onFlip(card.id);
    }
  };

  const isOpen = isFlipped || isMatched;
  const IconComponent = card.icon;

  return (
    <div
      onClick={handleClick}
      className={`
      w-24 h-24 flex items-center justify-center text-3xl
      rounded-2xl cursor-pointer select-none
      transition-all duration-300

      ${isOpen
        ? "bg-white scale-105 shadow-md"
        : "bg-gradient-to-br from-purple-500 to-indigo-600 hover:scale-110 hover:shadow-[0_0_20px_rgba(139,92,246,0.6)]"
      }

      ${isMatched ? "ring-4 ring-green-400 opacity-80" : ""}
      `}
    >
      {isOpen ? (
        <span className={isMatched ? "" : "animate-bounce"}>
          <IconComponent style={{ color: card.color }} />
        </span>
      ) : (
        <FaQuestion className="text-white/70" />
      )}
    </div>
  );
}

export default Card;