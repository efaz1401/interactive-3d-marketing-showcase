import { lazy, Suspense, useState } from "react";
import { LangProvider, useLang } from "./i18n/LangContext";
import { useLenis } from "./hooks/useLenis";
import Nav from "./components/Nav";
import Preloader from "./components/Preloader";
import SpotlightLayer from "./components/SpotlightLayer";
import PageContent from "./components/PageContent";

// Code-split the Three.js scene so it loads after first paint.
const Character3D = lazy(() => import("./components/Character3D"));

function Site() {
  useLenis();
  const { dir } = useLang();
  const [ready, setReady] = useState(false);

  return (
    <>
      <Preloader onDone={() => setReady(true)} />
      <Nav />
      <Suspense fallback={null}>
        <Character3D rtl={dir === "rtl"} />
      </Suspense>

      {/* Positioned container holds both voice layers in lockstep */}
      <div style={{ position: "relative" }}>
        <main>
          <PageContent voice="polished" />
        </main>
        {ready && (
          <SpotlightLayer>
            <PageContent voice="honest" />
          </SpotlightLayer>
        )}
      </div>
    </>
  );
}

export default function App() {
  return (
    <LangProvider>
      <Site />
    </LangProvider>
  );
}
