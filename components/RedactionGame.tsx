import React, { useEffect, useRef } from 'react';

const RedactionGame: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const W = 320, H = 240;
    const GREEN = "#00ff66";
    const RED = "#ff0000";
    const WHITE = "#ffffff";
    const BG = "#000000";

    const keys = new Set<string>();
    const handleKeyDown = (e: KeyboardEvent) => { keys.add(e.code); if (["ArrowLeft","ArrowRight","ArrowUp","ArrowDown"].includes(e.code)) e.preventDefault(); };
    const handleKeyUp = (e: KeyboardEvent) => keys.delete(e.code);
    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("keyup", handleKeyUp);

    const player = { x: W/2, y: H - 30, w: 10, h: 10, score: 0, lives: 3 };
    let items: any[] = [];
    let particles: any[] = [];
    let gameActive = true;

    function spawnItem() {
      items.push({
        x: Math.random() * (W - 10),
        y: -20,
        type: Math.random() > 0.3 ? 'noise' : 'truth',
        speed: 1.5 + Math.random() * 2
      });
    }

    function update() {
      if (!gameActive) return;
      if (keys.has("ArrowLeft")) player.x -= 3;
      if (keys.has("ArrowRight")) player.x += 3;
      player.x = Math.max(0, Math.min(W - player.w, player.x));

      if (Math.random() < 0.05) spawnItem();

      items = items.filter(item => {
        item.y += item.speed;
        
        // Collision
        if (player.x < item.x + 10 && player.x + player.w > item.x && player.y < item.y + 10 && player.y + player.h > item.y) {
          if (item.type === 'truth') player.score += 100;
          else { player.lives--; player.score = Math.max(0, player.score - 50); }
          if (player.lives <= 0) gameActive = false;
          return false;
        }
        return item.y < H;
      });
    }

    function render() {
      ctx!.fillStyle = BG; ctx!.fillRect(0, 0, W, H);
      
      // Player
      ctx!.fillStyle = WHITE; ctx!.fillRect(player.x, player.y, player.w, player.h);
      ctx!.strokeStyle = GREEN; ctx!.strokeRect(player.x - 2, player.y - 2, player.w + 4, player.h + 4);

      // Items
      for (const item of items) {
        ctx!.fillStyle = item.type === 'truth' ? WHITE : RED;
        ctx!.fillRect(item.x, item.y, 8, 8);
        if (item.type === 'noise') {
           ctx!.font = "8px monospace";
           ctx!.fillText("FAKE", item.x - 5, item.y - 2);
        }
      }

      // HUD
      ctx!.fillStyle = GREEN;
      ctx!.font = "10px monospace";
      ctx!.fillText(`SCORE: ${player.score}`, 10, 20);
      ctx!.fillText(`LIVES: ${player.lives}`, 10, 35);

      if (!gameActive) {
        ctx!.fillStyle = "rgba(0,0,0,0.8)";
        ctx!.fillRect(0, 0, W, H);
        ctx!.fillStyle = GREEN;
        ctx!.textAlign = "center";
        ctx!.fillText("UPLINK INTERRUPTED", W/2, H/2);
        ctx!.fillText("TRUTH WAS COMPROMISED", W/2, H/2 + 20);
      }
    }

    function frame() { update(); render(); if (gameActive) requestAnimationFrame(frame); }
    frame();

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("keyup", handleKeyUp);
      gameActive = false;
    };
  }, []);

  return <canvas ref={canvasRef} width="320" height="240" className="w-full max-w-[640px] aspect-[4/3] bg-black image-render-pixelated" />;
};

export default RedactionGame;