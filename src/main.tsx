import { StrictMode } from "react"
import { createRoot } from "react-dom/client"
import { HashRouter } from "react-router-dom"
import App from "./App"
import { ThemeProvider } from "@/components/overtrue/theme-customizer"
import "@fontsource-variable/mona-sans/wdth.css"
import "@fontsource-variable/jetbrains-mono/wght.css"
import "./index.css"
import "./styles/workspace-base.css"
import "./styles/workspace-theme.css"
import "./styles/scenes.css"
import "./styles/showcase.css"
import "./styles/native-select.css"
import "./styles/workspace-modern.css"

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <ThemeProvider>
      <HashRouter>
        <App />
      </HashRouter>
    </ThemeProvider>
  </StrictMode>,
)
