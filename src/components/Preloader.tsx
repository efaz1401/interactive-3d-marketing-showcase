import { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useLang } from "../i18n/LangContext";
import { ui } from "../i18n/strings";

// Percentage preloader. Ties to document.readyState + a hard cap so it never
// hangs, then lifts a curtain and refreshes ScrollTrigger against final height.
export default function Preloader({ onDone }: { onDone?: () => void }) {
  const { u } = useLang();
  const [pct, setPct] = useState(0);
  const [gone, setGone] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);
  const numRef = useRef({ v: 0 });

  useEffect(() => {
    const reduce = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;

    let finished = false;
    const finish = () => {
      if (finished) return;
      finished = true;
      gsap.to(numRef.current, {
        v: 100,
        duration: reduce ? 0 : 0.5,
        ease: "power2.out",
        onUpdate: () => setPct(Math.floor(numRef.current.v)),
        onComplete: () => {
          const lift = () => {
            setGone(true);
            document.body.style.overflow = "";
            ScrollTrigger.refresh();
            onDone?.();
          };
          if (reduce || !rootRef.current) return lift();
          gsap.to(rootRef.current, {
            clipPath: "inset(0 0 100% 0)",
            duration: 0.9,
            ease: "expo.inOut",
            onComplete: lift,
          });
        },
      });
    };

    document.body.style.overflow = "hidden";

    // creep the counter while assets load
    const creep = gsap.to(numRef.current, {
      v: 92,
      duration: 2.2,
      ease: "power1.out",
      onUpdate: () => setPct(Math.floor(numRef.current.v)),
    });

    const cap = window.setTimeout(finish, 2600);
    if (document.readyState === "complete") {
      window.setTimeout(finish, 500);
    } else {
      window.addEventListener("load", () => window.setTimeout(finish, 300), {
        once: true,
      });
    }

    return () => {
      creep.kill();
      window.clearTimeout(cap);
      document.body.style.overflow = "";
    };
  }, [onDone]);

  if (gone) return null;

  return (
    <div
      ref={rootRef}
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 100,
        background: "var(--c-bg)",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        gap: "2rem",
      }}
    >
      <span className="label">{u(ui.loading)}</span>
      <span
        className="display d-huge"
        style={{ color: "var(--c-fg)", lineHeight: 1 }}
      >
        {String(pct).padStart(2, "0")}
      </span>
      <span
        style={{
          position: "absolute",
          bottom: "2rem",
          width: "min(80vw, 480px)",
          height: 1,
          background: "rgba(255,255,255,0.15)",
          overflow: "hidden",
        }}
      >
        <span
          style={{
            display: "block",
            height: "100%",
            width: `${pct}%`,
            background: "var(--c-accent)",
            transition: "width 0.2s linear",
          }}
        />
      </span>
    </div>
  );
}
