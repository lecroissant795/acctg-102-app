import { useSoundSettings } from "../contexts/SoundSettingsContext.jsx";
import { previewClickSound } from "../utils/mobileClickSound.js";

export function SoundSettingsControls() {
  const { muted, volume, setMuted, setVolume } = useSoundSettings();

  const handleVolumeChange = (event) => {
    setVolume(Number(event.target.value));
  };

  const handleVolumePreview = () => {
    if (muted || volume <= 0) return;
    void previewClickSound(volume);
  };

  const handleToggleMuted = () => {
    const nextMuted = !muted;
    setMuted(nextMuted);
    if (!nextMuted && volume > 0) {
      void previewClickSound(volume);
    }
  };

  return (
    <div className="sound-settings mobile-only">
      <label className="theme-switch">
        <span className="theme-switch__label">Tap sounds</span>
        <button
          type="button"
          role="switch"
          aria-checked={!muted}
          aria-label={muted ? "Turn tap sounds on" : "Turn tap sounds off"}
          className="theme-switch__track"
          onClick={handleToggleMuted}
        >
          <span className="theme-switch__icon theme-switch__icon--light" aria-hidden="true">
            🔊
          </span>
          <span className="theme-switch__thumb" aria-hidden="true" />
          <span className="theme-switch__icon theme-switch__icon--dark" aria-hidden="true">
            🔇
          </span>
        </button>
      </label>

      {!muted && (
        <label className="sound-settings__volume">
          <span className="sound-settings__volume-label">Volume</span>
          <input
            type="range"
            min="0"
            max="100"
            step="5"
            value={volume}
            aria-label="Tap sound volume"
            onChange={handleVolumeChange}
            onPointerUp={handleVolumePreview}
            onKeyUp={handleVolumePreview}
          />
          <span className="sound-settings__volume-value">{volume}%</span>
        </label>
      )}
    </div>
  );
}
