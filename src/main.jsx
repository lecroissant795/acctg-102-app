import { createRoot } from "react-dom/client";
import "./styles/global.css";
import App from "./App.jsx";
import { AuthProvider } from "./contexts/AuthContext.jsx";
import { SoundSettingsProvider } from "./contexts/SoundSettingsContext.jsx";
import { StatsProvider } from "./contexts/StatsContext.jsx";
import { ThemeProvider } from "./contexts/ThemeContext.jsx";

const root = createRoot(document.getElementById("root"));
root.render(
  <ThemeProvider>
    <SoundSettingsProvider>
      <AuthProvider>
        <StatsProvider>
          <App />
        </StatsProvider>
      </AuthProvider>
    </SoundSettingsProvider>
  </ThemeProvider>
);
