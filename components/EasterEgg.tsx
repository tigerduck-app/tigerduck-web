"use client";

import { useEffect } from "react";

const ASCII_ART = `
████████╗██╗ ██████╗ ███████╗██████╗ ██████╗ ██╗   ██╗ ██████╗██╗  ██╗
╚══██╔══╝██║██╔════╝ ██╔════╝██╔══██╗██╔══██╗██║   ██║██╔════╝██║ ██╔╝
   ██║   ██║██║  ███╗█████╗  ██████╔╝██║  ██║██║   ██║██║     █████╔╝ 
   ██║   ██║██║   ██║██╔══╝  ██╔══██╗██║  ██║██║   ██║██║     ██╔═██╗ 
   ██║   ██║╚██████╔╝███████╗██║  ██║██████╔╝╚██████╔╝╚██████╗██║  ██╗
   ╚═╝   ╚═╝ ╚═════╝ ╚══════╝╚═╝  ╚═╝╚═════╝  ╚═════╝  ╚═════╝╚═╝  ╚═╝
`;

const KONAMI = [
  "ArrowUp",
  "ArrowUp",
  "ArrowDown",
  "ArrowDown",
  "ArrowLeft",
  "ArrowRight",
  "ArrowLeft",
  "ArrowRight",
  "b",
  "a",
];

export default function EasterEgg() {
  useEffect(() => {
    console.log(
      "%c" + ASCII_ART,
      "color: #F05138; font-family: monospace; font-size: 8px; line-height: 1.2;"
    );
    console.log(
      "%c🐯🦆 TigerDuck — 由臺科學生建造的校園助手",
      "color: #FFD54F; font-size: 14px; font-weight: bold;"
    );
    console.log(
      "%c👋 想一起建造嗎？https://github.com/tigerduck-app/tigerduck-app",
      "color: #4a90d9; font-size: 12px;"
    );
    console.log(
      "%c🎮 試試看 Konami Code: ↑↑↓↓←→←→BA",
      "color: #9ca3af; font-size: 11px;"
    );

    let sequence: string[] = [];

    const handleKey = (e: KeyboardEvent) => {
      sequence = [...sequence, e.key].slice(-KONAMI.length);

      if (sequence.join(",") === KONAMI.join(",")) {
        console.log(
          "%c🎉 KONAMI CODE ACTIVATED! 你找到彩蛋了！OAO",
          "color: #F05138; font-size: 20px; font-weight: bold; background: #FFD54F; padding: 8px 16px; border-radius: 8px;"
        );

        const overlay = document.createElement("div");
        overlay.setAttribute("data-testid", "konami-reveal");
        overlay.style.cssText =
          "position:fixed;inset:0;z-index:9999;display:flex;align-items:center;justify-content:center;background:rgba(0,0,0,0.8);font-size:80px;cursor:pointer;";
        overlay.textContent = "🐯🦆";
        overlay.onclick = () => overlay.remove();
        document.body.appendChild(overlay);
        setTimeout(() => overlay.remove(), 3000);
      }
    };

    window.addEventListener("keydown", handleKey);

    return () => window.removeEventListener("keydown", handleKey);
  }, []);

  return null;
}
