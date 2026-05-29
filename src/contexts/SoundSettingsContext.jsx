import { createContext, useContext, useState } from "react";
import {
  DEFAULT_CLICK_SOUND_SETTINGS,
  getClickSoundSettings,
  saveClickSoundSettings,
} from "../utils/mobileClickSound.js";

const SoundSettingsContext = createContext(null);

function clampVolume(value) {
  const volume = Number(value);
  if (!Number.isFinite(volume)) return DEFAULT_CLICK_SOUND_SETTINGS.volume;
  return Math.min(100, Math.max(0, Math.round(volume)));
}

export function SoundSettingsProvider({ children }) {
  const [settings, setSettings] = useState(() => getClickSoundSettings());

  const updateSettings = (patch) => {
    setSettings((current) => {
      const next = { ...current, ...patch };
      saveClickSoundSettings(next);
      return next;
    });
  };

  const setMuted = (muted) => {
    updateSettings({ muted: Boolean(muted) });
  };

  const setVolume = (volume) => {
    updateSettings({ volume: clampVolume(volume) });
  };

  const toggleMuted = () => {
    setMuted(!settings.muted);
  };

  return (
    <SoundSettingsContext.Provider
      value={{
        muted: settings.muted,
        volume: settings.volume,
        setMuted,
        setVolume,
        toggleMuted,
      }}
    >
      {children}
    </SoundSettingsContext.Provider>
  );
}

export function useSoundSettings() {
  const context = useContext(SoundSettingsContext);
  if (!context) {
    throw new Error("useSoundSettings must be used within SoundSettingsProvider");
  }
  return context;
}
