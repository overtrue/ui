import { StrictMode } from "react"
import { createRoot } from "react-dom/client"
import { HashRouter } from "react-router-dom"
import App from "./App"
import { ThemeProvider } from "@/components/overtrue/theme-customizer"
import "./index.css"
import "./styles/workspace-base.css"
import "./styles/workspace-theme.css"
import "./styles/scenes.css"
import "./styles/showcase.css"

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <ThemeProvider>
      <HashRouter>
        <App />
      </HashRouter>
    </ThemeProvider>
  </StrictMode>,
)
