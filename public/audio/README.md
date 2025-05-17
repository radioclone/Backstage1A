# Audio Files

This directory contains audio files for the Retroverse Festival application.

## Expected Files

The application expects the following audio files:

- `deep-house.mp3`: Deep house music track
- `techno.mp3`: Techno music track
- `ambient.mp3`: Ambient soundscapes track

## Audio Format Requirements

- Format: MP3
- Bitrate: 128kbps or higher
- Sample Rate: 44.1kHz
- Channels: Stereo

## Adding Custom Tracks

To add custom tracks:

1. Place the MP3 files in this directory
2. Update the `mockTracks` array in `src/components/AudioPlayer.tsx` to reference your new files
3. Ensure the file names match the URLs in the component

## Legal Notice

Please ensure you have the rights to use any audio files you add to this directory. Do not include copyrighted material without proper licensing.
