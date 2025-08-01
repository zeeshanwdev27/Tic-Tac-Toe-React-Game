import CalculateWinner from './helper/CalculateWinner.js'
import { useEffect, useState } from "react"

function Square({ value, onSquareClick }) {
  return (
    <button 
      onClick={onSquareClick} 
      className={`
        border-2 border-gray-300 font-bold w-full aspect-square text-5xl 
        transition-all duration-200 hover:bg-gray-50 active:scale-95
        ${value === 'X' ? 'text-blue-500' : 'text-pink-500'}
      `}
    >
      {value}
    </button>
  )
}

function Board({ xisNext, squares, onPlay }) {
  const [isWin, setIsWin] = useState(false)
  const [isDraw, setIsDraw] = useState(false)

  const handleClick = (i) => {
    if (squares[i] || CalculateWinner(squares)) return
    
    const newSquares = squares.slice()
    newSquares[i] = xisNext ? "X" : "O"
    onPlay(newSquares)
  }

  const winner = CalculateWinner(squares);

  useEffect(() => {
    if (winner) {
      setIsWin(true)
      setIsDraw(false)
    } else if (squares.every(square => square !== null)) {
      setIsDraw(true)
      setIsWin(false)
    } else {
      setIsWin(false)
      setIsDraw(false)
    }
  }, [winner, squares])

  let status;
  if (winner) {
    status = `Winner: ${winner} 🎉`
  } else if (isDraw) {
    status = "Game ended in a draw! 🤝"
  } else {
    status = `Next Player: ${xisNext ? "X" : "O"}`
  }

  return (
    <div className="flex flex-col justify-center items-center gap-8 p-6 bg-white rounded-xl shadow-lg">
      <h1 className="font-bold text-4xl bg-gradient-to-r from-blue-500 to-pink-500 bg-clip-text text-transparent">
        Tic-Tac-Toe
      </h1>
      
      <div className={`text-2xl font-semibold p-4 rounded-lg w-full text-center ${
        isWin ? 'bg-green-100 text-green-700 animate-bounce' : 
        isDraw ? 'bg-yellow-100 text-yellow-700' : 
        'bg-gray-100 text-gray-700'
      }`}>
        {status}
      </div>
      
      <div className="grid grid-cols-3 gap-2 w-80 sm:w-96">
        {Array(9).fill(null).map((_, i) => (
          <Square 
            key={i}
            value={squares[i]} 
            onSquareClick={() => handleClick(i)} 
          />
        ))}
      </div>
    </div>
  )
}

function App() {
  
  const [xIsNext, setXisNext] = useState(true)
  const [history, setHistory] = useState([Array(9).fill(null)])
  const [currentMove, setCurrentMove] = useState(0)
  const currentSquares = history[currentMove]

  function handlePlay(nextSquares) {
    const nextHistory = [...history.slice(0, currentMove + 1), nextSquares]
    setHistory(nextHistory)
    setCurrentMove(nextHistory.length - 1)
    setXisNext(!xIsNext)
  }

  function jumpTo(nextMove) {
    setCurrentMove(nextMove)
    setXisNext(nextMove % 2 === 0)
  }

  const moves = history.map((squares, move) => {
    let description;
    if (move > 0) {
      description = `Go to move #${move}`
    } else {
      description = 'Go to game start'
    }

    return (
      <li key={move} className="mb-2">
        <button 
          onClick={() => jumpTo(move)}
          className={`
            w-full px-4 py-2 rounded-lg text-left transition-all
            ${move === currentMove ? 
              'bg-blue-500 text-white font-medium' : 
              'hover:bg-gray-100'}
          `}
        >
          {description}
        </button>
      </li>
    )
  })

  return (
    <main className="min-h-screen bg-gray-50 p-4 md:p-8">
      <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="flex justify-center items-start">
          <Board xisNext={xIsNext} squares={currentSquares} onPlay={handlePlay} />
        </div>
        
        <div className="bg-white p-6 rounded-xl shadow-lg">
          <h2 className="text-2xl font-bold mb-4 text-gray-800">Game History</h2>
          <ol className="space-y-2 max-h-96 overflow-y-auto pr-2">
            {moves}
          </ol>
        </div>
      </div>
    </main>
  )
}

export default App