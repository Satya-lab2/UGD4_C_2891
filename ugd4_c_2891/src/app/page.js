'use client';

import React, { useState, useEffect } from 'react';
import GameBoard from '../components/GameBoard';
import ScoreBoard from '../components/ScoreBoard';

import { GiCardJoker } from 'react-icons/gi';
import { FaAppleAlt, FaLemon, FaHeart, FaStar, FaMoon, FaFire, FaSmile, FaMeh, FaSkull } from 'react-icons/fa';
import { IoDiamond } from "react-icons/io5";
import { AiFillThunderbolt } from "react-icons/ai";

const ICONS = [
  { icon: FaAppleAlt, color: '#ef4444' },
  { icon: FaLemon, color: '#eab308' },
  { icon: FaHeart, color: '#ec4899' },
  { icon: FaStar, color: '#f97316' },
  { icon: IoDiamond, color: '#06b6d4' },
  { icon: AiFillThunderbolt, color: '#a855f7' },
  { icon: FaMoon, color: '#22c55e' },
  { icon: FaFire, color: '#f43f5e' }
];

const shuffleArray = (array) => {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
};

const createCards = (pairCount) => {
  const selected = ICONS.slice(0, pairCount);

  const paired = selected.flatMap((item, index) => [
    { id: index * 2, icon: item.icon, color: item.color, pairId: index },
    { id: index * 2 + 1, icon: item.icon, color: item.color, pairId: index },
  ]);

  return shuffleArray(paired);
};

export default function Home() {

  const [difficulty, setDifficulty] = useState(4);
  const [cards, setCards] = useState([]);
  const [flippedCards, setFlippedCards] = useState([]);
  const [matchedCards, setMatchedCards] = useState([]);
  const [moves, setMoves] = useState(0);
  const [time, setTime] = useState(0);

  useEffect(() => {
    resetGame();
  }, [difficulty]);

  useEffect(() => {
    const timer = setInterval(() => {
      if (matchedCards.length !== cards.length && cards.length > 0) {
        setTime(prev => prev + 1);
      }
    }, 1000);

    return () => clearInterval(timer);
  }, [matchedCards, cards]);

  useEffect(() => {
    if (flippedCards.length === 2) {
      const [a, b] = flippedCards;
      const first = cards.find(c => c.id === a);
      const second = cards.find(c => c.id === b);

      setMoves(prev => prev + 1);

      if (first.pairId === second.pairId) {
        setMatchedCards(prev => [...prev, a, b]);
        setFlippedCards([]);
      } else {
        setTimeout(() => setFlippedCards([]), 800);
      }
    }
  }, [flippedCards, cards]);

  const handleFlip = (id) => {
    if (flippedCards.length < 2 && !flippedCards.includes(id)) {
      setFlippedCards(prev => [...prev, id]);
    }
  };

  const resetGame = () => {
    setCards(createCards(difficulty));
    setFlippedCards([]);
    setMatchedCards([]);
    setMoves(0);
    setTime(0);
  };

  const shuffleCards = () => {
    setCards(createCards(difficulty));
    setFlippedCards([]);
    setMatchedCards([]);
    setMoves(0);
    setTime(0); 
  };

  const levels = [
    { level: 4, label: "Easy", icon: FaSmile, color: "from-green-400 to-emerald-500" },
    { level: 6, label: "Medium", icon: FaMeh, color: "from-yellow-400 to-orange-400" },
    { level: 8, label: "Hard", icon: FaSkull, color: "from-red-500 to-pink-500" },
  ];

  return (
    <div className="min-h-screen flex flex-col items-center justify-center 
    bg-gradient-to-br from-black via-red-900 to-black p-6 text-white">

      {/* TITLE */}
      <h1 className="text-5xl font-extrabold mb-6 flex gap-3 items-center">
        <GiCardJoker className="text-yellow-400 text-5xl"/>
        <span className="bg-gradient-to-r from-yellow-200 via-pink-400 to-purple-400 bg-clip-text text-transparent">
          Memory Card
        </span>
      </h1>

      <div className="flex gap-4 mb-8">
        {levels.map(item => {
          const Icon = item.icon;

          return (
            <button
              key={item.level}
              onClick={() => setDifficulty(item.level)}
              className={`
                group flex items-center gap-2 px-6 py-3 rounded-full font-semibold
                transition-all duration-300

                ${
                  difficulty === item.level
                    ? `bg-gradient-to-r ${item.color} text-white scale-110 shadow-[0_0_20px_rgba(255,255,255,0.3)]`
                    : "bg-white/10 backdrop-blur-md border border-white/20 text-white hover:bg-white/20 hover:scale-105"
                }
              `}
            >
              <Icon className="text-lg transition-transform duration-300 group-hover:rotate-12" />
              {item.label}
            </button>
          );
        })}
      </div>

      <ScoreBoard
        moves={moves}
        matchedCount={matchedCards.length / 2}
        totalPairs={difficulty}
        time={time}
        onReset={resetGame}
        onShuffle={shuffleCards}
      />

      <div className="bg-white/10 backdrop-blur-md p-8 rounded-2xl shadow-2xl mt-6">
        <GameBoard
          cards={cards}
          flippedCards={flippedCards}
          matchedCards={matchedCards}
          onFlip={handleFlip}
        />
      </div>

    </div>
  );
}