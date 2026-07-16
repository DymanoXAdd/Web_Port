"use client";

import React, { useEffect, useRef, useState } from "react";
import type { PageInfo } from "@/types";
import { useTypewriter } from "@/lib/useTypewriter";

type Props = {
  pageInfo: PageInfo;
};

const EMAIL = "luisaruiz2734@gmail.com";

const VIDEO_SRC =
  "https://cdn.pixabay.com/video/2023/11/17/189457-885804464_medium.mp4";

const TYPEWRITER_TEXT =
  "Glad you stopped in. Good taste tends to find us. Now, what are we building?";

const SENSITIVITY = 0.8;

export default function Hero({ pageInfo }: Props) {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const { displayed, done } = useTypewriter(TYPEWRITER_TEXT);
  const [pillsVisible, setPillsVisible] = useState(false);
  const [copied, setCopied] = useState(false);
  // Drives the hover blur/swap. Toggled purely on mouseenter/mouseleave of the
  // secondary-copy region so it always resets cleanly — nothing can latch.
  const [hovered, setHovered] = useState(false);

  const name = pageInfo?.name || "Luis";
  const role = pageInfo?.role || "Computer Programmer";

  // Reveal action pills 400ms after load, independent of the typewriter.
  useEffect(() => {
    const t = setTimeout(() => setPillsVisible(true), 400);
    return () => clearTimeout(t);
  }, []);

  // Mouse-scrub controlled video. No-ops safely when there is no loaded video
  // (no src / no duration), so the hero still renders with the fallback bg.
  useEffect(() => {
    const video = videoRef.current;
    if (!video || !VIDEO_SRC) return;

    let prevX: number | null = null;
    let targetTime = 0;
    let seeking = false;

    const isReady = () =>
      video.readyState >= 1 &&
      Number.isFinite(video.duration) &&
      video.duration > 0;

    const seekToTarget = () => {
      if (!isReady()) return;
      seeking = true;
      video.currentTime = targetTime;
    };

    const handleMove = (e: MouseEvent) => {
      if (!isReady()) return;
      if (prevX === null) {
        prevX = e.clientX;
        return;
      }
      const delta = e.clientX - prevX;
      prevX = e.clientX;

      const offset =
        (delta / window.innerWidth) * SENSITIVITY * video.duration;
      targetTime = Math.min(
        Math.max(targetTime + offset, 0),
        video.duration
      );

      if (!seeking) seekToTarget();
    };

    const handleSeeked = () => {
      seeking = false;
      // Queue the next seek if the target has moved (prevents seek-flooding).
      if (isReady() && Math.abs(video.currentTime - targetTime) > 0.01) {
        seekToTarget();
      }
    };

    window.addEventListener("mousemove", handleMove);
    video.addEventListener("seeked", handleSeeked);
    return () => {
      window.removeEventListener("mousemove", handleMove);
      video.removeEventListener("seeked", handleSeeked);
    };
  }, []);

  const handleCopyEmail = async () => {
    try {
      await navigator.clipboard.writeText(EMAIL);
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    } catch {
      // Clipboard not available — fail silently, the email is still visible.
    }
  };

  const pills: { label: string; href: string }[] = [
    { label: "See my work", href: "#projects" },
    { label: "About me", href: "#about" },
    { label: "My experience", href: "#experience" },
    { label: "Let's talk", href: "#contact" },
  ];

  return (
    <div className="relative h-screen w-full flex flex-col justify-end pb-12 md:justify-center md:pb-0 px-5 sm:px-8 md:px-10 overflow-hidden">
      {/* Background layer contained within the hero (graceful video fallback). */}
      <div className="absolute inset-0 z-0">
        {/* Styled fallback so the hero looks intentional with no video. */}
        <div
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(135deg, #fafafa 0%, #f0f0f0 45%, #e9e9e9 100%)",
          }}
        />
        {/* The video only renders/scrubs once a direct .mp4 URL is provided. */}
        {VIDEO_SRC ? (
          <video
            ref={videoRef}
            src={VIDEO_SRC}
            muted
            playsInline
            preload="auto"
            className="absolute inset-0 h-full w-full object-cover"
            style={{ objectPosition: "70% center" }}
          />
        ) : null}
      </div>

      <div
        className={`relative z-10 max-w-xl${
          hovered ? " hero-swap-active" : ""
        }`}
      >
        {/* Heading layer: carries the hover blur/swap (via `.hero-heading-layer`,
            toggled by `.hero-swap-active` on the parent). Kept SEPARATE from the
            inner `.hero-intro` so the on-load deblur animation stays clean and no
            non-zero blur is ever pinned inline on `.hero-intro`. */}
        <div className="hero-heading-layer">
          {/* Intro heading: animates in from a blur and resolves to fully
              readable (un-blurred). The `hero-intro` class owns the deblur
              animation + holds the final blur(0) frame (animation-fill-mode). */}
          <div
            className="hero-intro pointer-events-none select-none mb-5 sm:mb-6"
            style={{
              fontSize: "clamp(18px, 4vw, 26px)",
              lineHeight: 1.3,
              fontWeight: 400,
              color: "#000",
              fontFamily: "var(--font-body)",
            }}
          >
            Hey there, I&apos;m {name},
            <br />
            {role}
          </div>
        </div>

        {/* Secondary-copy region: typewriter + pills + email. Owns the hover
            handlers that drive the blur/swap. On leave the state resets, so the
            heading returns to readable — nothing stays stuck. */}
        <div
          data-testid="hero-copy"
          className="hero-secondary-layer"
          onMouseEnter={() => setHovered(true)}
          onMouseLeave={() => setHovered(false)}
        >
        {/* One-shot typewriter line with blinking cursor */}
        <p
          className="mb-5 sm:mb-6 text-black"
          style={{
            fontSize: "clamp(18px, 4vw, 26px)",
            lineHeight: 1.35,
            fontWeight: 400,
            minHeight: "54px",
            fontFamily: "var(--font-body)",
          }}
        >
          {displayed}
          {!done && (
            <span
              className="inline-block w-[2px] h-[1.1em] bg-black align-middle ml-[2px]"
              style={{ animation: "blink 1s step-end infinite" }}
            />
          )}
        </p>

        {/* Action pills */}
        <div
          className="flex flex-wrap gap-y-1"
          style={{
            opacity: pillsVisible ? 1 : 0,
            transform: pillsVisible ? "translateY(0)" : "translateY(8px)",
            transition: "opacity 0.4s ease, transform 0.4s ease",
          }}
        >
          {pills.map((pill) => (
            <a
              key={pill.href}
              href={pill.href}
              className="inline-flex items-center justify-center bg-white text-black border border-black/10 rounded-full text-[13px] sm:text-[15px] px-4 sm:px-5 py-[0.3em] mx-[0.2em] mb-[0.4em] whitespace-nowrap hover:bg-black hover:text-white transition-colors duration-200"
            >
              {pill.label}
            </a>
          ))}

          {/* Email pill — copy to clipboard */}
          <button
            type="button"
            onClick={handleCopyEmail}
            aria-label={`Copy email ${EMAIL}`}
            className="inline-flex items-center justify-center gap-2 sm:gap-3 bg-white text-black border border-black rounded-full text-[13px] sm:text-[15px] px-4 sm:px-5 py-[0.3em] mx-[0.2em] mb-[0.4em] whitespace-nowrap hover:bg-black hover:text-white transition-colors duration-200"
          >
            <span>
              Reach me:{" "}
              <span className="underline underline-offset-1">{EMAIL}</span>
            </span>
            <span aria-hidden="true">
              {copied ? (
                <span className="text-[11px]">Copied!</span>
              ) : (
                <svg
                  width="12"
                  height="12"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
                  <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
                </svg>
              )}
            </span>
          </button>
        </div>
        </div>
      </div>
    </div>
  );
}
