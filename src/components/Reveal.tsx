import { useEffect, useRef, type ElementType, type ReactNode } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

type RevealProps = {
  children: ReactNode;
  as?: ElementType;
  className?: string;
  delay?: number;
  disabled?: boolean;
};

// Masked-line reveal: the child is clipped by an overflow-hidden wrapper and
// slides up into place on scroll. End state is the final layout, so reduced
// motion (which we simply skip animating) leaves content fully visible.
export default function Reveal({
  children,
  as: Tag = "div",
  className = "",
  delay = 0,
  disabled = false,
}: RevealProps) {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const Component: any = Tag;
  const wrapRef = useRef<HTMLSpanElement>(null);
  const innerRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const reduce = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    if (disabled || reduce || !innerRef.current || !wrapRef.current) return;

    const ctx = gsap.context(() => {
      gsap.from(innerRef.current, {
        yPercent: 115,
        duration: 1.1,
        ease: "expo.out",
        delay,
        scrollTrigger: {
          trigger: wrapRef.current,
          start: "top 88%",
          once: true,
        },
      });
    });
    return () => ctx.revert();
  }, [delay, disabled]);

  return (
    <Component className={className}>
      <span ref={wrapRef} className="reveal-mask">
        <span ref={innerRef} className="reveal-line">
          {children}
        </span>
      </span>
    </Component>
  );
}
