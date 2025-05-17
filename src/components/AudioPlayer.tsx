'use client';

import { useEffect, useRef, useState } from 'react';
import { useAudio } from '@/hooks/useAudio';
import { AudioTrack } from '@/types/global';

/**
 * Audio player component with visualization
 */
export default function AudioPlayer(): JSX.Element {
  // Get audio functionality
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
  
  // Local state
  const [isExpanded, setIsExpanded] = useState(false);
  
  // Refs
  const canvasRef = useRef<HTMLCanvasElement>(null);
  
  // Mock tracks
  const mockTracks: AudioTrack[] = [
    {
      id: '1',
      title: 'Deep House Vibes',
      artist: 'DJ Retroverse',
      url: '/audio/deep-house.mp3',
      duration: 180
    },
    {
      id: '2',
      title: 'Techno Beats',
      artist: 'DJ Retroverse',
      url: '/audio/techno.mp3',
      duration: 210
    },
    {
      id: '3',
      title: 'Ambient Soundscapes',
      artist: 'DJ Retroverse',
      url: '/audio/ambient.mp3',
      duration: 240
    }
  ];
  
  // Initialize audio visualization
  useEffect(() => {
    if (canvasRef.current && isExpanded) {
      startVisualization(canvasRef.current);
    }
    
    return () => {
      stopVisualization();
    };
  }, [isExpanded, startVisualization, stopVisualization]);
  
  // Toggle player expanded/collapsed
  const toggleExpanded = (): void => {
    setIsExpanded(!isExpanded);
  };
  
  // Handle track selection
  const handleTrackSelect = (track: AudioTrack): void => {
    loadTrack(track);
    play();
  };
  
  // Handle play/pause
  const handlePlayPause = (): void => {
    if (isPlaying) {
      pause();
    } else {
      play();
    }
  };
  
  // Handle volume change
  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    setVolume(parseFloat(e.target.value));
  };
  
  return (
    <div className={`audio-player ${isExpanded ? 'expanded' : 'collapsed'}`}>
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
          position: fixed;
          bottom: 0;
          left: 0;
          width: 100%;
          background-color: rgba(0, 0, 0, 0.8);
          color: white;
          z-index: 100;
          transition: height 0.3s ease;
        }
        
        .audio-player.collapsed {
          height: 60px;
        }
        
        .audio-player.expanded {
          height: 300px;
        }
        
        .player-toggle {
          position: absolute;
          top: 0;
          right: 20px;
          width: 30px;
          height: 20px;
          display: flex;
          justify-content: center;
          align-items: center;
          cursor: pointer;
          background-color: transparent;
          border: 1px solid #ffffff;
          border-radius: 0 0 5px 5px;
        }
        
        .toggle-icon {
          font-size: 12px;
        }
        
        .player-content {
          height: 100%;
          display: flex;
          flex-direction: column;
        }
        
        .player-controls {
          height: 60px;
          display: flex;
          align-items: center;
          padding: 0 20px;
        }
        
        .play-pause-button {
          width: 40px;
          height: 40px;
          border-radius: 50%;
          background-color: #e52e71;
          border: none;
          color: white;
          font-size: 16px;
          display: flex;
          justify-content: center;
          align-items: center;
          cursor: pointer;
        }
        
        .play-pause-button:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }
        
        .track-info {
          margin-left: 20px;
          flex: 1;
        }
        
        .track-title {
          font-weight: bold;
          font-size: 16px;
        }
        
        .track-artist {
          font-size: 14px;
          opacity: 0.7;
        }
        
        .volume-control {
          width: 100px;
        }
        
        .volume-control input {
          width: 100%;
        }
        
        .player-expanded {
          flex: 1;
          display: flex;
          flex-direction: column;
          padding: 0 20px 20px;
        }
        
        .visualization-container {
          height: 100px;
          margin-bottom: 20px;
        }
        
        .visualization-container canvas {
          width: 100%;
          height: 100%;
          background-color: rgba(0, 0, 0, 0.3);
          border-radius: 5px;
        }
        
        .track-list {
          flex: 1;
          overflow-y: auto;
        }
        
        .track-list h3 {
          margin-top: 0;
          margin-bottom: 10px;
        }
        
        .track-list ul {
          list-style: none;
          padding: 0;
          margin: 0;
        }
        
        .track-list li {
          padding: 10px;
          border-radius: 5px;
          margin-bottom: 5px;
          cursor: pointer;
          transition: background-color 0.2s ease;
        }
        
        .track-list li:hover {
          background-color: rgba(255, 255, 255, 0.1);
        }
        
        .track-list li.active {
          background-color: rgba(229, 46, 113, 0.3);
        }
        
        .track-list-title {
          font-weight: bold;
        }
        
        .track-list-artist {
          font-size: 12px;
          opacity: 0.7;
        }
      `}</style>
    </div>
  );
}
