"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const LETTERS = ["W","E","L","C","O","M","E"," ","I","T","Z","F","I","Z","Z"];

const STATS = [
  { id: "box1", value: "58%", label: "Increase in pick up point use",       style: { top: "5%", right: "30%" } },
  { id: "box2", value: "23%", label: "Decreased in customer phone calls",   style: { bottom: "5%", right: "35%" } },
  { id: "box3", value: "27%", label: "Increase in pick up point use",       style: { top: "5%", right: "10%" } },
  { id: "box4", value: "40%", label: "Decreased in customer phone calls",   style: { bottom: "5%", right: "12.5%" } },
];

export default function HeroSection() {
  const sectionRef  = useRef(null);
  const carRef      = useRef(null);
  const trailRef    = useRef(null);
  const valueAddRef = useRef(null);
  const lettersRef  = useRef([]);
  const boxRefs     = useRef([]);

  useEffect(() => {
    const car     = carRef.current;
    const trail   = trailRef.current;
    const valueAdd = valueAddRef.current;
    const letters = lettersRef.current.filter(Boolean);
    const boxes   = boxRefs.current.filter(Boolean);

    // Load animation: letters stagger in
    letters.forEach((letter, i) => {
      setTimeout(() => {
        letter.style.animation = `letterIn 0.5s cubic-bezier(0.22, 1, 0.36, 1) forwards`;
      }, 80 + i * 60);
    });

    // Stat boxes stagger in after letters
    boxes.forEach((box, i) => {
      setTimeout(() => {
        box.style.animation = `boxIn 0.5s ease forwards`;
      }, 80 + letters.length * 60 + 200 + i * 150);
    });

    //  After load done, hand off to GSAP scroll
    const LOAD_DONE = 80 + letters.length * 60 + 200 + boxes.length * 150 + 500;

    const handoffTimer = setTimeout(() => {
      letters.forEach((letter) => {
        letter.style.animation = "none";
        letter.style.opacity   = "0";
        letter.style.transform = "";
      });
      boxes.forEach((box) => {
        box.style.animation = "none";
        box.style.opacity   = "0";
        box.style.transform = "";
      });

      const valueRect     = valueAdd.getBoundingClientRect();
      const letterOffsets = letters.map((l) => l.offsetLeft);
      const roadWidth     = window.innerWidth;
      const carWidth      = 100;
      const endX          = roadWidth - carWidth;

      // Car moves on scroll
      gsap.to(car, {
        x: endX,
        ease: "none",
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top top",
          end: "bottom top",
          scrub: true,
          pin: ".track",
          invalidateOnRefresh: true,
        },
        onUpdate() {
          const carX = gsap.getProperty(car, "x") + carWidth / 2;
          letters.forEach((letter, i) => {
            const letterX = valueRect.left + letterOffsets[i];
            letter.style.opacity = carX >= letterX ? "1" : "0";
          });
          gsap.set(trail, { width: carX });
        },
      });

      // STEP 4 — Stat boxes fade in at scroll positions
      gsap.to("#box1", { opacity: 1, scrollTrigger: { trigger: sectionRef.current, start: "top+=400 top", end: "top+=600 top", scrub: true } });
      gsap.to("#box2", { opacity: 1, scrollTrigger: { trigger: sectionRef.current, start: "top+=600 top", end: "top+=800 top", scrub: true } });
      gsap.to("#box3", { opacity: 1, scrollTrigger: { trigger: sectionRef.current, start: "top+=800 top", end: "top+=1000 top", scrub: true } });
      gsap.to("#box4", { opacity: 1, scrollTrigger: { trigger: sectionRef.current, start: "top+=1000 top", end: "top+=1200 top", scrub: true } });
    }, LOAD_DONE);

    return () => {
      clearTimeout(handoffTimer);
      ScrollTrigger.getAll().forEach((st) => st.kill());
    };
  }, []);

  return (
    <div className="section" ref={sectionRef}>
      <div className="track">
        <div className="road" id="road">
          {/* eslint-disable-next-line @next/next/no-img-element */}
<img src="/car-scroll-animation/car.png" alt="McLaren 720S" className="car" ref={carRef} />          <div className="trail" ref={trailRef} />
          <div className="value-add" id="valueText" ref={valueAddRef}>
            {LETTERS.map((ch, i) => (
              <span key={i} className="value-letter" ref={(el) => { lettersRef.current[i] = el; }}>
                {ch === " " ? "\u00A0" : ch}
              </span>
            ))}
          </div>
        </div>

        {STATS.map((stat, i) => (
          <div key={stat.id} id={stat.id} className="text-box" style={stat.style} ref={(el) => { boxRefs.current[i] = el; }}>
            <span className="num-box">{stat.value}</span>
            {stat.label}
          </div>
        ))}
    </div>
      <div style={{
        textAlign: "center",
        padding: "20px",
        color: "white",
        fontSize: "16px",
        background: "#121212"
      }}>
        Made by <strong>Samarth Jain</strong>
      </div>
    </div>
  );
}