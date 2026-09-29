import { useEffect, useRef, type ReactNode } from "react";
import { scroll } from "../hooks/scrollStore";
import { ui } from "../i18n/strings";
import { useLang } from "../i18n/LangContext";

const lerp = (a: number, b: number, t: number) => a + (b - a) * t;

// The concept trick: a full-document duplicate of the page in the honest voice,
// painted vermillion and masked to a single circle that follows the cursor. On
// touch/no-hover devices a draggable handle opens the circle instead.
export default function SpotlightLayer({ children }: { children: ReactNode }) {
  const layerRef = useRef<HTMLDivElement>(null);
  const handleRef = useRef<HTMLButtonElement>(null);
  const { u } = useLang();

  useEffect(() => {
    const layer = layerRef.current;
    if (!layer) return;

    const hover = window.matchMedia("(any-hover: hover)").matches;
    const MIN = 18; // Small default circle cursor
    const MAX = 560; // Expanded reveal spotlight

    const pointer = {
      clientX: window.innerWidth / 2,
      clientY: window.innerHeight / 2,
      active: false,
    };

    const current = { x: window.innerWidth / 2, y: window.innerHeight / 2, size: 0 };
    const target = { ...current };

    const isRowBandElement = (el: Element | null): boolean => {
      if (!el) return false;
      return Boolean(el.closest(".offer-row, .contact-row"));
    };

    const isChangableElement = (el: Element | null): boolean => {
      if (!el) return false;
      if (isRowBandElement(el)) return false;

      return Boolean(
        el.closest(
          '[data-dual-voice="true"], h1, .d-statement, .step-card, blockquote, [data-reveal]'
        )
      );
    };

    const checkOverRowBand = (x: number, y: number): boolean => {
      if (typeof document === "undefined") return false;
      if (document.elementsFromPoint) {
        const elements = document.elementsFromPoint(x, y);
        for (const el of elements) {
          if (isRowBandElement(el)) return true;
        }
      } else {
        const el = document.elementFromPoint(x, y);
        if (isRowBandElement(el)) return true;
      }
      return false;
    };

    const checkOverChangable = (x: number, y: number): boolean => {
      if (typeof document === "undefined") return false;
      if (document.elementsFromPoint) {
        const elements = document.elementsFromPoint(x, y);
        for (const el of elements) {
          if (
            el === document.documentElement ||
            el === document.body ||
            el.id === "root" ||
            el.classList.contains("spotlight-layer")
          ) {
            continue;
          }
          if (isChangableElement(el)) return true;
        }
      } else {
        const el = document.elementFromPoint(x, y);
        if (isChangableElement(el)) return true;
      }
      return false;
    };

    const onPointerMove = (e: PointerEvent) => {
      pointer.clientX = e.clientX;
      pointer.clientY = e.clientY;
      pointer.active = true;
    };

    const onPointerLeave = () => {
      pointer.active = false;
    };

    if (hover) {
      window.addEventListener("pointermove", onPointerMove, { passive: true });
      document.documentElement.addEventListener("pointerleave", onPointerLeave);
    }

    // Touch handle drag support
    const handle = handleRef.current;
    let isDraggingHandle = false;

    const onHandleDown = (e: PointerEvent) => {
      isDraggingHandle = true;
      try {
        (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
      } catch {
        // ignore if not supported
      }
      pointer.clientX = e.clientX;
      pointer.clientY = e.clientY;
      pointer.active = true;
    };

    const onHandleMove = (e: PointerEvent) => {
      if (!isDraggingHandle) return;
      pointer.clientX = e.clientX;
      pointer.clientY = e.clientY;
      pointer.active = true;
    };

    const onHandleUp = (e: PointerEvent) => {
      if (!isDraggingHandle) return;
      isDraggingHandle = false;
      try {
        (e.currentTarget as HTMLElement).releasePointerCapture(e.pointerId);
      } catch {
        // ignore
      }
      pointer.active = false;
    };

    if (handle) {
      handle.addEventListener("pointerdown", onHandleDown);
      handle.addEventListener("pointermove", onHandleMove);
      handle.addEventListener("pointerup", onHandleUp);
      handle.addEventListener("pointercancel", onHandleUp);
    }

    let raf = 0;
    const render = () => {
      if (pointer.active) {
        target.x = pointer.clientX;
        target.y = pointer.clientY + scroll.y;

        if (isDraggingHandle) {
          target.size = MAX;
        } else if (checkOverRowBand(pointer.clientX, pointer.clientY)) {
          target.size = 0;
        } else {
          const isOverText = checkOverChangable(pointer.clientX, pointer.clientY);
          target.size = isOverText ? MAX : MIN;
        }
      } else {
        target.size = 0;
      }

      current.x = lerp(current.x, target.x, 0.16);
      current.y = lerp(current.y, target.y, 0.16);
      current.size = lerp(
        current.size,
        target.size,
        target.size > current.size ? 0.14 : 0.09
      );

      const s = layer.style;
      s.setProperty("--x", `${current.x}px`);
      s.setProperty("--y", `${current.y}px`);
      s.setProperty("--size", `${current.size}px`);

      raf = requestAnimationFrame(render);
    };
    raf = requestAnimationFrame(render);

    return () => {
      cancelAnimationFrame(raf);
      if (hover) {
        window.removeEventListener("pointermove", onPointerMove);
        document.documentElement.removeEventListener("pointerleave", onPointerLeave);
      }
      if (handle) {
        handle.removeEventListener("pointerdown", onHandleDown);
        handle.removeEventListener("pointermove", onHandleMove);
        handle.removeEventListener("pointerup", onHandleUp);
        handle.removeEventListener("pointercancel", onHandleUp);
      }
    };
  }, []);

  return (
    <>
      <div ref={layerRef} className="spotlight-layer" aria-hidden="true">
        {children}
      </div>
      <button
        ref={handleRef}
        className="spotlight-handle"
        aria-hidden="true"
        tabIndex={-1}
        type="button"
      >
        {u(ui.spotlightHandle)
          .split("\n")
          .map((line, i) => (
            <span key={i}>{line}</span>
          ))}
      </button>
    </>
  );
}
