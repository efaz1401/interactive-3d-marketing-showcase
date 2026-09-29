import { useState } from "react";
import { useLang } from "../i18n/LangContext";
import { contacts, ui, type Voice } from "../i18n/strings";
import Reveal from "./Reveal";

type SectionProps = { voice: Voice; still: boolean };

// `voice` selects polished vs honest copy; `still` disables scroll reveals for
// the duplicated spotlight layer so its text is always in place under the mask.

function Hero({ voice, still }: SectionProps) {
  const { t, lang } = useLang();
  const lines = ["heroLine1", "heroLine2", "heroLine3", "heroLine4", "heroLine5"] as const;
  const accentLines = new Set([1, 2]); // index of emphasized words
  return (
    <section id="top" className="container-x" style={{ minHeight: "100svh", display: "flex", flexDirection: "column", justifyContent: "flex-end", paddingBottom: "clamp(3rem,8vh,7rem)", paddingTop: "8rem" }}>
      <h1 className="display d-hero" data-dual-voice="true" style={{ margin: 0 }}>
        {lines.map((key, i) => (
          <Reveal key={key} as="span" disabled={still} delay={i * 0.06}>
            <span
              data-dual-voice="true"
              style={{
                display: "block",
                color: accentLines.has(i) && voice === "polished" ? "var(--c-accent)" : "inherit",
                fontWeight: accentLines.has(i) ? 900 : 700,
              }}
            >
              {t(key, voice)}
            </span>
          </Reveal>
        ))}
      </h1>
      <div style={{ maxWidth: "42ch", marginTop: "2.5rem", marginInlineStart: lang === "ar" ? "auto" : 0 }}>
        <Reveal disabled={still} delay={0.3}>
          <p className="desc" data-dual-voice="true" style={{ margin: 0, minHeight: "clamp(54px, 5vw, 72px)" }}>{t("heroSub", voice)}</p>
        </Reveal>
      </div>
    </section>
  );
}

function About({ voice, still }: SectionProps) {
  const { t } = useLang();
  return (
    <section className="section container-x">
      <Reveal disabled={still}><span className="label" data-dual-voice="true">{t("aboutLabel", voice)}</span></Reveal>
      <div style={{ maxWidth: "min(38ch, 1080px)", marginTop: "3rem", marginInlineStart: "clamp(0rem, 8vw, 14rem)" }}>
        <Reveal disabled={still} delay={0.05}>
          <p className="display d-statement" data-dual-voice="true" style={{ margin: 0, fontWeight: 700, minHeight: "clamp(160px, 18vw, 240px)" }}>{t("aboutBody", voice)}</p>
        </Reveal>
      </div>
    </section>
  );
}

function OfferRowItem({
  n,
  titleKey,
  descKey,
  still,
  index,
}: {
  n: string;
  titleKey: "offer1Title" | "offer2Title" | "offer3Title" | "offer4Title";
  descKey: "offer1Desc" | "offer2Desc" | "offer3Desc" | "offer4Desc";
  still: boolean;
  index: number;
}) {
  const { t } = useLang();
  const [hovered, setHovered] = useState(false);

  return (
    <div
      className={`rule-top offer-row ${hovered ? "offer-row--active" : ""}`}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <Reveal disabled={still} delay={index * 0.04}>
        <span className="label offer-row__num">{n}</span>
      </Reveal>
      <Reveal disabled={still} delay={index * 0.04 + 0.03}>
        <span className="display offer-row__title">{t(titleKey, "polished")}</span>
      </Reveal>
      <Reveal disabled={still} delay={index * 0.04 + 0.06}>
        <span className="desc offer-row__desc">{t(descKey, hovered ? "honest" : "polished")}</span>
      </Reveal>
    </div>
  );
}

function Offer({ voice, still }: SectionProps) {
  const { t } = useLang();
  const rows = [
    { n: "01", title: "offer1Title" as const, desc: "offer1Desc" as const },
    { n: "02", title: "offer2Title" as const, desc: "offer2Desc" as const },
    { n: "03", title: "offer3Title" as const, desc: "offer3Desc" as const },
    { n: "04", title: "offer4Title" as const, desc: "offer4Desc" as const },
  ];
  return (
    <section id="offer" className="section container-x">
      <Reveal disabled={still}><span className="label" data-dual-voice="true">{t("offerLabel", voice)}</span></Reveal>
      <div style={{ marginTop: "3.5rem" }}>
        {rows.map((r, i) => (
          <OfferRowItem
            key={r.n}
            n={r.n}
            titleKey={r.title}
            descKey={r.desc}
            still={still}
            index={i}
          />
        ))}
      </div>
    </section>
  );
}

