'use client';

import { useEffect, useRef, useState } from 'react';
import { useAudio } from '@/hooks/useAudio';
import { AudioTrack } from '@/types/global';

/**
 * Audio player component with visualization
 */
export const mockTracks: AudioTrack[] = [
  {
    id: '1',
    title: 'Drama',
    artist: 'Manu Ferrantini',
    url: '/audio/Drama.mp3',
    duration: 180
  },
  {
    id: '2',
    title: 'Group of Hippies',
    artist: 'Breger',
    url: '/audio/Group of Hippies.mp3',
    duration: 210
  },
  {
    id: '3',
    title: 'Robotic Soul',
    artist: 'Tomy Wahl & Los Cabra',
    url: '/audio/Robotic Soul.mp3',
    duration: 240
  }
];

export default function AudioPlayer(): JSX.Element {
  const { 
    currentTrack, 
    isPlaying, 
    volume, 
    loadTrack, 
    play, 
    pause, 
    setVolume,
    startVisualization,
    stopVisualization
  } = useAudio();
  
  const [isExpanded, setIsExpanded] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (canvasRef.current && isExpanded) {
      startVisualization(canvasRef.current);
    }
    
    return () => {
      stopVisualization();
    };
  }, [isExpanded, startVisualization, stopVisualization]);

  const toggleExpanded = (): void => {
    setIsExpanded(!isExpanded);
  };

  const handleTrackSelect = (track: AudioTrack): void => {
    loadTrack(track);
    play();
  };

  const handlePlayPause = (): void => {
    if (isPlaying) {
      pause();
    } else {
      play();
    }
  };

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    setVolume(parseFloat(e.target.value));
  };

  return (
    <div className={`audio-player ${isExpanded ? 'expanded' : 'collapsed'}`}>
      {/* Repositioned toggle button */}
      <div className="player-toggle" onClick={toggleExpanded}>
        <div className="toggle-icon">
          {isExpanded ? '▼' : '▲'}
        </div>
      </div>
      
      <div className="player-content">
        <div className="player-controls">
          <button 
            className="play-pause-button" 
            onClick={handlePlayPause}
            disabled={!currentTrack}
          >
            {isPlaying ? '❚❚' : '▶'}
          </button>
          
          <div className="track-info">
            <div className="track-title">
              {currentTrack ? currentTrack.title : 'No track selected'}
            </div>
            <div className="track-artist">
              {currentTrack ? currentTrack.artist : 'Select a track to play'}
            </div>
          </div>
          
          <div className="volume-control">
            <input
              type="range"
              min="0"
              max="1"
              step="0.01"
              value={volume}
              onChange={handleVolumeChange}
            />
          </div>
        </div>
        
        {isExpanded && (
          <div className="player-expanded">
            <div className="visualization-container">
              <canvas ref={canvasRef} width="300" height="100" />
            </div>
            
            <div className="track-list">
              <h3>Tracks</h3>
              <ul>
                {mockTracks.map((track) => (
                  <li 
                    key={track.id} 
                    className={currentTrack?.id === track.id ? 'active' : ''}
                    onClick={() => handleTrackSelect(track)}
                  >
                    <div className="track-list-title">{track.title}</div>
                    <div className="track-list-artist">{track.artist}</div>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        )}
      </div>

      <style jsx>{`
  .audio-player {
    position: relative;
  }

  .player-toggle {
    position: fixed; /* Repositioned to avoid overlap */
    top: 20px; /* Adjusted to the top-left corner */
    left: 20px;
    z-index: 150; /* Ensure it appears above most elements but below the chat */
    background-color: rgba(0, 0, 0, 0.8);
    border: 1px solid #ffffff;
    border-radius: 5px;
    padding: 5px 10px; /* Adjusted padding for better alignment */
    color: white;
    font-size: 1rem; /* Adjusted font size for better visibility */
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    width: 50px; /* Fixed width to prevent resizing */
    height: 50px; /* Fixed height to prevent resizing */
  }

  .toggle-icon {
    font-size: 1.5rem; /* Adjusted size for better visibility */
    line-height: 1; /* Prevents extra spacing */
  }

  .player-content {
    padding: 10px;
  }

  .player-controls {
    display: flex;
    align-items: center;
    justify-content: space-between;
  }

  .play-pause-button {
    background-color: transparent;
    border: 1px solid #ffffff;
    border-radius: 5px;
    color: white;
    font-size: 1.5rem;
    cursor: pointer;
  }

  .track-info {
    flex: 1;
    margin-left: 10px;
  }

  .track-title {
    font-weight: bold;
  }

  .track-artist {
    font-size: 0.9rem;
    opacity: 0.7;
  }

  .volume-control input {
    width: 100px;
  }

  .player-expanded {
    margin-top: 20px;
  }

  .visualization-container {
    margin-bottom: 20px;
  }

  .track-list {
    margin-top: 10px;
  }

  .track-list ul {
    list-style: none;
    padding: 0;
  }

  .track-list li {
    padding: 10px;
    border: 1px solid #ffffff;
    border-radius: 5px;
    margin-bottom: 5px;
    cursor: pointer;
  }

  .track-list li.active {
    background-color: rgba(255, 255, 255, 0.1);
  }
`}</style>
    </div>
  );
}