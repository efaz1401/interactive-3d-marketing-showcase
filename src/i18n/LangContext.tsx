import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { copy, ui, type CopyKey, type Lang, type Voice } from "./strings";

type Bilingual = { en: string; ar: string };

type LangValue = {
  lang: Lang;
  dir: "rtl" | "ltr";
  toggle: () => void;
  // resolve dual-voice copy
  t: (key: CopyKey, voice?: Voice) => string;
  // resolve a plain bilingual string (ui labels)
  u: (b: Bilingual) => string;
};

const LangContext = createContext<LangValue | null>(null);

const STORAGE_KEY = "yfs-lang";

function initialLang(): Lang {
  if (typeof window === "undefined") return "en";
  const saved = window.localStorage.getItem(STORAGE_KEY);
  if (saved === "ar" || saved === "en") return saved;
  return navigator.language?.startsWith("ar") ? "ar" : "en";
}

export function LangProvider({ children }: { children: ReactNode }) {
  const [lang, setLang] = useState<Lang>(initialLang);

  const dir = lang === "ar" ? "rtl" : "ltr";

  useEffect(() => {
    const root = document.documentElement;
    root.setAttribute("lang", lang);
    root.setAttribute("dir", dir);
    window.localStorage.setItem(STORAGE_KEY, lang);
    // Refresh ScrollTrigger so triggers align with newly sized fonts & text lines
    requestAnimationFrame(() => {
      ScrollTrigger.refresh();
    });
  }, [lang, dir]);

  const toggle = useCallback(() => {
    setLang((l) => (l === "en" ? "ar" : "en"));
  }, []);

  const t = useCallback(
    (key: CopyKey, voice: Voice = "polished") => copy[key][voice][lang],
    [lang],
  );

  const u = useCallback((b: Bilingual) => b[lang], [lang]);

  const value = useMemo<LangValue>(
    () => ({ lang, dir, toggle, t, u }),
    [lang, dir, toggle, t, u],
  );

  return <LangContext.Provider value={value}>{children}</LangContext.Provider>;
}

export function useLang() {
  const ctx = useContext(LangContext);
  if (!ctx) throw new Error("useLang must be used within LangProvider");
  return ctx;
}

export { ui };