function Pricing({ voice, still }: SectionProps) {
  const { t } = useLang();
  return (
    <section id="pricing" className="section container-x" style={{ textAlign: "center" }}>
      <Reveal disabled={still}><span className="label" data-dual-voice="true">{t("priceLabel", voice)}</span></Reveal>
      <div data-dual-voice="true" style={{ marginTop: "2rem", display: "flex", alignItems: "flex-start", justifyContent: "center", gap: "0.5rem" }}>
        <Reveal as="span" disabled={still}>
          <span className="display d-huge" style={{ color: voice === "polished" ? "var(--c-accent)" : "inherit", fontWeight: 900, lineHeight: 0.85 }}>1000</span>
        </Reveal>
        <span className="label" style={{ marginTop: "0.8rem" }}>{t("priceCurrency", voice)}</span>
      </div>
      <div style={{ maxWidth: "34ch", margin: "2.5rem auto 0" }}>
        <Reveal disabled={still} delay={0.1}><p className="desc" data-dual-voice="true" style={{ margin: 0, minHeight: "clamp(48px, 4vw, 64px)" }}>{t("priceNote", voice)}</p></Reveal>
      </div>
    </section>
  );
}

function Process({ voice, still }: SectionProps) {
  const { t, u } = useLang();
  const steps = [
    { day: "step1Day", body: "step1" },
    { day: "step2Day", body: "step2" },
    { day: "step3Day", body: "step3" },
    { day: "step4Day", body: "step4" },
  ] as const;
  const dayMap: Record<string, { en: string; ar: string }> = {
    step1Day: { en: "Day 1", ar: "اليوم ١" },
    step2Day: { en: "Day 2–4", ar: "اليوم ٢–٤" },
    step3Day: { en: "Day 5–6", ar: "اليوم ٥–٦" },
    step4Day: { en: "Day 7", ar: "اليوم ٧" },
  };
  return (
    <section className="section container-x">
      <Reveal disabled={still}><span className="label" data-dual-voice="true">{t("processLabel", voice)}</span></Reveal>
      <div style={{ marginTop: "3.5rem", display: "grid", gap: "0", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))" }}>
        {steps.map((s, i) => (
          <div
            key={s.day}
            data-dual-voice="true"
            style={{
              paddingBlock: "2rem",
              paddingInlineEnd: "1.5rem",
              paddingInlineStart: 0,
              borderTop: "var(--rule)",
            }}
          >
            <Reveal disabled={still} delay={i * 0.05}>
              <span className="display" style={{ fontSize: "clamp(1.4rem,2.4vw,2rem)", fontWeight: 800, color: "var(--c-neutral)" }}>{u(dayMap[s.day])}</span>
            </Reveal>
            <div style={{ marginTop: "1rem" }}>
              <Reveal disabled={still} delay={i * 0.05 + 0.05}>
                <p className="desc" style={{ margin: 0, fontSize: "clamp(1rem,1.2vw,1.15rem)", minHeight: "clamp(70px, 6vw, 96px)" }}>{t(s.body, voice)}</p>
              </Reveal>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

function Testimonials({ voice, still }: SectionProps) {
  const { t, u } = useLang();
  const items = [
    { q: "test1", by: "test1By" },
    { q: "test2", by: "test2By" },
    { q: "test3", by: "test3By" },
  ] as const;
  const byMap: Record<string, { en: string; ar: string }> = {
    test1By: { en: "Sara — bakery owner", ar: "سارة — صاحبة مخبز" },
    test2By: { en: "Khalid — consultant", ar: "خالد — مستشار" },
    test3By: { en: "Noura — photographer", ar: "نورة — مصورة" },
  };
  return (
    <section className="section container-x">
      <Reveal disabled={still}><span className="label" data-dual-voice="true">{t("testLabel", voice)}</span></Reveal>
      <div style={{ marginTop: "3rem", display: "grid", gap: "clamp(2rem,4vw,4rem)", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))" }}>
        {items.map((it, i) => (
          <blockquote key={it.q} data-dual-voice="true" style={{ margin: 0 }}>
            <span className="display" aria-hidden style={{ color: "var(--c-accent)", fontSize: "3rem", lineHeight: 0.5, display: "block", marginBottom: "1rem" }}>“</span>
            <Reveal disabled={still} delay={i * 0.05}>
              <p className="desc" style={{ margin: 0, fontSize: "clamp(1.15rem,1.6vw,1.4rem)", minHeight: "clamp(90px, 8vw, 120px)" }}>{t(it.q, voice)}</p>
            </Reveal>
            <footer className="label" style={{ marginTop: "1.5rem" }}>{u(byMap[it.by])}</footer>
          </blockquote>
        ))}
      </div>
    </section>
  );
}

function Motto({ voice, still }: SectionProps) {
  const { t } = useLang();
  return (
    <section className="section container-x" style={{ textAlign: "center" }}>
      <div style={{ maxWidth: "min(26ch, 860px)", margin: "0 auto" }}>
        <Reveal disabled={still}>
          <p className="display d-statement" data-dual-voice="true" style={{ margin: 0, fontWeight: 800, minHeight: "clamp(90px, 9vw, 130px)" }}>{t("motto", voice)}</p>
        </Reveal>
      </div>
    </section>
  );
}

function ContactRowItem({
  c,
}: {
  c: (typeof contacts)[number];
}) {
  const { u, lang } = useLang();
  const [hovered, setHovered] = useState(false);

  return (
    <a
      href={c.href}
      target="_blank"
      rel="noreferrer"
      className={`rule-top contact-row ${hovered ? "contact-row--active" : ""}`}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <span className="display contact-row__title" style={{ fontSize: "clamp(1.3rem,2.2vw,1.9rem)", fontWeight: 700 }}>{u(c.label)}</span>
      <span className="desc contact-row__value" dir="ltr" style={{ fontSize: "clamp(0.95rem,1.1vw,1.1rem)", unicodeBidi: "plaintext" }}>{c.value}</span>
      <span className="label contact-row__sub">{c.sub[hovered ? "honest" : "polished"][lang]}</span>
    </a>
  );
}

function Footer({ voice, still }: SectionProps) {
  const { t, u } = useLang();
  return (
    <section id="contact" className="section container-x" style={{ paddingBottom: "4rem" }}>
      <Reveal disabled={still}><span className="label" data-dual-voice="true">{t("footerLabel", voice)}</span></Reveal>
      <div style={{ maxWidth: "min(28ch, 860px)", marginTop: "2rem" }}>
        <Reveal disabled={still} delay={0.05}>
          <p className="display d-statement" data-dual-voice="true" style={{ margin: 0, fontWeight: 800, minHeight: "clamp(90px, 10vw, 140px)" }}>{t("footerHead", voice)}</p>
        </Reveal>
      </div>

      <div style={{ marginTop: "4rem" }}>
        {contacts.map((c, i) => (
          <ContactRowItem key={i} c={c} />
        ))}
      </div>

      <div style={{ marginTop: "5rem", display: "flex", justifyContent: "space-between", flexWrap: "wrap", gap: "1rem" }}>
        <span className="label">{u(ui.brand)}</span>
        <span className="label" data-dual-voice="true" style={{ color: "var(--c-muted)" }}>© {new Date().getFullYear()} · 1000 {t("priceCurrency", voice)} · 7 {u({ en: "days", ar: "أيام" })}</span>
      </div>
    </section>
  );
}

export default function PageContent({ voice }: { voice: Voice }) {
  const still = voice === "honest";
  return (
    <>
      <Hero voice={voice} still={still} />
      <About voice={voice} still={still} />
      <Offer voice={voice} still={still} />
      <Pricing voice={voice} still={still} />
      <Process voice={voice} still={still} />
      <Testimonials voice={voice} still={still} />
      <Motto voice={voice} still={still} />
      <Footer voice={voice} still={still} />
    </>
  );
}
