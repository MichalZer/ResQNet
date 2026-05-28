import { Play, Pause, RotateCcw, SkipForward } from 'lucide-react';
import { useSimulationStore } from '../../store';
import { formatTime } from '../../utils';

export function SimulationControls() {
  const {
    isRunning,
    simulationTime,
    totalDuration,
    playbackSpeed,
    setIsRunning,
    setPlaybackSpeed,
    resetSimulation,
    setSimulationTime,
  } = useSimulationStore();

  return (
    <div className="fixed bottom-8 left-8 bg-dark-card border border-dark-border rounded-lg p-4 space-y-4 w-80 z-40">
      {/* Title */}
      <div>
        <h3 className="text-sm font-bold text-dark-text">Simulation Control</h3>
      </div>

      {/* Time Display */}
      <div className="flex items-center justify-between">
        <span className="text-xs text-gray-400">Time:</span>
        <span className="font-mono font-bold text-emergency-cyan">
          {formatTime(simulationTime)} / {formatTime(totalDuration)}
        </span>
      </div>

      {/* Progress Bar */}
      <div className="bg-dark-bg rounded-full h-2 overflow-hidden border border-dark-border">
        <div
          className="h-full bg-gradient-to-r from-emergency-cyan to-emergency-green transition-all duration-200"
          style={{ width: `${(simulationTime / totalDuration) * 100}%` }}
        />
      </div>

      {/* Controls */}
      <div className="flex items-center gap-2">
        <button
          onClick={() => setIsRunning(!isRunning)}
          className={`p-2 rounded-lg transition-colors ${
            isRunning
              ? 'bg-emergency-red hover:bg-red-600 text-white'
              : 'bg-emergency-green hover:bg-green-600 text-white'
          }`}
        >
          {isRunning ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
        </button>

        <button
          onClick={() => resetSimulation()}
          className="p-2 rounded-lg bg-dark-bg hover:bg-dark-border text-gray-400 transition-colors"
        >
          <RotateCcw className="w-4 h-4" />
        </button>

        <button
          onClick={() => setSimulationTime(Math.min(simulationTime + 5, totalDuration))}
          className="p-2 rounded-lg bg-dark-bg hover:bg-dark-border text-gray-400 transition-colors"
        >
          <SkipForward className="w-4 h-4" />
        </button>
      </div>

      {/* Playback Speed */}
      <div className="space-y-2">
        <label className="text-xs text-gray-400">Playback Speed</label>
        <div className="flex gap-2">
          {[0.5, 1, 2, 4].map((speed) => (
            <button
              key={speed}
              onClick={() => setPlaybackSpeed(speed)}
              className={`flex-1 py-1 rounded text-xs font-semibold transition-colors ${
                playbackSpeed === speed
                  ? 'bg-emergency-cyan text-black'
                  : 'bg-dark-bg hover:bg-dark-border text-gray-400'
              }`}
            >
              {speed}x
            </button>
          ))}
        </div>
      </div>

      {/* Simulation Status */}
      <div className="text-xs text-gray-400 bg-dark-bg p-2 rounded border border-dark-border">
        <p>Status: <span className="text-emergency-cyan">{isRunning ? 'RUNNING' : 'PAUSED'}</span></p>
        <p>Speed: <span className="text-emergency-yellow">{playbackSpeed}x</span></p>
      </div>
    </div>
  );
}

export default SimulationControls;
