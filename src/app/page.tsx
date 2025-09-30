'use client';

import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

type Player = 'B' | 'E' | null;
type Board = Player[];
type GameResult = 'B' | 'E' | 'tie' | null;

interface GameStats {
  bWins: number;
  eWins: number;
  ties: number;
}

const WINNING_COMBINATIONS = [
  [0, 1, 2], [3, 4, 5], [6, 7, 8], // Rows
  [0, 3, 6], [1, 4, 7], [2, 5, 8], // Columns
  [0, 4, 8], [2, 4, 6] // Diagonals
];

export default function TicTacBased() {
  const [board, setBoard] = useState<Board>(Array(9).fill(null));
  const [currentPlayer, setCurrentPlayer] = useState<Player>('B');
  const [gameResult, setGameResult] = useState<GameResult>(null);
  const [stats, setStats] = useState<GameStats>({ bWins: 0, eWins: 0, ties: 0 });
  const [showControls, setShowControls] = useState<boolean>(true);
  const [isMobile, setIsMobile] = useState<boolean>(false);

  // Check for mobile device
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Hide controls after 5 seconds
  useEffect(() => {
    const timer = setTimeout(() => {
      setShowControls(false);
    }, 5000);

    return () => clearTimeout(timer);
  }, []);

  // Check for winner
  const checkWinner = (currentBoard: Board): GameResult => {
    for (const combination of WINNING_COMBINATIONS) {
      const [a, b, c] = combination;
      if (currentBoard[a] && currentBoard[a] === currentBoard[b] && currentBoard[a] === currentBoard[c]) {
        return currentBoard[a] as 'B' | 'E';
      }
    }
    
    if (currentBoard.every(cell => cell !== null)) {
      return 'tie';
    }
    
    return null;
  };

  // Handle cell click
  const handleCellClick = (index: number): void => {
    if (board[index] || gameResult) return;

    const newBoard = [...board];
    newBoard[index] = currentPlayer;
    setBoard(newBoard);

    const result = checkWinner(newBoard);
    if (result) {
      setGameResult(result);
      setStats(prev => ({
        ...prev,
        bWins: result === 'B' ? prev.bWins + 1 : prev.bWins,
        eWins: result === 'E' ? prev.eWins + 1 : prev.eWins,
        ties: result === 'tie' ? prev.ties + 1 : prev.ties
      }));
    } else {
      setCurrentPlayer(currentPlayer === 'B' ? 'E' : 'B');
    }
  };

  // Reset game
  const resetGame = (): void => {
    setBoard(Array(9).fill(null));
    setCurrentPlayer('B');
    setGameResult(null);
  };

  // Reset all stats
  const resetStats = (): void => {
    setStats({ bWins: 0, eWins: 0, ties: 0 });
  };

  // Toggle controls visibility
  const toggleControls = (): void => {
    setShowControls(!showControls);
  };

  // Get cell styling based on content
  const getCellStyling = (cell: Player): string => {
    if (!cell) return 'text-gray-400 hover:text-white';
    if (cell === 'B') return 'text-blue-400 font-bold';
    return 'text-purple-400 font-bold';
  };

  // Get status message
  const getStatusMessage = (): string => {
    if (gameResult === 'B') return '🎉 Base (B) Wins!';
    if (gameResult === 'E') return '💜 Ethereum (E) Wins!';
    if (gameResult === 'tie') return '🤝 It\'s a tie!';
    return `${currentPlayer === 'B' ? 'Base (B)' : 'Ethereum (E)'}'s turn`;
  };

  return (
    <main className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900 p-4 pt-12 md:pt-8 relative">
      {/* Control Box */}
      {showControls && (
        <div className={`absolute z-10 ${isMobile ? 'top-4 left-4' : 'top-8 left-1/2 transform -translate-x-1/2'}`}>
          <Card className="bg-gray-800/90 border-gray-700 backdrop-blur-sm">
            <CardContent className="p-3">
              <div className="flex items-center gap-2 text-xs text-gray-300">
                <span className="font-semibold">Controls:</span>
                <span>Click cells to play</span>
                {!isMobile && <span>• R - Reset</span>}
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={toggleControls}
                  className="ml-2 h-5 w-5 p-0 text-gray-400 hover:text-white"
                >
                  ×
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Show controls button */}
      {!showControls && (
        <Button
          variant="ghost"
          size="sm"
          onClick={toggleControls}
          className={`absolute z-10 ${isMobile ? 'top-4 left-4' : 'top-8 left-8'} text-gray-400 hover:text-white bg-gray-800/50 hover:bg-gray-700/50`}
        >
          ?
        </Button>
      )}

      <div className="max-w-md mx-auto space-y-6">
        {/* Header */}
        <div className="text-center space-y-2">
          <h1 className="text-4xl font-bold text-white mb-2">Tic Tac Based</h1>
          <p className="text-blue-300">Base (B) vs Ethereum (E)</p>
        </div>

        {/* Game Status */}
        <Card className="bg-gray-800/50 border-gray-700 backdrop-blur-sm">
          <CardContent className="p-4 text-center">
            <div className="text-lg font-semibold text-white mb-2">
              {getStatusMessage()}
            </div>
            <div className="flex justify-center gap-4 text-sm">
              <Badge variant="outline" className="border-blue-400 text-blue-400">
                B: {stats.bWins}
              </Badge>
              <Badge variant="outline" className="border-purple-400 text-purple-400">
                E: {stats.eWins}
              </Badge>
              <Badge variant="outline" className="border-gray-400 text-gray-400">
                Ties: {stats.ties}
              </Badge>
            </div>
          </CardContent>
        </Card>

        {/* Game Board */}
        <Card className="bg-gray-800/50 border-gray-700 backdrop-blur-sm">
          <CardContent className="p-6">
            <div className="grid grid-cols-3 gap-3 max-w-xs mx-auto">
              {board.map((cell, index) => (
                <button
                  key={index}
                  onClick={() => handleCellClick(index)}
                  disabled={!!cell || !!gameResult}
                  className={`
                    aspect-square bg-gray-700 hover:bg-gray-600 
                    border-2 border-gray-600 hover:border-gray-500 
                    rounded-lg transition-all duration-200 
                    text-3xl font-bold flex items-center justify-center
                    disabled:cursor-not-allowed
                    ${getCellStyling(cell)}
                    ${!cell && !gameResult ? 'hover:scale-105' : ''}
                  `}
                >
                  {cell}
                </button>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Controls */}
        <div className="flex gap-3 justify-center">
          <Button
            onClick={resetGame}
            variant="outline"
            className="bg-gray-700 border-gray-600 text-white hover:bg-gray-600 hover:border-gray-500"
          >
            New Game
          </Button>
          <Button
            onClick={resetStats}
            variant="outline"
            className="bg-gray-700 border-gray-600 text-white hover:bg-gray-600 hover:border-gray-500"
          >
            Reset Stats
          </Button>
        </div>

        {/* Mobile Touch Instructions */}
        {isMobile && (
          <Card className="bg-gray-800/30 border-gray-700 backdrop-blur-sm">
            <CardContent className="p-3 text-center">
              <p className="text-sm text-gray-400">
                Tap any empty cell to make your move
              </p>
            </CardContent>
          </Card>
        )}

        {/* Game Info */}
        <Card className="bg-gray-800/30 border-gray-700 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="text-lg text-center text-white">About Tic Tac Based</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 text-sm text-gray-300">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 bg-blue-400 rounded flex items-center justify-center text-white font-bold text-xs">B</div>
              <span>Base coin - Always plays first</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 bg-purple-400 rounded flex items-center justify-center text-white font-bold text-xs">E</div>
              <span>Ethereum - Plays second</span>
            </div>
            <p className="text-center mt-3 text-gray-400">
              Get 3 in a row to win! 🚀
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Keyboard Controls */}
      <div className="sr-only">
        Press R to reset the game, or click on any empty cell to make your move
      </div>
    </main>
  );
}