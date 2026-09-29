import { useEffect, useState } from "react";
import { useLang } from "../i18n/LangContext";
import { ui } from "../i18n/strings";

function RollLink({ href, label }: { href: string; label: string }) {
  return (
    <a href={href} className="label rollup" style={{ color: "inherit" }}>
      <span className="rollup__inner">
        <span>{label}</span>
        <span aria-hidden="true" style={{ color: "var(--c-accent)" }}>
          {label}
        </span>
      </span>
    </a>
  );
}

export default function Nav() {
  const { u, lang, toggle } = useLang();
  const [hidden, setHidden] = useState(false);

  // hide on scroll-down, show on scroll-up
  useEffect(() => {
    let last = window.scrollY;
    const onScroll = () => {
      const y = window.scrollY;
      setHidden(y > last && y > 200);
      last = y;
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className="container-x"
      style={{
        position: "fixed",
        top: 0,
        insetInline: 0,
        zIndex: 50,
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        paddingBlock: "1.4rem",
        transform: hidden ? "translateY(-120%)" : "translateY(0)",
        transition: "transform 0.5s cubic-bezier(0.16,1,0.3,1)",
        mixBlendMode: "difference",
      }}
    >
      <a
        href="#top"
        className="font-display"
        style={{
          fontWeight: 800,
          fontSize: "1.05rem",
          letterSpacing: lang === "ar" ? 0 : "-0.02em",
          color: "#fff",
        }}
      >
        {u(ui.brand)}
      </a>

      <nav
        style={{ display: "flex", alignItems: "center", gap: "clamp(1rem,3vw,2.5rem)" }}
      >
        <span style={{ color: "#fff" }} className="nav-hide-sm">
          <RollLink href="#offer" label={u(ui.navOffer)} />
        </span>
        <span style={{ color: "#fff" }} className="nav-hide-sm">
          <RollLink href="#pricing" label={u(ui.navPricing)} />
        </span>
        <span style={{ color: "#fff" }}>
          <RollLink href="#contact" label={u(ui.navContact)} />
        </span>
        <button
          type="button"
          onClick={toggle}
          className="label"
          style={{
            color: "#fff",
            background: "transparent",
            border: "1px solid rgba(255,255,255,0.45)",
            borderRadius: 0,
            padding: "0.45rem 0.85rem",
            cursor: "pointer",
            transition: "all 0.25s cubic-bezier(0.16,1,0.3,1)",
          }}
          onMouseEnter={(e) => {
            (e.currentTarget as HTMLElement).style.borderColor = "var(--c-accent)";
            (e.currentTarget as HTMLElement).style.color = "var(--c-accent)";
          }}
          onMouseLeave={(e) => {
            (e.currentTarget as HTMLElement).style.borderColor = "rgba(255,255,255,0.45)";
            (e.currentTarget as HTMLElement).style.color = "#fff";
          }}
          aria-label="Toggle language"
        >
          {u(ui.langToggle)}
        </button>
      </nav>
    </header>
  );
}
